"use server";

import { cache } from "react";

import mongoose, { Types } from "mongoose";

import { Answer as AnswerModel, Question as QuestionModel, User as UserModel } from "@/database";
import action from "@/lib/handlers/actions";
import handleError from "@/lib/handlers/error";
import { GetUserAnswersSchema, GetUserQuestionsSchema, GetUserSchema, GetUserTopTagsSchema, PaginatedSearchParamsSchema, UpdateUserSchema } from "@/lib/validations";
import { assignBadges, escapeRegex } from "@/lib/utils";
import type {
  ActionResponse,
  ErrorResponse,
  GetUserAnswersParams,
  GetUserParams,
  GetUserQuestionsParams,
  GetUserTopTagsParams,
  PaginatedSearchParams,
  UpdateUserParams,
} from "@/types/action";
import type { Answer, BadgeCount, Question, Tag, User } from "@/types/global";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    const searchRegex = new RegExp(escapeRegex(query), "i");

    filterQuery.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  let sortCriteria: Record<string, 1 | -1> = { createdAt: -1 };

  switch (filter) {
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1, createdAt: -1 };
      break;
    case "newest":
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await UserModel.countDocuments(filterQuery);
    const users = await UserModel.find(filterQuery)
      .select("_id name username email bio image location portfolio reputation")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)) as User[],
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getUser = cache(async function getUser(
  params: GetUserParams
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params;

  try {
    const user = await UserModel.findById(userId).select(
      "_id name username email bio image location portfolio reputation"
    );

    if (!user) {
      return handleError(new Error("User not found")) as ErrorResponse;
    }

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)) as User,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function getUserStats(
  params: GetUserParams
): Promise<ActionResponse<{ totalQuestions: number; totalAnswers: number; badges: BadgeCount }>> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params;

  try {
    const [questionStats] = await QuestionModel.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          views: { $sum: "$views" },
        },
      },
    ]);

    const [answerStats] = await AnswerModel.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const badges = assignBadges({
      criteria: [
        { type: "QUESTION_COUNT", count: questionStats?.count ?? 0 },
        { type: "ANSWER_COUNT", count: answerStats?.count ?? 0 },
        { type: "QUESTION_UPVOTES", count: (questionStats?.upvotes ?? 0) + (answerStats?.upvotes ?? 0) },
        { type: "TOTAL_VIEWS", count: questionStats?.views ?? 0 },
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionStats?.count ?? 0,
        totalAnswers: answerStats?.count ?? 0,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(
  params: GetUserQuestionsParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalQuestions = await QuestionModel.countDocuments({ author: userId });

    const questions = await QuestionModel.find({ author: userId })
      .populate("tags", "_id name")
      .populate("author", "_id name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)) as Question[],
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(
  params: GetUserAnswersParams
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const totalAnswers = await AnswerModel.countDocuments({ author: userId });

    const answers = await AnswerModel.find({ author: userId })
      .populate("author", "_id name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)) as Answer[],
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export { getUserAnswers as getUsersAnswers };

export async function getUserTopTags(
  params: GetUserTopTagsParams
): Promise<ActionResponse<{ tags: (Tag & { count: number })[] }>> {
  const validationResult = await action({
    params,
    schema: GetUserTopTagsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params;

  try {
    const tags = await QuestionModel.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tag",
        },
      },
      { $unwind: "$tag" },
      {
        $project: {
          _id: "$tag._id",
          name: "$tag.name",
          count: 1,
        },
      },
    ]);

    return {
      success: true,
      data: { tags },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateUser(
  params: UpdateUserParams
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: UpdateUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return handleError(new Error("Unable to resolve authenticated user")) as ErrorResponse;
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: params },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return handleError(new Error("User not found")) as ErrorResponse;
    }

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(updatedUser)) as User },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
