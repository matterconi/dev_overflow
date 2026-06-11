import type { Metadata } from "next";
import React from "react";

import QuestionForm from "@/components/form/QuestionForm";

export const metadata: Metadata = {
  title: "Ask a Question",
  description:
    "Post a programming question to the Dev Overflow community and get answers from experienced developers.",
};
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) return redirect('/sign-in');
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </div>
  );
};

export default Page;
