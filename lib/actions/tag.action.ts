"use server";

import { cache } from "react";

import type { ActionResponse, ErrorResponse, PaginatedSearchParams } from "@/types/action";
import type { Question as QuestionType, Tag as TagType } from "@/types/global";
import { GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "@/lib/validations";
import action from "@/lib/handlers/actions";
import handleError from "@/lib/handlers/error";
import Tag from "@/database/tag.model";
import QuestionModel from "@/database/question.model";
import { GetTagQuestionsParams } from "@/types/action";
import { escapeRegex } from "@/lib/utils";
import dbConnect from "@/lib/mongoose";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: (TagType & { questions?: number })[]; isNext: boolean }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {
    questions: { $gt: 0 },
  };

  if (query) {
    filterQuery.name = { $regex: new RegExp(escapeRegex(query), "i") };
  }

  let sortCriteria: Record<string, 1 | -1> = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    case "newest":
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const tags = await Tag.find(filterQuery).lean().sort(sortCriteria).skip(skip).limit(limit);
    const totalTags = await Tag.countDocuments(filterQuery);
    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)) as (TagType & { questions?: number })[], isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTopTags = async (): Promise<
  ActionResponse<(TagType & { questions: number })[]>
> => {
  try {
    await dbConnect();

    const tags = await Tag.find().sort({ questions: -1 }).limit(5).select("_id name questions").lean();

    return { success: true, data: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagsQuestions = cache(async (
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{ tag: TagType; questions: QuestionType[]; isNext: boolean }>
> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { tagId, page = 1, pageSize = 10, query } = validationResult.params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId).lean();

    if (!tag) {
      throw new Error("Tag not found");
    }

    const filterQuery: Record<string, unknown> = {
      tags: tagId,
    };

    if (query) {
      const searchRegex = new RegExp(escapeRegex(query), "i");

      filterQuery.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
      ];
    }

    const questions = await QuestionModel.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalQuestions = await QuestionModel.countDocuments(filterQuery);
    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)) as TagType,
        questions: JSON.parse(JSON.stringify(questions)) as QuestionType[],
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});
