"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import {
  globalSearch,
  GlobalSearchResult,
} from "@/lib/actions/general.action";

type SearchType = "question" | "answer" | "user" | "tag";

const SEARCH_TYPES: SearchType[] = ["question", "answer", "user", "tag"];

const TYPE_ICONS: Record<SearchType, string> = {
  question: "/icons/question.svg",
  answer: "/icons/message.svg",
  user: "/icons/user.svg",
  tag: "/icons/tag.svg",
};

function getResultHref(result: GlobalSearchResult): string {
  switch (result.type) {
    case "question":
    case "answer":
      return ROUTES.QUESTION(result.id);
    case "user":
      return ROUTES.PROFILE(result.id);
    case "tag":
      return ROUTES.TAG(result.id);
    default:
      return ROUTES.HOME;
  }
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<SearchType | null>(null);
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      const response = await globalSearch({
        query,
        type: activeType ?? undefined,
      });
      if (response.success && response.data) {
        setResults(response.data);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeType]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] max-lg:hidden"
    >
      <div className="background-light800_darkgradient flex min-h-[56px] items-center gap-4 rounded-xl px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally..."
          value={query}
          onChange={(e) => {
            const nextQuery = e.target.value;
            setQuery(nextQuery);

            if (!nextQuery.trim()) {
              setResults([]);
              setIsOpen(false);
            }
          }}
          onFocus={() => query && setIsOpen(true)}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>

      {isOpen && (
        <div className="background-light900_dark200 absolute top-full z-10 mt-3 w-full rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-dark400_light900 body-medium">Type:</p>
            {SEARCH_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(activeType === t ? null : t)}
                className={`small-medium rounded-2xl px-5 py-2 capitalize transition-colors ${
                  activeType === t
                    ? "bg-primary-500 text-light-900"
                    : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="my-5 h-px bg-light-700 dark:bg-dark-500" />

          <p className="text-dark400_light900 paragraph-semibold">Top Match</p>

          <div className="mt-3 flex flex-col gap-2">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-full animate-pulse rounded-md bg-light-700 dark:bg-dark-500"
                />
              ))
            ) : results.length > 0 ? (
              results.map((result, i) => (
                <Link
                  key={i}
                  href={getResultHref(result)}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src={TYPE_ICONS[result.type as SearchType] ?? "/icons/search.svg"}
                    alt={result.type}
                    width={18}
                    height={18}
                    className="invert-colors mt-1"
                  />
                  <div>
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {result.title}
                    </p>
                    <p className="text-light400_light500 small-medium capitalize">
                      {result.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="body-regular text-dark200_light800 py-5 text-center">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
