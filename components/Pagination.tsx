"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page, isNext, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (action: "prev" | "next") => {
    const nextPageNumber = action === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", containerClasses)}>
      {page > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
