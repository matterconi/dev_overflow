import Link from "next/link";
import React from "react";
import sanitizeHtml from "sanitize-html";

import EditDeleteAction from "@/components/EditDeleteAction";
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import type { Question, Tag } from "@/types/global";

import Metric from "../Metric";
import TagCard from "./TagCard";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}

const QuestionCard = ({
  question: {
    _id,
    title,
    content,
    tags,
    author,
    createdAt,
    upvotes,
    answers,
    views,
  },
  showActionBtns = false,
}: Props) => {
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:p-11">
      {showActionBtns && (
        <div className="flex justify-end">
          <EditDeleteAction type="question" itemId={_id} />
        </div>
      )}
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex flex-col gap-2 sm:gap-3">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
          <div
            className="paragraph-regular text-dark400_light800 line-clamp-2 [&_a]:text-primary-500 [&_a]:underline [&_code]:rounded-sm [&_code]:bg-light-800 [&_code]:px-1 dark:[&_code]:bg-dark-300"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.imgUrl}
          alt={author.name}
          value={author.name}
          title={`asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/like.svg"
            alt="upvotes"
            value={upvotes}
            title="Upvotes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
