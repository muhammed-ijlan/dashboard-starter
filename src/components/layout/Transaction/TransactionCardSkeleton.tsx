import { AppCardLayout } from "@/components/shared";

export const TransactionCardSkeleton = () => {
  return (
    <AppCardLayout contentClassName="flex flex-col lg:flex-row lg:items-center justify-between p-4 lg:p-[17px] gap-4 lg:gap-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 flex-1 min-w-0 w-full animate-pulse">
        <div className="flex items-center gap-2 lg:w-25 shrink-0">
          <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <div className="h-3.5 w-14 rounded bg-gray-200" />
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:gap-1.5 min-w-0 flex-1 w-full">
          <div className="flex items-center gap-2 w-full">
            <div className="h-3 w-9 rounded bg-gray-100 shrink-0" />
            <div className="h-7.25 flex-1 lg:flex-none lg:w-70 rounded-sm bg-gray-100" />
            <div className="h-3.75 w-3.75 rounded bg-gray-100 shrink-0" />
            <div className="h-3.75 w-3.75 rounded bg-gray-100 shrink-0" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 lg:gap-x-5 gap-y-2">
            <div className="h-3 w-36 lg:w-56 rounded bg-gray-100" />
            <div className="h-3 w-32 rounded bg-gray-100" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="h-3 w-28 rounded bg-gray-100" />
            <div className="h-5 w-20 rounded-md bg-gray-100" />
          </div>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start w-full lg:w-auto shrink-0 lg:pl-4 pt-3 lg:pt-0 border-t border-gray-100 lg:border-none mt-1 lg:mt-0 gap-1 lg:gap-0.5 animate-pulse">
        <div className="h-4 lg:h-4.5 w-28 rounded bg-gray-200" />
      </div>
    </AppCardLayout>
  );
};
