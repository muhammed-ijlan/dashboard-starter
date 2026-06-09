import { useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilters, useResetOnChange } from "@/hooks";
import { Pagination } from "@/components/shared/Table/Pagination";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { downloadServerExport } from "@/utils/exportExcel";
import { walletApi } from "@/api/wallets";
import { AppCardLayout } from "@/components/shared";
import { useDebounce } from "@/hooks/useDebounce";
import { WalletCard } from "./WalletCard";
import { WalletCardSkeleton } from "./WalletCardSkeleton";
import type { WalletEntry } from "@/types";
import { useWallets } from "@/hooks";
import { SEARCH_DEBOUNCE_MS } from "@/constants/const";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export const WalletList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resetPage = useCallback(() => setCurrentPage(1), []);

  const { searchQuery, setSearchQuery, handleFilterChange } = useFilters(
    { platform: "all", currency: "all" },
    resetPage,
    initialSearch,
  );

  const { t } = useTranslation([Namespace.Wallet, Namespace.Common]);

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  useResetOnChange(debouncedSearch, resetPage);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch,
    }),
    [currentPage, pageSize, debouncedSearch],
  );

  const {
    wallets,
    walletsLoading: isLoading,
    walletsFetching: isFetching,
  } = useWallets({ listParams: queryParams });

  const walletsData = wallets?.data || [];

  const totalWallets = wallets?.total || 0;

  const handleSearchchange = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {}, { replace: true });
    resetPage();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div ref={scrollRef}>
      <AppCardLayout contentClassName="py-4 lg:py-6 flex flex-col gap-4 lg:gap-6">
        <div className="w-full pb-2 lg:pb-0">
          <FilterToolbar
            searchValue={searchQuery}
            onSearchChange={handleSearchchange}
            searchPlaceholder={t("placeholder")}
            onFilterChange={handleFilterChange}
            exportCount={totalWallets}
            onExportClick={() =>
              downloadServerExport(() =>
                walletApi.exportWallets({
                  search: debouncedSearch || undefined,
                }),
              )
            }
            filterButtonText={t("common:actions.filter")}
            exportButtonText={t("common:actions.export")}
          />
        </div>

        <div
          className="flex flex-col gap-3 min-h-100 transition-opacity duration-300"
          style={{
            opacity: isFetching && !isLoading ? 0.5 : 1,
            pointerEvents: isFetching && !isLoading ? "none" : "auto",
          }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <WalletCardSkeleton key={`skeleton-${i}`} />)
          ) : walletsData.length > 0 ? (
            walletsData?.map((wallet: WalletEntry) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm">{t("wallet:notfound")}</div>
          )}
        </div>

        <div className="w-full overflow-x-auto mt-2">
          <Pagination
            current={currentPage}
            total={totalWallets}
            pageSize={pageSize}
            onChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            scrollRef={scrollRef}
            showTotal={(total, range) =>
              t("common:pagination", {
                range0: range[0],
                range1: range[1],
                total,
              })
            }
          />
        </div>
      </AppCardLayout>
    </div>
  );
};
