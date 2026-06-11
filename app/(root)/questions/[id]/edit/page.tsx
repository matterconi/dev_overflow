import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/form/QuestionForm";
import ROUTES from "@/constants/routes";
import User from "@/database/user.model";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;

  if (!id) return notFound();

  const session = await auth();

  if (!session) {
    console.log("[questions/edit] redirect: missing session", { questionId: id });
    return redirect("/sign-in");
  }

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success) {
    console.log("[questions/edit] notFound: getQuestion failed", {
      questionId: id,
    });
    return notFound();
  }

  const questionAuthorId =
    typeof question?.author === "string"
      ? question.author
      : question?.author?._id?.toString();

  if (!questionAuthorId) {
    console.log("[questions/edit] notFound: missing question author id", {
      questionId: id,
      questionAuthor: question?.author,
    });
    return notFound();
  }

  const sessionUserId = session.user?.id;
  const sessionUserEmail = session.user?.email;

  let resolvedSessionUserId = sessionUserId;

  if (
    !resolvedSessionUserId ||
    !mongoose.Types.ObjectId.isValid(resolvedSessionUserId)
  ) {
    const existingUser = sessionUserEmail
      ? await User.findOne({ email: sessionUserEmail }).select("_id email")
      : null;

    resolvedSessionUserId = existingUser?._id?.toString();

    console.log("[questions/edit] resolved session user id from email", {
      questionId: id,
      sessionUserId,
      sessionUserEmail,
      resolvedSessionUserId,
    });
  }

  console.log("[questions/edit] authorization check", {
    questionId: id,
    questionAuthorId,
    sessionUserId,
    resolvedSessionUserId,
    sessionUserEmail,
  });

  if (!resolvedSessionUserId || questionAuthorId !== resolvedSessionUserId) {
    console.log("[questions/edit] redirect: author mismatch", {
      questionId: id,
      questionAuthorId,
      sessionUserId,
      resolvedSessionUserId,
      sessionUserEmail,
    });
    return redirect(ROUTES.QUESTIONS(id));
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit question</h1>

      <div className="mt-9">
        <QuestionForm question={question} isEdit={true} />
      </div>
    </div>
  );
};

export default Page;
