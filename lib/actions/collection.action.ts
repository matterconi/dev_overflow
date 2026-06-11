"use server";

import mongoose, { PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Collection, Question, User } from "@/database";
import action from "@/lib/handlers/actions";
import handleError from "@/lib/handlers/error";
import { PaginatedSearchParamsSchema } from "@/lib/validations";
import { CollectionBaseSchema } from "@/lib/validations/collection.validation";
import { escapeRegex } from "@/lib/utils";
import type {
  ActionResponse,
  CollectionBaseParam,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/types/action";
import type { Collection as CollectionType } from "@/types/global";

interface ToggleSaveQuestionResult {
  saved: boolean;
  questionId: string;
}

interface HasSavedQuestionResult {
  saved: boolean;
}

export async function hasSavedQuestion(
  params: CollectionBaseParam
): Promise<ActionResponse<HasSavedQuestionResult>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params;
  const sessionUserId = validationResult.session?.user?.id;
  const sessionUserEmail = validationResult.session?.user?.email;

  let authorId = sessionUserId;

  if (!authorId && sessionUserEmail) {
    const existingUser = await User.findOne({ email: sessionUserEmail }).select("_id");
    authorId = existingUser?._id?.toString();
  }

  if (!authorId) {
    return { success: true, data: { saved: false } };
  }

  try {
    const collection = await Collection.findOne({
      author: authorId,
      question: questionId,
    });

    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collections: CollectionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const sessionUserId = validationResult.session?.user?.id;
  const sessionUserEmail = validationResult.session?.user?.email;

  let authorId = sessionUserId;

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    const existingUser = sessionUserEmail
      ? await User.findOne({ email: sessionUserEmail }).select("_id")
      : null;

    if (!existingUser?._id) {
      throw new Error("Unable to resolve authenticated user for collection");
    }

    authorId = existingUser._id.toString();
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria: Record<string, 1 | -1> = sortOptions[
    filter as keyof typeof sortOptions
  ] ?? { "question.createdAt": -1 };

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(authorId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      const searchRegex = new RegExp(escapeRegex(query), "i");

      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: searchRegex } },
            { "question.content": { $regex: searchRegex } },
          ],
        },
      });
    }

    const [countResult] = await Collection.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const totalCount: number = countResult?.total ?? 0;

    pipeline.push(
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: limit },
      { $project: { question: 1, author: 1 } }
    );

    const collections = await Collection.aggregate(pipeline);
    const isNext = totalCount > skip + collections.length;

    return {
      success: true,
      data: {
        collections: JSON.parse(JSON.stringify(collections)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function toggleSaveQuestion(
  params: CollectionBaseParam
): Promise<ActionResponse<ToggleSaveQuestionResult>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params;
  const sessionUserId = validationResult.session?.user?.id;
  const sessionUserEmail = validationResult.session?.user?.email;

  let authorId = sessionUserId;

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    const existingUser = sessionUserEmail
      ? await User.findOne({ email: sessionUserEmail }).select("_id")
      : null;

    if (!existingUser?._id) {
      throw new Error("Unable to resolve authenticated user for collection");
    }

    authorId = existingUser._id.toString();
  }

  try {
    const question = await Question.findById(questionId).select("_id");

    if (!question) {
      throw new Error("Question not found");
    }

    const existingCollection = await Collection.findOne({
      author: authorId,
      question: questionId,
    });

    let saved = false;

    if (existingCollection) {
      await Collection.findByIdAndDelete(existingCollection._id);
    } else {
      try {
        await Collection.create({
          author: authorId,
          question: questionId,
        });
      } catch (error) {
        const isDuplicateKeyError =
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === 11000;

        if (!isDuplicateKeyError) {
          throw error;
        }
      }

      saved = true;
    }

    revalidatePath(ROUTES.QUESTION_DETAILS(questionId));

    return {
      success: true,
      data: {
        saved,
        questionId,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
