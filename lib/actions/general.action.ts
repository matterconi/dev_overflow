"use server";

import { Answer, Question, Tag, User } from "@/database";
import type { ActionResponse, ErrorResponse } from "@/types/action";

import action from "../handlers/actions";
import handleError from "../handlers/error";
import { GlobalSearchSchema } from "../validations";
import { escapeRegex } from "../utils";

export type GlobalSearchResult = {
  title: string;
  type: string;
  id: string;
};

interface GlobalSearchParams {
  query: string;
  type?: string;
}

const modelsAndTypes = [
  { model: Question, searchField: "title", type: "question" },
  { model: User, searchField: "name", type: "user" },
  { model: Answer, searchField: "content", type: "answer" },
  { model: Tag, searchField: "name", type: "tag" },
];

export async function globalSearch(
  params: GlobalSearchParams
): Promise<ActionResponse<GlobalSearchResult[]>> {
  const validationResult = await action({
    params,
    schema: GlobalSearchSchema,
    authorize: false,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { query, type } = validationResult.params;
  const regexQuery = { $regex: escapeRegex(query), $options: "i" };
  const results: GlobalSearchResult[] = [];

  try {
    const searchTargets = type
      ? modelsAndTypes.filter((m) => m.type === type)
      : modelsAndTypes;

    for (const { model, searchField, type: resultType } of searchTargets) {
      const queryResults = await model
        .find({ [searchField]: regexQuery })
        .limit(2);

      results.push(
        ...queryResults.map((item) => ({
          title:
            resultType === "answer"
              ? `Answers containing "${query}"`
              : item[searchField],
          type: resultType,
          id:
            resultType === "answer"
              ? item.question.toString()
              : item._id.toString(),
        }))
      );
    }

    return { success: true, data: results };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
