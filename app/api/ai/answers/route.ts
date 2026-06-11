import { auth } from "@/auth";
import { User } from "@/database";
import handleError from "@/lib/handlers/error";
import {
  RequestError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AIAnswerSchema } from "@/lib/validations";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const MAX_AI_ANSWER_GENERATIONS = 3;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const session = await auth();

    if (!session?.user) {
      throw new UnauthorizedError("You need to be signed in to use AI answers");
    }

    const userId = session.user.id;

    if (!userId) {
      throw new UnauthorizedError("Unable to resolve the signed-in user");
    }

    const { question, context, draft } = await request.json();

    const validatedData = AIAnswerSchema.safeParse({ question, context, draft });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    await dbConnect();

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        $or: [
          { aiAnswerGenerations: { $exists: false } },
          { aiAnswerGenerations: { $lt: MAX_AI_ANSWER_GENERATIONS } },
        ],
      },
      { $inc: { aiAnswerGenerations: 1 } },
      { returnDocument: "after" }
    ).select("aiAnswerGenerations");

    if (!user) {
      throw new RequestError(
        429,
        "AI answer generation limit reached. Demo accounts can generate up to 3 answers total."
      );
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-5.4-mini"),
        system:
          "You write high-quality answers for a developer Q&A site. Generate or improve a practical, specific, and well-structured answer based on the provided question, context, and optional draft. Prefer clarity over verbosity. When useful, explain the solution step by step, include caveats, and provide an example. If code is appropriate, include a concise code example. If a draft is provided, improve it, complete it, and format it better instead of ignoring it. Preserve any correct ideas already present in the draft. Return only valid HTML that can be inserted into a Tiptap editor. Use only these tags when needed: p, h1, h2, h3, ul, ol, li, strong, em, code, pre, blockquote. For code blocks, use <pre><code class=\"language-...\">...</code></pre> with short language identifiers such as js, ts, react, next, and nodejs. Do not return Markdown. Do not wrap the response in triple backticks. Do not include html, body, style, script, or inline styles. Do not add any text before or after the HTML. Avoid generic filler such as 'Hope this helps'.",
        prompt: `
Question:
${validatedData.data.question}

Context:
${validatedData.data.context}

Current draft:
${validatedData.data.draft?.trim() ? validatedData.data.draft : "No draft provided."}

Instructions:
- Write the answer as if it were being posted directly as a helpful reply to this question.
- Start with a short direct explanation, not with meta commentary.
- Use short paragraphs or lists when they improve readability.
- If the context is weak or incomplete, make the safest reasonable assumptions and state them briefly.
- If code is unnecessary, do not force a code example.
- If a draft is provided, refine and expand it instead of replacing its intent.
- Output HTML only.
      `,
      });

      const usedGenerations = user.aiAnswerGenerations ?? MAX_AI_ANSWER_GENERATIONS;

      return NextResponse.json(
        {
          success: true,
          data: text,
          remainingGenerations: Math.max(0, MAX_AI_ANSWER_GENERATIONS - usedGenerations),
        },
        { status: 200 }
      );
    } catch (error) {
      await User.findByIdAndUpdate(userId, {
        $inc: { aiAnswerGenerations: -1 },
      });

      throw error;
    }
  } catch (error) {
    return handleError(error, "api") as NextResponse;
  }
}
