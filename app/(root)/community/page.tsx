import type { Metadata } from "next";
import React from "react";

import DataRenderer from "@/components/DataRenderer";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Browse all developers on Dev Overflow. Find experts, ask questions, and collaborate with programmers from around the world.",
};
import UserCard from "@/components/cards/UserCard";
import CommonFilter from "@/components/filters/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import Pagination from "@/components/Pagination";
import { UserFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { getEmptyUsersState } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";

const Page = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { users, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search some great devs..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={getEmptyUsersState()}
        render={(users) => (
          <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />

      <Pagination page={Number(page) || 1} isNext={isNext ?? false} containerClasses="mt-10" />
    </>
  );
};

export default Page;
