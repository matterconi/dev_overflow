import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/action";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User not found");
  }

  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User not found");
  }

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User not found");
  }

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.partial().parse(body);
    const user = await User.findByIdAndUpdate(id, validatedData, {
      returnDocument: "after",
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
