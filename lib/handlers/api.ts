import { headers } from "next/headers";

import ROUTES from "@/constants/routes";
import type { IAccount } from "@/database/account.model";
import type { IUser } from "@/database/user.model";
import type { ActionResponse, APIResponse, SignInWithAuthParams } from "@/types/action";

import { fetchHandler } from "./fetch";
import { getAnswers } from "../actions/answer.action";

const getApiBaseUrl = async () => {
  const envBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

  if (envBaseUrl) return envBaseUrl.replace(/\/$/, "");

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (host) {
    const protocol =
      requestHeaders.get("x-forwarded-proto") ??
      (host.includes("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");

    return `${protocol}://${host}/api`;
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;

  return `http://localhost:${process.env.PORT ?? "3000"}/api`;
};

export const api = {
  auth: {
    oAuthSignIn: async ({
      user,
      provider,
      providerAccountId,
    }: SignInWithAuthParams) => {
      const apiBaseUrl = await getApiBaseUrl();

      return fetchHandler(`${apiBaseUrl}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      });
    },
  },
  users: {
    getAll: async () => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users`);
    },
    getById: async (id: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users/${id}`);
    },
    getByEmail: async (email: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    create: async (userData: Partial<IUser>) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    update: async (id: string, userData: Partial<IUser>) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    delete: async (id: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/users/${id}`, {
        method: "DELETE",
      });
    },
  },

  accounts: {
    getAll: async () => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts`);
    },
    getById: async (id: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts/${id}`);
    },
    getByProvider: async (providerAccountId: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      });
    },
    create: async (userData: Partial<IAccount>) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    update: async (id: string, userData: Partial<IAccount>) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    delete: async (id: string) => {
      const apiBaseUrl = await getApiBaseUrl();
      return fetchHandler(`${apiBaseUrl}/accounts/${id}`, {
        method: "DELETE",
      });
    },
  },
  ai: {
    getAnswer: async (
      question: string,
      content: string
    ): Promise<ActionResponse<string>> => {
      const apiBaseUrl = await getApiBaseUrl();
  
      return fetchHandler<string>(`${apiBaseUrl}/ai/answers`, {
        method: "POST",
        body: JSON.stringify({
          question,
          content,
        }),
      });
    },
  }  
};
