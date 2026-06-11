"use server";

import { cache } from "react";

import type {
  ActionResponse,
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  ErrorResponse,
  getQuestionParams,
  IncrementViewsParams,
  PaginatedSearchParams,
  RecommendationParams,
} from "@/types/action";
import type { Question as QuestionType } from "@/types/global";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "@/lib/validations";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import { createInteraction } from "./interaction.action";
import mongoose, { Types } from "mongoose";
import { auth } from "@/auth";
import { Interaction } from "@/database";
import Tag, { ITagDoc } from "@/database/tag.model";
import QuestionModel, { IQuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import User from "@/database/user.model";
import Question from "@/database/question.model";
import Collection from "@/database/collection.model";
import Answer from "@/database/answer.model";
import Vote from "@/database/vote.model";
import { revalidatePath } from "next/cache";
import { escapeRegex } from "@/lib/utils";
import dbConnect from "@/lib/mongoose";

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({
        params,
        schema: AskQuestionSchema,
        authorize: true,
    })  

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags } = validationResult.params;
    const sessionUserId = validationResult.session?.user?.id;
    const sessionUserEmail = validationResult.session?.user?.email;

    let authorId = sessionUserId;

    // In some auth flows session.user.id can be a non-Mongo identifier.
    // Resolve a valid Mongo ObjectId from the user email when needed.
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
        const existingUser = sessionUserEmail
            ? await User.findOne({ email: sessionUserEmail }).select("_id")
            : null;

        if (!existingUser?._id) {
            throw new Error("Unable to resolve authenticated user for question creation");
        }

        authorId = existingUser._id.toString();
    }

    if (!authorId) {
        throw new Error("Unable to resolve authenticated user for question creation");
    }

    const resolvedAuthorId = authorId;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await QuestionModel.create(
          [{ title, content, author: resolvedAuthorId }],
          { session }
        );

        if (!question) {
            throw new Error("Failed to create question");
        }

        const normalizedTags = [...new Set(
            tags
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)
        )];

        const tagIds: mongoose.Types.ObjectId[] = [];

        const tagQuestionDocuments = [];

        for (const tag of normalizedTags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: tag },
                {
                    $setOnInsert: { name: tag },
                    $inc: { questions: 1 },
                },
                { upsert: true, returnDocument: "after", session }
            );

            if (!existingTag?._id) {
                throw new Error(`Failed to create or update tag: ${tag}`);
            }

            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({
                tag: existingTag._id,
                question: question._id,
            });
        }

        await TagQuestion.insertMany(tagQuestionDocuments, { session });

        await QuestionModel.findByIdAndUpdate(
            question._id,
            {
                $push: { tags: { $each: tagIds } },
            },
            { session }
        );

        await session.commitTransaction();

        await createInteraction({
          action: "post",
          actionId: question._id.toString(),
          actionTarget: "question",
          authorId: resolvedAuthorId,
        });

        return { success: true, data: JSON.parse(JSON.stringify(question))}
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestionDoc>> {
    const validationResult = await action({
        params,
        schema: EditQuestionSchema,
        authorize: true,
    })  

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { title, content, tags } = validationResult.params;
    const sessionUserId = validationResult.session?.user?.id;
    const sessionUserEmail = validationResult.session?.user?.email;

    let authorId = sessionUserId;

    // In some auth flows session.user.id can be a non-Mongo identifier.
    // Resolve a valid Mongo ObjectId from the user email when needed.
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
        const existingUser = sessionUserEmail
            ? await User.findOne({ email: sessionUserEmail }).select("_id")
            : null;

        if (!existingUser?._id) {
            throw new Error("Unable to resolve authenticated user for question creation");
        }

        authorId = existingUser._id.toString();
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await QuestionModel.findById(params.questionId)
            .session(session)
            .populate("tags");

        if (!question) {
            throw new Error("Question not found");
        }

        if (question.author.toString() !== authorId) {
            throw new Error("You are not authorized to edit this question");
        }

        if(question.title !== title) {
            question.title = title;
        }

        if(question.content !== content) {
            question.content = content;
        }

        const normalizedTags = [...new Set(
            tags
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)
        )];

        const currentTags = question.tags as unknown as ITagDoc[];
        const currentTagNames = currentTags.map((tag) => tag.name.toLowerCase());

        const tagsToAdd = normalizedTags.filter(
            (tagName) => !currentTagNames.includes(tagName)
        );

        const tagsToRemove = currentTags.filter(
            (tag) => !normalizedTags.includes(tag.name.toLowerCase())
        );

        const newTagDocuments: { tag: mongoose.Types.ObjectId; question: mongoose.Types.ObjectId }[] = [];
        const finalTagIds = currentTags
            .filter((tag) => normalizedTags.includes(tag.name.toLowerCase()))
            .map((tag) => tag._id as mongoose.Types.ObjectId);

        for (const tagName of tagsToAdd) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: tagName },
                {
                    $setOnInsert: { name: tagName },
                    $inc: { questions: 1 },
                },
                { upsert: true, returnDocument: "after", session }
            );

            if (existingTag?._id) {
                newTagDocuments.push({
                    tag: existingTag._id as mongoose.Types.ObjectId,
                    question: question._id as mongoose.Types.ObjectId,
                });
                finalTagIds.push(existingTag._id as mongoose.Types.ObjectId);
            }
        }

        if (tagsToRemove.length > 0) {
            const tagsIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);
            
            await Tag.updateMany(
                { _id: { $in: tagsIdsToRemove } },
                { $inc: { questions: -1 } },
                { session }
            );

            await TagQuestion.deleteMany(
                { tag: { $in: tagsIdsToRemove }, question: question._id },
                { session }
            );
        }

        if (newTagDocuments.length > 0) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }

        question.tags = finalTagIds as any;
        await question.save({ session });

        await session.commitTransaction();
        return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export const getQuestion = cache(async function getQuestion(
    params: getQuestionParams
): Promise<ActionResponse<QuestionType>> {
    const validationResult = await action({
        params,
        schema: GetQuestionSchema,
        authorize: false,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params;

    try {
        const question = await QuestionModel.findById(questionId)
            .populate("tags")
            .populate("author", "_id name username email image");

        if (!question) {
            throw new Error("Question not found");
        }

        return { success: true, data: JSON.parse(JSON.stringify(question)) };

    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
});


async function getRecommendedQuestions({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) {
  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "question",
    action: { $in: ["view", "upvote", "bookmark", "post"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map((i) => i.actionId);

  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds },
  }).select("tags");

  const allTags = interactedQuestions.flatMap((q) =>
    q.tags.map((tag: Types.ObjectId) => tag.toString())
  );

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: Record<string, unknown> = {
    _id: { $nin: interactedQuestionIds },
    author: { $ne: new Types.ObjectId(userId) },
    tags: { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) },
  };

  if (query) {
    const searchRegex = new RegExp(escapeRegex(query), "i");

    recommendedQuery.$or = [
      { title: { $regex: searchRegex } },
      { content: { $regex: searchRegex } },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext: total > skip + questions.length,
  };
}

export async function getQuestions(
    params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: QuestionType[], isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
        authorize: false,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { page=1, pageSize=10, query, filter} = params
    const skip = (Number(page - 1)) * pageSize;
    const limit = Number(pageSize);

    const filterQuery: Record<string, unknown> = {}

    if (filter === "recommended") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return { success: true, data: { questions: [], isNext: false } };
      }

      const recommended = await getRecommendedQuestions({ userId, query, skip, limit });
      return { success: true, data: recommended };
    }

    if (query) {
        const searchRegex = new RegExp(escapeRegex(query), "i");

        filterQuery.$or = [
            { title: { $regex: searchRegex }},
            { content: { $regex: searchRegex }},
        ]
    }

    let sortCriteria = {}

    switch (filter) {
        case 'newest': 
            sortCriteria = { createdAt: -1 };
            break;
        case 'unanswered': 
            filterQuery.answers = 0;
            sortCriteria = { createdAt: -1 };
            break;
        case 'popular': {
            sortCriteria = {upvotes: -1};
            break;
        }
        default: 
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const questions = await QuestionModel.find(filterQuery)
            .populate("tags", "name")
            .populate("author", "name image")
            .lean()
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);
        
        const totalQuestions = await QuestionModel.countDocuments(filterQuery);
        const isNext = totalQuestions > skip + questions.length;

        return {
          success: true,
          data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse
    }
}

export async function getHotQuestions(): Promise<ActionResponse<QuestionType[]>> {
    try {
        await dbConnect();

        const questions = await QuestionModel.find()
            .sort({ views: -1, upvotes: -1 })
            .limit(5)
            .select("_id title");

        return { success: true, data: JSON.parse(JSON.stringify(questions)) };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function deleteQuestion(
  params: DeleteQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const { user } = validationResult.session!;

  const session = await mongoose.startSession();
  let questionAuthorId = "";

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");
    questionAuthorId = question.author.toString();

    if (questionAuthorId !== user?.id)
      throw new Error("You are not authorized to delete this question");

    await Collection.deleteMany({ question: questionId }).session(session);

    await TagQuestion.deleteMany({ question: questionId }).session(session);

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    const answers = await Answer.find({ question: questionId }).session(session);

    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        actionId: { $in: answers.map((a) => a._id) },
        actionType: "answer",
      }).session(session);
    }

    await Question.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();

    await createInteraction({
      action: "delete",
      actionId: questionId,
      actionTarget: "question",
      authorId: questionAuthorId,
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

export async function incrementViews(
    params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
    const validationResult = await action({
        params,
        schema: IncrementViewsSchema,
        authorize: false,
    })

    if(validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Question.findByIdAndUpdate(
            questionId,
            { $inc: { views: 1 } },
            { returnDocument: "after" }
        );

        if (!question) {
            throw new Error("Quesion not found");
        }

        return {
            success: true,
            data: { views: question.views },
        }
    } catch(e) {
        return handleError(e) as ErrorResponse;
    }
}
