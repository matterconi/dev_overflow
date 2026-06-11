import { z } from "zod";

import { InteractionActionEnums } from "@/constants/interactions";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(32, { message: "email can not be more than 24 characters" })
    .email({ message: "Please, provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password has to be at least 6 characters long" })
    .max(24, { message: "password can not be more than 24 characters" }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(32, { message: "email can not be more than 24 characters" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 10 characters long." })
    .max(100, { message: "Title cannot exceed 100 characters." }),

  content: z
    .string()
    .min(30, { message: "Body must be at least 30 characters long." })
    .max(10000, { message: "Body cannot exceed 10000 characters." }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag must be at least 1 character long." })
        .max(20, { message: "Tag cannot exceed 20 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "Cannot add more than 5 tags." })
    .refine(
      (tags) => {
        const normalizedTags = tags.map((tag) => tag.trim().toLowerCase());
        return normalizedTags.length === new Set(normalizedTags).size;
      },
      { message: "Tags must be unique." }
    ),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
})

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
})

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  username: z
    .string()
    .min(3, { message: "Username needs to be at least 3 characters long." })
    .max(30, { message: "Username lenght can't exceed 30 characters." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().max(160).optional(),
  image: z.string().url(),
  location: z.string().max(50),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional(),
  reputation: z.number().int().min(0).optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const SignInOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    username: z.string().min(3, { message: "Username is required." }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  sort: z.string().optional(),
  filter: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required. "}),
})

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, {
    message: "Question ID is required."
  }),
})

export const AnswerSchema = z.object({
  content: z.string().min(100, {
    message: "Answer has to have more than 100 characters."
  })
})

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, {
    message: "Question ID is required"
  }),
})

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, {
    message: "Question ID is required"
  }),
})

export const AIAnswerSchema = z.object({
  question: z.string().min(5, {
    message: "Question is required"
  }).max(150, {
    message: "Question cannot exceed 150 characters"
  }),
  context: z.string().min(30, {
    message: "Context must be at least 30 characters long"
  }).max(5000, {
    message: "Context cannot exceed 5000 characters"
  }),
  draft: z.string().max(10000, {
    message: "Draft cannot exceed 10000 characters"
  }).optional(),
})

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, {
    message: "Target ID is required"
  }),
  targetType: z.enum(["question", "answer"], {
    message: "invalid target type."
  }),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Invalid vote type"
  })
})

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
})

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
})

export const GetUserQuestionsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
})

export const GetUserAnswersSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
})

export const GetUserTopTagsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
})

export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
})

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, "Answer ID is required"),
})

export const GlobalSearchSchema = z.object({
  query: z.string().min(1, { message: "Search query is required." }),
  type: z.enum(["question", "answer", "user", "tag"]).optional(),
});

export const CreateInteractionSchema = z.object({
  action: z.enum(InteractionActionEnums),
  actionTarget: z.enum(["question", "answer"]),
  actionId: z.string().min(1),
  authorId: z.string().min(1),
})

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  bio: z.string().max(160, { message: "Bio cannot exceed 160 characters." }).optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional().or(z.literal("")),
  location: z.string().max(50, { message: "Location cannot exceed 50 characters." }).optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional()
    .or(z.literal("")),
})
