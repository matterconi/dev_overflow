import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-40" />
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-44" />
      </section>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-60 w-full rounded-2xl" />
        ))}
      </div>
    </>
  );
};

export default Loading;
