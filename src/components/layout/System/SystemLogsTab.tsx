import {
  RefreshCw,
  Download,
  XCircle,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useState, useRef } from "react";
import { exportAllToExcel } from "@/utils/exportExcel";
import { systemApi } from "@/api";
import { EXPORT_ALL_LIMIT, SYSTEM_LOG_EXPORT_COLUMNS } from "@/constants/exportColumns";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { AppButton, AppCardLayout } from "@/components/shared";
import { Pagination } from "@/components/shared/Table/Pagination";
import type { ApiSystemLog } from "@/api";
import { useSystem, useLocalizedField } from "@/hooks";
import { formatDate } from "@/utils";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { LogRowSkeleton } from "./skeletons";

const levelConfig: Record<string, { badge: string; icon: string; Icon: React.ElementType }> = {
  error: {
    badge: "bg-red-100 text-red-500",
    icon: "text-[#E7000B]",
    Icon: XCircle,
  },
  warning: {
    badge: "bg-yellow-100 text-yellow-600",
    icon: "text-[#D08700]",
    Icon: AlertCircle,
  },
  info: {
    badge: "bg-blue-100 text-blue-500",
    icon: "text-[#155DFC]",
    Icon: Activity,
  },
  success: {
    badge: "bg-green-100 text-green-600",
    icon: "text-[#00A63E]",
    Icon: CheckCircle2,
  },
};

const FALLBACK_LEVEL = {
  badge: "bg-gray-100 text-gray-500",
  icon: "text-gray-400",
  Icon: Activity,
};

export function SystemLogsTab() {
  const { t } = useTranslation([Namespace.System, Namespace.Common]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { localized } = useLocalizedField();

  const {
    logs: data,
    logsLoading: isLoading,
    logsFetching: isFetching,
    refetchLogs: refetch,
  } = useSystem({
    logParams: {
      page: currentPage,
      limit: pageSize,
    },
  });
  const isRefreshing = isFetching && !isLoading;

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  const logs = data?.list ?? [];
  const total = data?.pagination?.total ?? 0;

  return (
    <div ref={scrollRef}>
      <AppCardLayout contentClassName="py-6 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-body text-gray-600">{t("systemLogsTab.title")}</p>

          <div className="flex gap-2 shrink-0">
            <AppButton
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`w-4 h-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{t("systemLogsTab.actions.refresh")}</span>
            </AppButton>
            <AppButton
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() =>
                exportAllToExcel(
                  async () => {
                    const res = await systemApi.getLogs({ page: 1, limit: EXPORT_ALL_LIMIT });
                    return res.list;
                  },
                  SYSTEM_LOG_EXPORT_COLUMNS,
                  "system-logs",
                )
              }
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t("systemLogsTab.actions.export")}</span>
            </AppButton>
          </div>
        </div>

        <div className="min-h-80">
          {isLoading ? (
            <div className="flex flex-col divide-y divide-gray-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <LogRowSkeleton key={i} />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <div
              className={`flex flex-col divide-y divide-gray-100 transition-opacity duration-300 ${isRefreshing ? "opacity-50 pointer-events-none" : "opacity-100"}`}
            >
              {logs.map((log: ApiSystemLog) => {
                const levelKey = log.level.toLowerCase();
                const cfg = levelConfig[levelKey] ?? FALLBACK_LEVEL;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-[#F9FAFB] flex items-center justify-center shrink-0">
                      <cfg.Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-caption font-normal px-2.5 py-0.5 rounded-full uppercase ${cfg.badge}`}
                        >
                          {t(`systemLogsTab.level.${log.level}`, log.level)}
                        </span>
                        <span className="text-[13px] text-gray-500">{log.source}</span>
                      </div>
                      <p className="font-normal text-body text-gray-900 mb-1">
                        {localized(log, "message")}
                      </p>
                      <div className="flex items-center gap-1.5 text-caption text-gray-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400 text-body">
              {t("systemLogsTab.empty", "No logs found")}
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
          showTotal={(tot, range) =>
            t("common:pagination", {
              range0: range[0],
              range1: range[1],
              total: tot,
            })
          }
        />
      </AppCardLayout>
    </div>
  );
}
