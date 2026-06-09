import { useState, useCallback } from "react";

export function useFilters<F extends Record<string, string>>(
  initialFilters: F,
  onFilterChange?: () => void,
  initialSearch = "",
) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilters, setActiveFilters] = useState<F>(initialFilters);

  const handleFilterChange = useCallback(
    (filterId: string, value: string) => {
      setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
      onFilterChange?.();
    },
    [onFilterChange],
  );

  return { searchQuery, setSearchQuery, activeFilters, handleFilterChange };
}
