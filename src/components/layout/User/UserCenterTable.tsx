import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUserCenter } from "@/hooks";
import type { TableColumnsType } from "antd";
import { AppCardLayout, AppTable, TruncatedId, CopyButton } from "@/components/shared";
import type { Platform, UserDevice } from "@/types";
import { platformConfig } from "@/constants/const";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { exportAllToExcel } from "@/utils/exportExcel";
import { formatDate } from "@/utils";
import { userCenterApi } from "@/api";
import { useDebounce } from "@/hooks/useDebounce";
import { UserCenterTableSkeleton } from "./UserCenterTableSkeleton";
import { EXPORT_ALL_LIMIT, USER_DEVICE_EXPORT_COLUMNS } from "@/constants/exportColumns";
import { SEARCH_DEBOUNCE_MS } from "@/constants/const";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export const UserCenterTable = () => {
  const { t } = useTranslation([Namespace.Users, Namespace.Common]);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const {
    devices: data,
    devicesFetching: isFetching,
    devicesLoading: isLoading,
  } = useUserCenter({
    deviceParams: {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearch || undefined,
    },
  });

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const columns: TableColumnsType<UserDevice> = useMemo(
    () => [
      {
        title: t("table.columns.deviceId"),
        dataIndex: "deviceId",
        key: "deviceId",
        render: (deviceId: string, record) => {
          const { icon: Icon, background, iconColor } = platformConfig[record.platform];
          return (
            <div className="flex items-center gap-2 md:gap-3 md:px-4 md:py-[18.5px]">
              <div
                className="hidden md:flex w-9 h-9 rounded-[10px] items-center justify-center shrink-0"
                style={{ background }}
              >
                <Icon size={15} style={{ color: iconColor }} strokeWidth={2.2} />
              </div>
              <TruncatedId value={deviceId} startChars={10} endChars={6} />
              <CopyButton text={deviceId} size={14} />
            </div>
          );
        },
      },
      {
        title: t("table.columns.installTime"),
        dataIndex: "installTime",
        key: "installTime",
        render: (value: string) => (
          <span className="text-sm text-gray-600">{formatDate(value)}</span>
        ),
      },
      {
        title: t("table.columns.platform"),
        dataIndex: "platform",
        key: "platform",
        render: (platform: Platform) => {
          const { icon: Icon, background, iconColor, textColor } = platformConfig[platform];
          return (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium xl:w-full xl:justify-center"
              style={{ background, color: textColor }}
            >
              <Icon size={13} style={{ color: iconColor }} strokeWidth={1.5} />
              {platform}
            </span>
          );
        },
      },
      {
        title: t("table.columns.wallets"),
        dataIndex: "walletCount",
        key: "walletCount",
        render: (value: number) => (
          <span className="text-sm text-gray-800">
            <span className="font-semibold">{value}</span>
            <span className="text-gray-400 text-xs ml-0.5">
              {t("table.walletCount", { count: value })}
            </span>
          </span>
        ),
      },
      {
        title: t("table.columns.lastActive"),
        dataIndex: "lastActive",
        key: "lastActive",
        render: (value: string) => (
          <span className="text-sm text-gray-600">{formatDate(value)}</span>
        ),
      },
    ],
    [t],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchParams(value ? { search: value } : {}, { replace: true });
    setCurrentPage(1);
  };

  return (
    <div ref={scrollRef}>
      <AppCardLayout className="py-6 overflow-hidden" contentClassName="flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-0 flex-wrap">
          <FilterToolbar
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder={t("searchPlaceholder")}
            exportCount={data?.total ?? 0}
            onExportClick={() =>
              exportAllToExcel(
                async () => {
                  const res = await userCenterApi.getDevices({
                    page: 1,
                    limit: EXPORT_ALL_LIMIT,
                    search: debouncedSearch || undefined,
                  });
                  return res.data;
                },
                USER_DEVICE_EXPORT_COLUMNS,
                "user-devices",
              )
            }
            exportButtonText={t("common:actions.export")}
          />
        </div>

        {isLoading ? (
          <UserCenterTableSkeleton rows={4} />
        ) : (
          <AppTable<UserDevice>
            data={data?.data ?? []}
            columns={columns}
            rowKey="deviceId"
            loading={isFetching}
            options={{ bordered: false, size: "middle" }}
            scrollRef={scrollRef}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data?.total ?? 0,
              onChange: setCurrentPage,
              onPageSizeChange: handlePageSizeChange,
              showTotal: (total, range) =>
                t("common:pagination", {
                  range0: range[0],
                  range1: range[1],
                  total,
                }),
            }}
          />
        )}
      </AppCardLayout>
    </div>
  );
};
