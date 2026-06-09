import { AppCardLayout } from "@/components/shared";

export const ChainCardSkeleton = () => (
  <AppCardLayout
    className="pt-6"
    contentClassName="flex flex-col gap-4 animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-muted shrink-0" />
        <div className="h-4 w-24 rounded bg-surface-muted" />
      </div>
      <div className="h-6 w-18 rounded-full bg-surface-muted" />
    </div>

    <div className="flex flex-col gap-3 mb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-28 rounded bg-surface-muted" />
          <div className="h-4 w-20 rounded bg-surface-muted" />
        </div>
      ))}
    </div>

    <div>
      <div className="flex justify-between mb-1.5">
        <div className="h-3 w-24 rounded bg-surface-muted" />
        <div className="h-3 w-14 rounded bg-surface-muted" />
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full w-3/4 rounded-full bg-surface-muted" />
      </div>
    </div>
  </AppCardLayout>
);

/** ServiceStatusTab — service row card */
export const ServiceCardSkeleton = () => (
  <AppCardLayout contentClassName="flex flex-col xl:flex-row xl:items-center gap-4 lg:gap-6 px-4! py-4 pb-4! animate-pulse">
    <div className="flex items-center justify-between w-full xl:w-auto gap-2">
      <div className="flex items-center gap-3 lg:w-40 shrink-0">
        <div className="w-10 h-10 bg-surface-muted rounded-xl shrink-0" />
        <div className="h-4 w-24 rounded bg-surface-muted" />
      </div>
      <div className="xl:hidden shrink-0">
        <div className="h-7 w-20 rounded-full bg-surface-muted" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:items-center lg:gap-10 flex-1 pt-2 border-t border-gray-100 xl:border-t-0 xl:pt-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1 sm:min-w-25 w-full">
          <div className="h-3 w-16 rounded bg-surface-muted" />
          <div className="h-4 w-12 rounded bg-surface-muted" />
        </div>
      ))}
    </div>

    <div className="hidden xl:block shrink-0">
      <div className="h-7 w-20 rounded-full bg-surface-muted" />
    </div>
  </AppCardLayout>
);

/** UnresolvedAlertsTab — alert row card */
export const AlertCardSkeleton = () => (
  <AppCardLayout contentClassName="px-4! py-4! flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 animate-pulse">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
      <div className="w-5 h-5 mt-0.5 rounded bg-surface-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-14 rounded-full bg-surface-muted" />
        </div>
        <div className="h-4 w-3/4 rounded bg-surface-muted mb-1" />
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-surface-muted" />
          <div className="h-3 w-28 rounded bg-surface-muted" />
        </div>
      </div>
    </div>
    <div className="ml-8 sm:ml-0 shrink-0">
      <div className="h-8 w-20 rounded-lg bg-surface-muted" />
    </div>
  </AppCardLayout>
);

/** SystemLogsTab — log row */
export const LogRowSkeleton = () => (
  <div className="flex items-start gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0 animate-pulse">
    <div className="w-5 h-5 mt-0.5 rounded bg-surface-muted shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-5 w-12 rounded-full bg-surface-muted" />
        <div className="h-4 w-20 rounded bg-surface-muted" />
      </div>
      <div className="h-4 w-4/5 rounded bg-surface-muted mb-1" />
      <div className="flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 rounded bg-surface-muted" />
        <div className="h-3 w-28 rounded bg-surface-muted" />
      </div>
    </div>
  </div>
);
