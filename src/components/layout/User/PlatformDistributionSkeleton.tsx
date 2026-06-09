interface PlatformDistributionSkeletonProps {
  count?: number;
}

export const PlatformDistributionSkeleton = ({ count = 4 }: PlatformDistributionSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[10px] flex flex-col items-center justify-center p-4 bg-surface-muted/50 animate-pulse"
        >
          <div className="w-10 h-10 rounded bg-surface-muted" />
          <div className="h-7 w-11 rounded bg-surface-muted mt-2 mb-1" />
          <div className="h-3 w-12 rounded bg-surface-muted" />
        </div>
      ))}
    </div>
  );
};
