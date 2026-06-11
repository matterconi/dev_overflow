import ROUTES from "@/constants/routes";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DataRenderer from "@/components/DataRenderer";
import TagCard from "@/components/cards/TagCard";

async function RightSidebar() {
  const [
    { data: questions, success: questionsSuccess, error: questionsError },
    { data: tags, success: tagsSuccess, error: tagsError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark_200_light_900">Top Questions</h3>

        <DataRenderer
          success={questionsSuccess}
          error={questionsError}
          data={questions}
          empty={{
            ...DEFAULT_EMPTY,
            title: "No Hot Questions Yet",
            message: "Be the first to ask something interesting!",
          }}
          render={(questions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {questions.map((question) => (
                <Link
                  key={question._id}
                  href={ROUTES.QUESTION(question._id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700">
                    {question.title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    width={20}
                    height={20}
                    alt="chevron-right"
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          success={tagsSuccess}
          error={tagsError}
          data={tags}
          empty={{
            ...DEFAULT_EMPTY,
            title: "No Tags Yet",
            message: "Tags will appear here once questions are tagged.",
          }}
          render={(tags) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {tags.map(({ _id, name, questions }) => (
                <TagCard key={_id} _id={_id} name={name} questions={questions} showCount />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default RightSidebar;
