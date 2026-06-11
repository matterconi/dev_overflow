import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";

import DataRenderer from "@/components/DataRenderer";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagsQuestions } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data } = await getTagsQuestions({
    tagId: id,
    page: 1,
    pageSize: 1,
  });

  if (!success || !data?.tag) return {};

  return {
    title: `${data.tag.name} Questions`,
    description: `Browse all questions tagged with ${data.tag.name} on Dev Overflow.`,
    openGraph: {
      title: `${data.tag.name} Questions | Dev Overflow`,
      description: `Browse all questions tagged with ${data.tag.name} on Dev Overflow.`,
    },
  };
}

const Page = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  if (!id) return notFound();

  const { success, data, error } = await getTagsQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { tag, questions } = data || {};

  if (!success && error?.message === "Tag not found") return notFound();

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          {tag?.name} Questions
        </h1>
      </section>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder={`Search questions in ${tag?.name ?? "this tag"}...`}
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questionList) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questionList.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Page;
