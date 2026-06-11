'use server'

import mongoose from "mongoose";
import type { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";

import {
  ActionResponse,
  CreateVoteParams,
  ErrorResponse,
  HasVotedParams,
  HasVotedResponse,
} from "@/types/action";
import ROUTES from "@/constants/routes";

import action from "../handlers/actions";
import handleError from "../handlers/error";
import { CreateVoteSchema, HasVotedSchema } from "../validations";
import { Answer, Question, User, Vote } from "@/database";
import { createInteraction } from "./interaction.action";

interface CreateVoteResult {
  targetId: string;
  targetType: "question" | "answer";
  userId: string;
  voteType: "upvote" | "downvote";
}

const voteFieldMap = {
  upvote: "upvotes",
  downvote: "downvotes",
} as const;

async function applyVoteDelta(
  params: {
    targetId: string;
    targetType: "question" | "answer";
    voteType: "upvote" | "downvote";
    change: 1 | -1;
  },
  session?: ClientSession
) {
  const { targetId, targetType, voteType, change } = params;
  const voteField = voteFieldMap[voteType];
  const Model = targetType === "question" ? Question : Answer;

  await Model.findByIdAndUpdate(
    targetId,
    {
      $inc: { [voteField]: change },
    },
    { returnDocument: "after", session }
  );
}

async function submitVote(
  params: CreateVoteParams
): Promise<ActionResponse<CreateVoteResult>> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params;
  const sessionUserId = validationResult.session?.user?.id;
  const sessionUserEmail = validationResult.session?.user?.email;

  let authorId = sessionUserId;

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    const existingUser = sessionUserEmail
      ? await User.findOne({ email: sessionUserEmail }).select("_id")
      : null;

    if (!existingUser?._id) {
      throw new Error("Unable to resolve authenticated user for voting");
    }

    authorId = existingUser._id.toString();
  }

  if (!authorId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  const TargetModel = targetType === "question" ? Question : Answer;
  const target = await TargetModel.findById(targetId).select("author").lean();

  if (!target) {
    return handleError(new Error("Target not found")) as ErrorResponse;
  }

  if (String(target.author) === authorId) {
    return handleError(
      new Error("You cannot vote for your own content")
    ) as ErrorResponse;
  }

  let pathToRevalidate = "";
  let isNewVote = false;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const voteField = voteFieldMap[voteType];
    const existingVote = await Vote.findOne({
        author: authorId,
        actionId: targetId,
        actionType: targetType,
    }).session(session);

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            await Vote.deleteOne({
                _id: existingVote._id
            }).session(session);

            await applyVoteDelta({
              targetId,
              targetType,
              voteType,
              change: -1,
            }, session);
        } else {
            const previousVoteField = voteFieldMap[existingVote.voteType as "upvote" | "downvote"];

            await Vote.findByIdAndUpdate(existingVote._id, {
              voteType,
            }).session(session);

            const Model = targetType === "question" ? Question : Answer;

            await Model.findByIdAndUpdate(targetId, {
              $inc: {
                [previousVoteField]: -1,
                [voteField]: 1,
              },
            }).session(session);
        }
    } else {
        await Vote.create(
          [
            {
              author: authorId,
              actionId: targetId,
              actionType: targetType,
              voteType,
            },
          ],
          { session }
        );

        await applyVoteDelta({
          targetId,
          targetType,
          voteType,
          change: 1,
        }, session);

        isNewVote = true;
    }

    await session.commitTransaction();

    if (isNewVote) {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: String(target.author),
      });
    }

    if (targetType === "question") {
      pathToRevalidate = ROUTES.QUESTION(targetId);
    } else {
      const answer = await Answer.findById(targetId).select("question").lean();

      if (answer?.question) {
        pathToRevalidate = ROUTES.QUESTION(String(answer.question));
      }
    }

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return handleError(e) as ErrorResponse
  }

  session.endSession();

  return {
    success: true,
    data: { targetId, targetType, userId: authorId, voteType },
  };
}

async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params;
  const sessionUserId = validationResult.session?.user?.id;
  const sessionUserEmail = validationResult.session?.user?.email;

  let authorId = sessionUserId;

  if (!authorId && sessionUserEmail) {
    const existingUser = await User.findOne({ email: sessionUserEmail }).select("_id");
    authorId = existingUser?._id?.toString();
  }

  if (!authorId) {
    return {
      success: false,
      data: { hasUpvoted: false, hasDownvoted: false },
    };
  }

  try {
    const vote = await Vote.findOne({
      author: authorId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (e) {
    return handleError(e) as ErrorResponse;
  }
}

export { hasVoted, submitVote };
