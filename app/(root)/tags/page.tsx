import type { Metadata } from "next";
import React from "react";

import DataRenderer from "@/components/DataRenderer";

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Explore all programming topics and tags on Dev Overflow. Find questions filtered by your area of expertise.",
};
import TagCard from "@/components/cards/TagCard";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import Pagination from "@/components/Pagination";
import { TagFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";

const Page = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { tags, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          iconPosition="left"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questions={tag.questions}
                compact={false}
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
