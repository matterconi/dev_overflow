"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import type {
  ActionResponse,
  CreateAnswerParams,
  DeleteAnswerParams,
  ErrorResponse,
  GetAnswersParams,
} from "@/types/action";
import type { Answer as AnswerType } from "@/types/global";

import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import AnswerModel, { IAnswerDoc } from "@/database/answer.model";
import Vote from "@/database/vote.model";
import User from "@/database/user.model";

import handleError from "../handlers/error";
import { AnswerServerSchema, DeleteAnswerSchema, GetAnswersSchema } from "../validations";
import action from "../handlers/actions";
import { createInteraction } from "./interaction.action";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const sessionUserEmail = validationResult?.session?.user?.email;

  let authorId = userId;

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    const existingUser = sessionUserEmail
      ? await User.findOne({ email: sessionUserEmail }).select("_id")
      : null;

    if (!existingUser?._id) {
      throw new Error("Unable to resolve authenticated user for answer creation");
    }

    authorId = existingUser._id.toString();
  }

  if (!authorId) {
    throw new Error("Unable to resolve authenticated user for answer creation");
  }

  const resolvedAuthorId = authorId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Question not found");

    const [newAnswer] = await AnswerModel.create(
      [
        {
          author: resolvedAuthorId,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    await createInteraction({
      action: "post",
      actionId: newAnswer._id.toString(),
      actionTarget: "answer",
      authorId: resolvedAuthorId,
    });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(
  params: GetAnswersParams
): Promise<
  ActionResponse<{
    answers: AnswerType[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } =
    validationResult.params;
  const skip = (page - 1) * pageSize;

  let sortCriteria: Record<string, 1 | -1> = { createdAt: -1 };

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const query = { question: questionId };

    const totalAnswers = await AnswerModel.countDocuments(query);

    const answers = await AnswerModel.find(query)
      .populate("author", "_id name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)) as AnswerType[],
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const { user } = validationResult.session!;

  const session = await mongoose.startSession();
  let answerAuthorId = "";

  try {
    session.startTransaction();

    const answer = await AnswerModel.findById(answerId).session(session);
    if (!answer) throw new Error("Answer not found");
    answerAuthorId = answer.author.toString();

    if (answerAuthorId !== user?.id)
      throw new Error("You're not allowed to delete this answer");

    await Question.findByIdAndUpdate(
      answer.question,
      { $inc: { answers: -1 } },
      { returnDocument: "after", session }
    );

    await Vote.deleteMany({ actionId: answerId, actionType: "answer" }).session(session);

    await AnswerModel.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();

    await createInteraction({
      action: "delete",
      actionId: answerId,
      actionTarget: "answer",
      authorId: answerAuthorId,
    });

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
