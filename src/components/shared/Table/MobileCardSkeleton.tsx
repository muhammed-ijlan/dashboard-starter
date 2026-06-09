interface MobileCardSkeletonProps {
  cards?: number;
  rows?: number;
  showHeader?: boolean;
  showActions?: boolean;
}

export const MobileCardSkeleton = ({
  cards = 4,
  rows = 4,
  showHeader = true,
  showActions = true,
}: MobileCardSkeletonProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: cards }).map((_, cardIdx) => (
        <div
          key={cardIdx}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col animate-pulse"
        >
          {showHeader && (
            <div className="px-4 py-3.5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
                <div className="h-4 w-1/2 max-w-35 rounded bg-gray-200" />
              </div>
              {showActions && (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gray-200" />
                  <div className="w-8 h-8 rounded-lg bg-gray-200" />
                </div>
              )}
            </div>
          )}

          <div className="p-4 flex flex-col gap-3.5">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-between gap-4">
                <div className="h-3 w-16 rounded bg-gray-100 shrink-0" />
                <div
                  className="h-3 rounded bg-gray-100"
                  style={{ width: `${40 + ((rowIdx * 17) % 30)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
