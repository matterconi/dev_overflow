import type { NextResponse } from "next/server";

export interface Tag {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  imgUrl?: string;
  image?: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

export interface Collection {
  _id: string;
  author: Author;
  question: Question;
}

export interface Answer {
  _id: string;
  content: string;
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  question: string;
}

export interface BadgeCount {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

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

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
  query?: string;
}
