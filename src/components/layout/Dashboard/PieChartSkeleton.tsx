export const PieChartSkeleton = () => {
  return (
    <div className="relative flex items-center justify-center h-full w-full min-h-75 animate-pulse">
      <div className="w-40 h-40 rounded-full bg-surface-muted" />

      <div className="absolute w-40 h-40 rounded-full overflow-hidden">
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-white origin-bottom rotate-60" />
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-white origin-bottom rotate-140" />
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-white origin-bottom rotate-220" />
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-white origin-bottom rotate-310" />
      </div>
    </div>
  );
};
