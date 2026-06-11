import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/action";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    await dbConnect();
    const validatedData = UserSchema.partial().safeParse({ providerAccountId });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const account = await Account.findOne({ providerAccountId });
    if (!account) {
      throw new Error("User not found");
    }
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
