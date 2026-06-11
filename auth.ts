import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SignInSchema } from "./lib/validations";
import { api } from "./lib/handlers/api";
import type { ActionResponse } from "./types/action";
import type { IAccountDoc } from "@/database/account.model";
import type { IUserDoc } from "@/database/user.model";

import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google, Credentials({
    async authorize(credentials) {
      const validateFields = SignInSchema.safeParse(credentials);

      if(validateFields.success) {
        const { email, password } = validateFields.data;
        const {data: existingAccount} = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;

        if (!existingAccount) return null;

        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString()
        )) as ActionResponse<IUserDoc>

        if(!existingUser) return null;

        const { default: bcrypt } = await import("bcryptjs");
        const isValidPassword = await bcrypt.compare(password, existingAccount.password!);

        if (isValidPassword) {
          return {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image
          }
        }
      }
      throw new Error("Invalid credentials");
    },
  })],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const [{ default: dbConnect }, { default: Account }] = await Promise.all([
          import("@/lib/mongoose"),
          import("@/database/account.model"),
        ]);

        await dbConnect();

        const providerAccountId =
          account.type === "credentials"
            ? token.email!
            : account.providerAccountId;

        const existingAccount = await Account.findOne({
          provider: account.provider,
          providerAccountId,
        });

        if (existingAccount?.userId) {
          token.sub = existingAccount.userId.toString();
        }
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (!account?.providerAccountId || !user.email) return false;
      if (!["github", "google"].includes(account.provider)) return true;

      const [{ default: mongoose }, { default: slugify }, { default: dbConnect }, { default: Account }, { default: User }] =
        await Promise.all([
          import("mongoose"),
          import("slugify"),
          import("@/lib/mongoose"),
          import("@/database/account.model"),
          import("@/database/user.model"),
        ]);

      await dbConnect();

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const existingAccount = await Account.findOne({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        }).session(session);

        if (existingAccount) {
          await session.commitTransaction();
          return true;
        }

        let existingUser = await User.findOne({ email: user.email }).session(
          session
        );

        if (!existingUser) {
          const usernameSource =
            typeof profile === "object" &&
            profile &&
            "login" in profile &&
            typeof profile.login === "string"
              ? profile.login
              : user.name || user.email.split("@")[0];

          const baseUsername =
            slugify(usernameSource, {
              lower: true,
              strict: true,
              trim: true,
            }) || "user";

          let username = baseUsername;
          let suffix = 1;

          while (await User.findOne({ username }).session(session)) {
            username = `${baseUsername}${suffix}`;
            suffix += 1;
          }

          [existingUser] = await User.create(
            [
              {
                name: user.name || username,
                email: user.email,
                username,
                image: user.image || undefined,
              },
            ],
            { session }
          );
        }

        await Account.updateOne(
          {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          {
            $setOnInsert: {
              userId: existingUser._id,
              name: existingUser.name,
              image: user.image || undefined,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          { upsert: true, session }
        );

        await session.commitTransaction();
        return true;
      } catch (error) {
        await session.abortTransaction();
        console.error("OAuth sign-in persistence failed", error);
        return false;
      } finally {
        session.endSession();
      }
    },
  },
});
