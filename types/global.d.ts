interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  imgUrl: string;
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

type Badges = BadgeCount;

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export type {
  ActionResponse,
  APIErrorResponse,
  APIResponse,
  AuthCredentials,
  CreateQuestionParams,
  EditQuestionParams,
  ErrorResponse,
  getQuestionParams,
  PaginatedSearchParams,
  SignInWithAuthParams,
  SuccessResponse,
} from "./action";
