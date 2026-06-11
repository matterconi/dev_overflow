import type { NextResponse } from "next/server";

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<undefined> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> =
  | NextResponse<SuccessResponse<T>>
  | ErrorResponse;

export interface SignInWithAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    username: string;
    image?: string;
  };
}

export interface AuthCredentials {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

export interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

export interface getQuestionParams {
  questionId: string;
}

export interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
  query?: string;
}

export interface GetTagQuestionsParams
  extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

export interface IncrementViewsParams {
  questionId: string;
}

export interface CreateAnswerParams {
  questionId: string;
  content: string;
}

export interface CollectionBaseParam {
  questionId: string;
}

export interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

export interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

export interface GetUserParams {
  userId: string;
}

export interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

export interface GetUserAnswersParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

export interface UpdateUserParams {
  name: string;
  username: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
}

export interface GetUserTopTagsParams {
  userId: string;
}

export interface DeleteQuestionParams {
  questionId: string;
}

export interface DeleteAnswerParams {
  answerId: string;
}

export interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

export interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer";
}

export interface UpdateReputationParams {
  interaction: import("@/database/interaction.model").IInteractionDoc;
  session: import("mongoose").ClientSession;
  performerId: string;
  authorId: string;
}

type VoteState = {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
};

export type HasVotedResponse = Pick<
  VoteState,
  "hasUpvoted" | "hasDownvoted"
>;
