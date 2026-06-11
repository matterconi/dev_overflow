import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import QuestionMetrics from "@/components/QuestionMetrics";
import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import AnswerForm from "@/components/form/AnswerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion } from "@/lib/actions/question.action";
import AllAnswers from "@/components/answers/AllAnswers";
import { RouteParams, Tag } from "@/types/global";
import Votes from "@/components/votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import SaveQuestion from "@/components/SaveQuestion";
import { hasSavedQuestion } from "@/lib/actions/collection.action";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) return {};

  return {
    title: question.title,
    description: question.content.slice(0, 160),
    openGraph: {
      title: question.title,
      description: question.content.slice(0, 160),
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { filter = "latest", page } = await searchParams;
  const answersPage = Number(page) || 1;

  const [
    { success, data: question },
    { success: answersSuccess, data: answersData, error: answersError },
  ] = await Promise.all([
    getQuestion({ questionId: id }),
    getAnswers({ questionId: id, page: answersPage, pageSize: 10, filter: filter || "latest" }),
  ]);

  if (!success || !question) return redirect("/404");

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const { data: savedData } = await hasSavedQuestion({ questionId: id });

  const { author, createdAt, answers, views, tags, content, title } = question;
  const totalAnswers = answersData?.totalAnswers ?? answers;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Suspense fallback={<div className="paragraph-medium">Loading votes...</div>}>
            <Votes
              targetId={question._id}
              targetType="question"
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
          <Suspense fallback={<Image src="/icons/star.svg" width={18} height={18} alt="save" />}>
            <SaveQuestion
              questionId={question._id}
              hasSaved={savedData?.saved ?? false}
            />
          </Suspense>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <QuestionMetrics
        questionId={question._id}
        createdAt={createdAt}
        answers={answers}
        initialViews={views}
      />

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          data={answersData?.answers ?? []}
          success={answersSuccess}
          error={answersError}
          totalAnswers={totalAnswers}
          page={answersPage}
          isNext={answersData?.isNext ?? false}
        />
      </section>

      <section className="my-10">
        <AnswerForm questionId={question._id} questionTitle={question.title} questionContent={question.content} />
      </section>
    </>
  );
};

export default QuestionDetails;
