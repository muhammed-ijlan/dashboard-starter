import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Dayjs } from "dayjs";
import { Pagination } from "@/components/shared/Table/Pagination";
import { TransactionCard } from "./TransactionCard";
import { TransactionCardSkeleton } from "./TransactionCardSkeleton";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { exportAllToExcel } from "@/utils/exportExcel";
import { AppCardLayout } from "@/components/shared";
import { AppButton } from "@/components/shared/AppButton";
import { AppRangePicker } from "@/components/shared/Form";
import { useDebounce } from "@/hooks/useDebounce";
import { useTransactions, useResetOnChange } from "@/hooks";
import { transactionsApi } from "@/api";
import { TRANSACTION_EXPORT_COLUMNS } from "@/constants/exportColumns";
import { SEARCH_DEBOUNCE_MS } from "@/constants/const";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

type DateRange = [Dayjs | null, Dayjs | null] | null;
const DATE_FORMAT = "YYYY-MM-DD";

export const TransactionList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [pickerRange, setPickerRange] = useState<DateRange>(null);
  const [appliedRange, setAppliedRange] = useState<{ start?: string; end?: string }>({});

  const { t } = useTranslation([Namespace.Transactions, Namespace.Common]);

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  useResetOnChange(debouncedSearch, () => setCurrentPage(1));

  const {
    list: data,
    listLoading: isLoading,
    listFetching: isFetching,
  } = useTransactions({
    listParams: {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
      start: appliedRange.start,
      end: appliedRange.end,
    },
  });

  const items = data?.list ?? [];
  const total = data?.pagination?.total ?? 0;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSearchParams(val ? { search: val } : {}, { replace: true });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleApplyDateRange = () => {
    setAppliedRange({
      start: pickerRange?.[0]?.format(DATE_FORMAT),
      end: pickerRange?.[1]?.format(DATE_FORMAT),
    });
    setCurrentPage(1);
  };

  return (
    <div ref={scrollRef}>
      <AppCardLayout contentClassName="py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterToolbar
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder={t("transactions:placeholder")}
            exportCount={total}
            onExportClick={() =>
              exportAllToExcel(
                async () => {
                  const res = await transactionsApi.getList({
                    page: 1,
                    limit: total || 1,
                    search: debouncedSearch || undefined,
                    start: appliedRange.start,
                    end: appliedRange.end,
                  });
                  return res.list.map((item) => {
                    const typeKey = (item.typeKey ?? item.type ?? "").toLowerCase();
                    const rawStatus = (item.status || item.statusLabel || "").toLowerCase().trim();
                    const statusKey =
                      rawStatus === "pending"
                        ? "processing"
                        : rawStatus === "success" || rawStatus === "completed"
                          ? "completed"
                          : "failed";
                    return {
                      ...item,
                      type: t(`card.type.${typeKey}`, item.type),
                      statusLabel: t(`common:status.${statusKey}`),
                      amount: item.tokenSymbol ? `${item.amount} ${item.tokenSymbol}` : item.amount,
                      fee: item.feeSymbol ? `${item.fee} ${item.feeSymbol}` : item.fee,
                    };
                  });
                },
                TRANSACTION_EXPORT_COLUMNS,
                "transactions",
              )
            }
            exportButtonText={t("common:actions.export")}
          />
          <div className="w-full md:w-72 shrink-0">
            <AppRangePicker
              value={pickerRange}
              onChange={(value) => setPickerRange(value as DateRange)}
              format={DATE_FORMAT}
              style={{ width: "100%", height: 42, borderRadius: 10, borderColor: "#D1D5DC" }}
            />
          </div>
          <AppButton onClick={handleApplyDateRange} className="shrink-0 justify-center">
            Query
          </AppButton>
        </div>

        <div
          className="flex flex-col gap-3 min-h-80 transition-opacity duration-300"
          style={{
            opacity: isFetching && !isLoading ? 0.5 : 1,
            pointerEvents: isFetching && !isLoading ? "none" : "auto",
          }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <TransactionCardSkeleton key={i} />)
          ) : items.length > 0 ? (
            items.map((record, index) => (
              <TransactionCard key={`${record.txHash}-${index}`} record={record} />
            ))
          ) : (
            <div className="py-16 text-center text-gray-400 text-body">
              {t("transactions:notfound")}
            </div>
          )}
        </div>

        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          scrollRef={scrollRef}
          showTotal={(totalCount, range) =>
            t("common:pagination", {
              range0: range[0],
              range1: range[1],
              total: totalCount,
            })
          }
        />
      </AppCardLayout>
    </div>
  );
};
