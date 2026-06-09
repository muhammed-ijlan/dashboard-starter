import type { StatCardLayout, SizeVariant } from "@/types";

interface StatCardSkeletonProps {
  layout?: StatCardLayout;
  size?: SizeVariant;
  showSubtitle?: boolean;
}

export const StatCardSkeleton = ({
  layout = "standard",
  size = "sm",
  showSubtitle = false,
}: StatCardSkeletonProps) => {
  const paddingClass = size === "sm" ? "p-4.25" : "p-6.25";
  const iconSize = size === "sm" ? "w-9 h-9" : "w-12 h-12";
  const valueHeight = size === "sm" ? "h-[32px]" : "h-[36px]";

  if (layout === "simple") {
    return (
      <div
        className={`bg-white rounded-[14px] border border-default flex flex-col h-full ${paddingClass} animate-pulse`}
      >
        <div className="h-4 w-28 rounded bg-surface-muted" />
        <div className="mt-auto">
          <div className={`h-7 w-24 rounded bg-surface-muted mt-2`} />
        </div>
      </div>
    );
  }

  if (layout === "dashboard") {
    return (
      <div
        className={`bg-white rounded-[14px] border border-default flex flex-col ${paddingClass} animate-pulse`}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-28 rounded bg-surface-muted" />
            <div className="h-8 w-24 rounded bg-surface-muted" />
          </div>
          <div className={`${iconSize} rounded-[10px] bg-surface-muted shrink-0`} />
        </div>

        <div className="h-3 w-32 rounded bg-surface-muted mt-2" />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-[14px] border border-default flex flex-col h-full ${paddingClass} animate-pulse`}
    >
      <div className={`flex items-center gap-3 ${size === "sm" ? "mb-3" : "mb-4"}`}>
        <div className={`${iconSize} rounded-[10px] bg-surface-muted shrink-0`} />
        <div className="h-5 w-28 rounded bg-surface-muted" />
      </div>
      <div className={size === "sm" ? "mb-1" : "mb-2"}>
        <div className={`${valueHeight} w-24 rounded bg-surface-muted`} />
      </div>
      {showSubtitle && <div className="h-5 w-32 rounded bg-surface-muted" />}
    </div>
  );
};
