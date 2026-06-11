import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetricProps {
  imgUrl?: string | null;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  titleStyles?: string;
  imgStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  titleStyles,
  imgStyles,
  isAuthor,
}: MetricProps) => {
  const safeImgUrl =
    typeof imgUrl === "string" && imgUrl.trim().length > 0 ? imgUrl : null;

  const authorFallback = (
    <div
      className={`flex h-4 w-4 items-center justify-center rounded-full border border-light-800 bg-light-700 text-[10px] font-semibold text-dark-100 dark:border-dark-400 dark:bg-dark-300 dark:text-light-900 ${imgStyles ?? ""}`}
      aria-label={alt}
    >
      {(alt?.trim()?.[0] ?? "?").toUpperCase()}
    </div>
  );

  const metricContent = (
    <>
      {safeImgUrl ? (
        <Image
          src={safeImgUrl}
          alt={alt}
          width={16}
          height={16}
          className={`rounded-full object-contain ${imgStyles}`}
        />
      ) : isAuthor ? (
        authorFallback
      ) : null}
      <p className={`${textStyles} flex items-center gap-1`}>{value}</p>
      <span
        className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""} ${titleStyles ?? ""}`}
      >
        {title}
      </span>
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex items-center gap-2">{metricContent}</div>
  );
};

export default Metric;
