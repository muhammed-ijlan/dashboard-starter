import { useMemo } from "react";
import { AppTable, FilterToolbar, AppCardLayout } from "@/components/shared";
import { AdminTableSkeleton } from "./AdminTableSkeleton";
import { AdminStatsPanel } from "./AdminStatsPanel";
import { buildAdminColumns } from "./AdminTableColumns";
import type { AdminEntry } from "@/types";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { exportAllToExcel } from "@/utils/exportExcel";
import { adminApi } from "@/api";
import type { AdminSummary } from "@/api";
import { mapAdmin } from "@/hooks/useAdmin";
import { ADMIN_EXPORT_COLUMNS, EXPORT_ALL_LIMIT } from "@/constants/exportColumns";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface AdminListProps {
  data: AdminEntry[];
  loading?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  summary?: AdminSummary;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
    showTotal?: (total: number, range: [number, number]) => string;
  };
  onEdit: (entry: AdminEntry) => void;
  onDelete: (id: string) => void;
  onToggleState: (id: string) => void;
}

export const AdminList = ({
  data,
  loading,
  canUpdate = true,
  canDelete = true,
  summary,
  searchQuery,
  onSearchChange,
  pagination,
  onEdit,
  onDelete,
  onToggleState,
}: AdminListProps) => {
  const { t } = useTranslation([Namespace.Admin, Namespace.Common]);

  const columns = useMemo(
    () => buildAdminColumns({ t, onEdit, onDelete, onToggleState, canUpdate, canDelete }),
    [t, onEdit, onDelete, onToggleState, canUpdate, canDelete],
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminStatsPanel data={data} summary={summary} loading={loading} />

      <AppCardLayout className="py-6" contentClassName="flex flex-col gap-6">
        <FilterToolbar
          searchValue={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={t("placeholder")}
          exportButtonText={t("common:actions.export")}
          exportCount={pagination?.total}
          onExportClick={() =>
            exportAllToExcel(
              async () => {
                const res = await adminApi.getAdmins({
                  page: 1,
                  limit: EXPORT_ALL_LIMIT,
                  search: searchQuery || undefined,
                });
                return res.list.map(mapAdmin).map((entry) => ({
                  ...entry,
                  state: t(`state.${entry.state}` as never),
                  google2FA: t(`google2FA.${entry.google2FA}` as never),
                }));
              },
              ADMIN_EXPORT_COLUMNS,
              "admins",
            )
          }
        />

        {loading && data.length === 0 ? (
          <AdminTableSkeleton />
        ) : (
          <AppTable<AdminEntry>
            data={data}
            columns={columns}
            loading={loading}
            rowKey="id"
            options={{ bordered: false }}
            pagination={{
              pageSize: DEFAULT_PAGE_SIZE,
              ...pagination,
              showTotal:
                pagination?.showTotal ??
                ((total, range) =>
                  t("common:pagination", {
                    range0: range[0],
                    range1: range[1],
                    total,
                  })),
            }}
          />
        )}
      </AppCardLayout>
    </div>
  );
};
