import { AppCardLayout } from "@/components/shared";

export const RoleCardSkeleton = () => {
  return (
    <AppCardLayout className="py-6" contentClassName="flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-muted shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-5 w-28 rounded bg-surface-muted" />
            <div className="h-4 w-20 rounded bg-surface-muted" />
          </div>
        </div>
        <div className="h-4 w-4 rounded bg-surface-muted" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-full rounded bg-surface-muted" />
        <div className="h-4 w-3/4 rounded bg-surface-muted" />
      </div>

      <div className="h-px bg-surface-muted" />

      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 rounded bg-surface-muted" />
        <div className="flex flex-wrap gap-1.5">
          <div className="h-5 w-16 rounded-sm bg-surface-muted" />
          <div className="h-5 w-14 rounded-sm bg-surface-muted" />
          <div className="h-5 w-18 rounded-sm bg-surface-muted" />
        </div>
      </div>
    </AppCardLayout>
  );
};
