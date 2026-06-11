"use server";

import { ZodError, ZodSchema } from "zod";
import handleError from "./error";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
    params: T;
    schema: ZodSchema<T>;
    authorize?: boolean;
}

export async function action<T>({
    params,
    schema,
    authorize = true,
}: ActionOptions<T>) {
    if (schema && params) {
        try {
            schema.parse(params);
        } catch (error ) {
            if (error instanceof ZodError) {
            return new ValidationError(error.flatten().fieldErrors as Record<string, string[]>);
            } else {
                return new Error("An unexpected error occurred");
            }
        }
    }

    let session: Session | undefined;

    if (authorize) {
        session = (await auth()) ?? undefined;

        if (!session) {
            throw new UnauthorizedError("Unauthorized");
        }
    } else {
        session = (await auth()) ?? undefined;
    }

    await dbConnect();

    return {
        session,
        params,
    };
}

export default action;
