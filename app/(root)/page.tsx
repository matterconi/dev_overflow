import Link from "next/link";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/handlers/api";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";

const questions = [
  {
    _id: "1",
    title: "How to use React?",
    description:
      "I am new to React and I want to learn how to use it. Can someone help me?",
    tags: [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "JavaScript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      imgUrl: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    createdAt: new Date(),
    upvotes: 10,
    answers: 5,
    views: 20,
  },
  {
    _id: "2",
    title: "How to use Next.js?",
    description:
      "I am new to Next.js and I want to learn how to use it. Can someone help me?",
    tags: [
      {
        _id: "1",
        name: "Next.js",
      },
      {
        _id: "2",
        name: "React",
      },
    ],
    author: {
      _id: "2",
      name: "Jane Doe",
      imgUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    createdAt: new Date("2021-09-02T00:00:00.000Z"),
    upvotes: 15,
    answers: 7,
    views: 25,
  },
];

const test = async () => {
  try {
    return await api.users.getAll();
  } catch (error) {
    return handleError(error);
  }
};

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const page = async ({ searchParams }: SearchParams) => {
  const users = await test();
  console.log(users);
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags.some((tag) =>
          tag.name.toLowerCase().includes(filter.toLowerCase())
        )
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default page;
