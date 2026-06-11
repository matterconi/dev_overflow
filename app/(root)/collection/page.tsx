import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Saved Questions",
  description:
    "Your personal collection of saved questions on Dev Overflow. Revisit topics and answers you bookmarked.",
};

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Page = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collections, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Collections</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search saved questions..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={collections}
        empty={EMPTY_COLLECTIONS}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((collection) => (
              <QuestionCard
                key={collection._id}
                question={collection.question}
              />
            ))}
          </div>
        )}
      />

      <Pagination page={Number(page) || 1} isNext={isNext ?? false} containerClasses="mt-10" />
    </>
  );
};

export default Page;
