const BAR_HEIGHTS = [40, 65, 50, 80, 55, 70];
const Y_TICKS = 5;

export const ChartSkeleton = () => {
  return (
    <div className="flex h-75 w-full animate-pulse">
      <div className="flex flex-col justify-between items-end py-2 pr-3 pl-1">
        {Array.from({ length: Y_TICKS }).map((_, i) => (
          <div key={i} className="h-3 w-8 rounded bg-surface-muted" />
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end gap-3 pb-4 pr-2">
          {BAR_HEIGHTS.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div className="w-full rounded-t bg-surface-muted" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="h-px bg-surface-muted" />
        <div className="flex justify-between pr-2 pt-3 pb-1">
          {BAR_HEIGHTS.map((_, i) => (
            <div key={i} className="h-3 w-8 rounded bg-surface-muted" />
          ))}
        </div>
      </div>
    </div>
  );
};
