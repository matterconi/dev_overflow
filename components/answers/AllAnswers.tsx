import type { Answer } from "@/types/global";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "@/components/answers/AnswerCard";
import DataRenderer from "../DataRenderer";
import CommonFilter from "../filters/CommonFilter";
import Pagination from "../Pagination";
import { AnswerFilters } from "@/constants/filters";

interface AllAnswersProps {
  data: Answer[];
  success: boolean;
  totalAnswers: number;
  page: number;
  isNext: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

export default function AllAnswers({
  data,
  success,
  totalAnswers,
  page,
  isNext,
  error,
}: AllAnswersProps) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="h3-semibold text-dark200_light900">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter
          filters={AnswerFilters}
          otherClasses="min-h-[40px] sm:min-w-[150px] text-sm"
        />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={data}
        empty={EMPTY_ANSWERS}
        render={(answers) => (
          <div className="mt-7 flex flex-col gap-8">
            {answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                _id={answer._id}
                author={answer.author}
                content={answer.content}
                createdAt={answer.createdAt}
                upvotes={answer.upvotes}
                downvotes={answer.downvotes}
                question={answer.question}
              />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext} containerClasses="mt-10" />
    </div>
  );
}
