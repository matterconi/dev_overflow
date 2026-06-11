import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import type { APIErrorResponse } from "@/types/action";

export async function POST(request: Request) {
  try {
    const { providerAccountId } = await request.json();

    if (!providerAccountId || typeof providerAccountId !== "string") {
      throw new ValidationError({
        providerAccountId: ["Provider account ID is required"],
      });
    }

    await dbConnect();

    const account = await Account.findOne({ providerAccountId });

    if (!account) {
      return NextResponse.json({ success: true, data: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
