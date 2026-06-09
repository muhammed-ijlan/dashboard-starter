export const RecentActivitySkeleton = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-3.5 border-b border-surface-muted last:border-b-0 last:pb-0 first:pt-1 animate-pulse"
        >
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="flex gap-2.5 items-center">
              <div className="h-4 w-10 rounded bg-surface-muted" />
              <div className="h-4 w-24 rounded bg-surface-muted" />
            </div>
            <div className="h-3 w-16 rounded bg-surface-muted" />
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="h-4 w-16 rounded bg-surface-muted" />
            <div className="h-3 w-14 rounded bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
};
