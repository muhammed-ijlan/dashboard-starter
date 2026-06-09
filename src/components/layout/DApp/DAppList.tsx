import { useMemo, useRef, useState } from "react";
import { useDappTypes } from "@/hooks";
import type { FilterConfig, DAppStatus } from "@/types";
import { ExternalLink, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import type { TFunction } from "i18next";
import { exportAllToExcel } from "@/utils/exportExcel";
import { dappsApi } from "@/api";
import { AppCardLayout, AppTable, AppTooltip, FilterToolbar } from "@/components/shared";
import { StatCard, StatCardSkeleton } from "@/components/layout/Dashboard";
import { dappStatusConfig } from "@/constants/const";
import type { StatCardLayout } from "@/types";
import type { DAppEntry } from "@/api/dapps";
import { DAppTableSkeleton } from "./DAppTableSkeleton";
import { DAPP_EXPORT_COLUMNS, EXPORT_ALL_LIMIT } from "@/constants/exportColumns";
import { resolveDappDisplayIcon } from "@/constants/dappIcons";
import { GRADIENTS } from "@/constants/gradients";
import { confirmAction, formatNumber } from "@/utils";
import { getCategoryDisplayName, getDappTypeDisplayName } from "./category";

// --- CONFIGS ---
const simpleLayout: StatCardLayout = "simple";
const TYPE_MAX_CHARS = 25;

function DappIcon({ icon, name }: { icon: string | undefined; name: string }) {
  const resolved = resolveDappDisplayIcon(icon, name);
  const [errored, setErrored] = useState(false);

  const wrapperClass =
    "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden";
  const wrapperStyle = { background: GRADIENTS.dappIcon };

  if (resolved.kind === "image" && !errored) {
    return (
      <div className={`${wrapperClass} p-0.5`} style={wrapperStyle}>
        <img
          src={resolved.src}
          alt={name}
          className="w-full h-full object-contain"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  const fallbackText =
    resolved.kind === "text" ? resolved.value : name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {fallbackText}
    </div>
  );
}

function buildColumns(
  t: TFunction<["dapps", "common"], undefined>,
  language: string,
  onEdit: (entry: DAppEntry) => void,
  onDelete: (id: string) => void,
  canEdit?: boolean,
  canDelete?: boolean,
): TableColumnsType<DAppEntry> {
  const hasActions = canEdit || canDelete;
  const columns: TableColumnsType<DAppEntry> = [
    {
      title: t("table.columns.dapp"),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record) => (
        <div className="flex items-center gap-3">
          <DappIcon icon={record.icon || record.logo} name={name} />
          <span className="font-medium text-gray-900 text-body">{name}</span>
        </div>
      ),
    },
    {
      title: t("table.columns.description"),
      dataIndex: "description",
      key: "description",
      width: 280,
      render: (text: string) =>
        text ? (
          <AppTooltip title={text}>
            <span className="text-gray-500 text-[13px] block truncate max-w-65 cursor-default">
              {text}
            </span>
          </AppTooltip>
        ) : (
          <span className="text-gray-400 text-[13px]">-</span>
        ),
    },
    {
      title: t("table.columns.url"),
      dataIndex: "url",
      key: "url",
      width: 220,
      ellipsis: true,
      render: (url: string) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={url}
            className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 text-[13px] transition-colors max-w-full align-middle"
            style={{ maxWidth: 188 }}
          >
            <span className="truncate min-w-0 overflow-hidden whitespace-nowrap">
              {url.replace("https://", "")}
            </span>
            <ExternalLink size={12} className="shrink-0" />
          </a>
        ) : (
          <span className="text-gray-400 text-[13px]">-</span>
        ),
    },
    {
      title: t("table.columns.type"),
      dataIndex: "type",
      key: "category",
      width: 160,
      render: (_: unknown, record: DAppEntry) => {
        const displayText = getDappTypeDisplayName(record.types_lang, record.type, language);
        if (!displayText) return <span className="text-gray-400 text-[13px]">-</span>;
        const isTruncated = displayText.length > TYPE_MAX_CHARS;
        const chip = (
          <span
            className="inline-block px-2.5 py-1 rounded-full text-caption font-medium whitespace-nowrap cursor-default"
            style={{ background: "#E0F2FE", color: "rgb(2, 132, 199)" }}
          >
            {isTruncated ? `${displayText.slice(0, TYPE_MAX_CHARS)}…` : displayText}
          </span>
        );
        return isTruncated ? <AppTooltip title={displayText}>{chip}</AppTooltip> : chip;
      },
    },
    {
      title: t("table.columns.clicks"),
      dataIndex: "clicks",
      key: "clicks",
      width: 100,
      render: (val: number) => (
        <span className="text-gray-700 text-[13px]">{formatNumber(val)}</span>
      ),
    },
    {
      title: t("table.columns.favorites"),
      dataIndex: "favorites",
      key: "favorites",
      width: 100,
      render: (val: number) => (
        <span className="text-gray-700 text-[13px]">{formatNumber(val)}</span>
      ),
    },
    {
      title: t("table.columns.status"),
      dataIndex: "statusKey",
      key: "status",
      width: 120,
      render: (_: unknown, record: DAppEntry) => {
        const isActive = record.statusKey === "active";
        const config = dappStatusConfig[isActive ? "active" : "inactive"];
        const label = isActive ? t("status.visible") : t("status.hidden");

        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium"
            style={{ background: config.background, color: config.textColor }}
          >
            {isActive ? <Eye size={10} /> : <EyeOff size={10} />}
            {label}
          </span>
        );
      },
    },
    {
      title: t("table.columns.actions"),
      key: "actions",
      width: 72,
      render: (_: unknown, record: DAppEntry) => (
        <div className="flex items-center gap-1">
          {canEdit && (
            <button
              onClick={() => onEdit(record)}
              aria-label={t("common:actions.edit")}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1 cursor-pointer"
            >
              <Pencil size={15} />
            </button>
          )}
          {canDelete && (
            <button
              className="text-red-500 transition-colors p-1 cursor-pointer"
              aria-label={t("common:actions.delete")}
              onClick={() =>
                confirmAction({
                  title: t("common:actions.confirm"),
                  content: `${t("messages.confirmDelete")} "${record.name}"?`,
                  okText: t("common:actions.confirm"),
                  cancelText: t("common:actions.cancel"),
                  onOk: () => onDelete(String(record.id)),
                })
              }
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return hasActions ? columns : columns.filter((c) => c.key !== "actions");
}

// --- PROPS ---
export interface DAppListProps {
  data: DAppEntry[];
  totalItems: number;
  isTableLoading: boolean;
  isTableFetching?: boolean;
  stats: {
    id: string;
    title: string;
    value: string;
    valueClassName?: string;
  }[];
  isStatsLoading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchQuery: string;
  statusFilter: DAppStatus | "all";
  typeIdFilter: number | undefined;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (value: DAppStatus | "all") => void;
  onTypeIdFilterChange: (value: number | undefined) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit: (entry: DAppEntry) => void;
  onDelete: (id: string) => void;
}

export const DAppList = ({
  data,
  totalItems,
  isTableLoading,
  isTableFetching = false,
  stats,
  isStatsLoading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchQuery,
  statusFilter,
  typeIdFilter,
  onSearchChange,
  onStatusFilterChange,
  onTypeIdFilterChange,
  canEdit = true,
  canDelete = true,
  onEdit,
  onDelete,
}: DAppListProps) => {
  const { t, i18n } = useTranslation([Namespace.Dapps, Namespace.Common]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { types: dappTypes } = useDappTypes();

  const typeOptions = useMemo(
    () => [
      { value: "", label: t("filters.allCategories") },
      ...(dappTypes?.map((type) => ({
        value: String(type.id),
        label: getCategoryDisplayName(type, i18n.language),
      })) ?? []),
    ],
    [dappTypes, i18n.language, t],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("filters.allStatuses") },
      { value: "active", label: t("status.visible") },
      { value: "inactive", label: t("status.hidden") },
    ],
    [t],
  );

  const typeFilterValue = typeIdFilter == null ? "" : String(typeIdFilter);

  const filters: FilterConfig[] = useMemo(
    () => [
      { id: "type", options: typeOptions, value: typeFilterValue },
      { id: "status", options: statusOptions, value: statusFilter },
    ],
    [typeOptions, statusOptions, typeFilterValue, statusFilter],
  );

  const handleFilterChange = (id: string, value: string) => {
    if (id === "type") onTypeIdFilterChange(value === "" ? undefined : Number(value));
    else if (id === "status") onStatusFilterChange(value as DAppStatus | "all");
  };

  const columns = useMemo(
    () => buildColumns(t, i18n.language, onEdit, onDelete, canEdit, canDelete),
    [t, i18n.language, onEdit, onDelete, canEdit, canDelete],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-4 gap-4">
        {isStatsLoading && (!stats || stats.length === 0)
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} layout="simple" />)
          : stats?.map((card) => (
              <StatCard
                key={card.id}
                title={card.title}
                value={card.value}
                layout={simpleLayout}
                valueClassName={card.valueClassName}
              />
            ))}
      </div>

      <div ref={scrollRef}>
        <AppCardLayout className="py-6" contentClassName="flex flex-col gap-6">
          <FilterToolbar
            searchValue={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder={t("placeholder")}
            filters={filters}
            onFilterChange={handleFilterChange}
            exportButtonText={t("common:actions.export")}
            exportCount={totalItems}
            onExportClick={() =>
              exportAllToExcel(
                async () => {
                  const res = await dappsApi.getList({
                    page: 1,
                    limit: EXPORT_ALL_LIMIT,
                    search: searchQuery || undefined,
                    status: statusFilter,
                    typeId: typeIdFilter,
                  });
                  return res.list.map((item) => ({
                    ...item,
                    type: getDappTypeDisplayName(item.types_lang, item.type, i18n.language),
                    status: item.statusKey === "active" ? t("status.visible") : t("status.hidden"),
                  }));
                },
                DAPP_EXPORT_COLUMNS,
                "dapps",
              )
            }
          />

          {isTableLoading && data.length === 0 ? (
            <DAppTableSkeleton />
          ) : (
            <AppTable<DAppEntry>
              data={data}
              loading={isTableLoading || isTableFetching}
              columns={columns}
              rowKey="id"
              options={{ bordered: false, bodyCellPadding: "24.5px 16px" }}
              scrollRef={scrollRef}
              pagination={{
                current: page,
                pageSize,
                total: totalItems,
                onChange: (newPage: number) => {
                  onPageChange(newPage);
                },
                onPageSizeChange,
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
    </div>
  );
};
