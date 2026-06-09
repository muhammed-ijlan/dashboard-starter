import { AppCardLayout } from "@/components/shared/AppCardLayout";

export function WalletCardSkeleton() {
  return (
    <AppCardLayout contentClassName="flex flex-col lg:flex-row lg:items-center p-4 lg:p-[17px] gap-4 animate-pulse">
      <div className="lg:py-2.5 flex items-center gap-4 shrink-0">
        <div className="rounded-[10px] w-12 h-12 bg-surface-muted border-2 border-border-primary" />
      </div>

      <div className="flex flex-col gap-3 lg:gap-2.5 flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-surface-muted" />
          <div className="h-5 w-56 lg:w-80 rounded bg-surface-muted" />
          <div className="h-3.5 w-3.5 rounded bg-surface-muted" />
          <div className="h-3.5 w-3.5 rounded bg-surface-muted" />
        </div>

        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="h-3 w-20 rounded bg-surface-muted" />
          <div className="h-3 w-28 rounded bg-surface-muted" />
          <div className="h-5 w-16 rounded-full bg-surface-muted" />
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end shrink-0 gap-2 lg:gap-1.5 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
        <div className="h-6 w-28 rounded bg-surface-muted" />
        {/* <div className="flex items-center lg:items-end gap-2 lg:gap-1.5 lg:flex-col">
          <div className="h-4 w-20 rounded bg-surface-muted" />
          <div className="h-4 w-16 rounded bg-surface-muted" />
        </div> */}
      </div>
    </AppCardLayout>
  );
}
