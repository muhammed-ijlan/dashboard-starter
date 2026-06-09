export const SystemAlertsSkeleton = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-4 border-b border-surface-muted last:border-b-0 last:pb-0 first:pt-0 animate-pulse"
        >
          <div className="w-8 h-8 rounded-[10px] bg-surface-muted shrink-0" />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="h-4 w-48 rounded bg-surface-muted" />
            <div className="h-3 w-16 rounded bg-surface-muted" />
          </div>
          <div className="h-5 w-18 rounded-full bg-surface-muted shrink-0" />
        </div>
      ))}
    </div>
  );
};
