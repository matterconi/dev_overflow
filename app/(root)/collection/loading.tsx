import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-12 w-36" />
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-44" />
      </section>

      <div className="mt-10 flex w-full flex-col gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </>
  );
};

export default Loading;
