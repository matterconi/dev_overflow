"use client";

import { useEffect, useRef, useState } from "react";

import Metric from "@/components/Metric";
import { incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

interface Props {
  questionId: string;
  createdAt: Date | string;
  answers: number;
  initialViews: number;
}

export default function QuestionMetrics({
  questionId,
  createdAt,
  answers,
  initialViews,
}: Props) {
  const [views, setViews] = useState(initialViews);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const storageKey = `question-viewed:${questionId}`;
    const alreadyViewed = window.sessionStorage.getItem(storageKey);

    if (alreadyViewed) {
      hasTracked.current = true;
      return;
    }

    hasTracked.current = true;
    window.sessionStorage.setItem(storageKey, "true");

    incrementViews({ questionId }).then((result) => {
      if (result.success && result.data) {
        setViews(result.data.views);
      }
    });
  }, [questionId]);

  return (
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
      <Metric
        imgUrl="/icons/clock.svg"
        alt="clock icon"
        value={` asked ${getTimeStamp(new Date(createdAt))}`}
        title=""
        textStyles="small-regular text-dark400_light700"
      />
      <Metric
        imgUrl="/icons/message.svg"
        alt="message icon"
        value={answers}
        title=""
        textStyles="small-regular text-dark400_light700"
      />
      <Metric
        imgUrl="/icons/eye.svg"
        alt="eye icon"
        value={formatNumber(views)}
        title=""
        textStyles="small-regular text-dark400_light700"
      />
    </div>
  );
}
