import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Download, Filter as FilterIcon, ChevronRight } from "lucide-react";
import { ConfigProvider, Select } from "antd";
import { Namespace } from "@/i18n/namespaces";
import type { FilterToolbarProps } from "@/types";
import { AppButton } from "../AppButton";
import { ExportConfirmModal } from "../ExportConfirmModal";

const FILTER_SELECT_THEME = {
  token: {
    colorPrimary: "#3B82F6",
    controlOutline: "#3B82F6",
    controlOutlineWidth: 1,
  },
  components: {
    Select: {
      controlHeight: 42,
      borderRadius: 10,
      colorBorder: "#D1D5DC",
      colorBgContainer: "#FFFFFF",
      colorText: "#374151",
      colorTextPlaceholder: "#374151",
      paddingSM: 16,
      hoverBorderColor: "#D1D5DC",
      activeBorderColor: "#3B82F6",
    },
  },
};

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchValue,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters,
  onFilterChange,
  onFilterClick,
  filterButtonText = "",
  onExportClick,
  exportCount,
  exportButtonText = "",
}) => {
  const { t } = useTranslation(Namespace.Common);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleConfirm = async () => {
    if (!onExportClick) return;
    setExporting(true);
    try {
      await onExportClick();
    } finally {
      setExporting(false);
      setConfirmOpen(false);
    }
  };

  const hasExtraControls = (filters?.length ?? 0) > 0 || !!onFilterClick;

  const searchBox = (
    <div
      className={`relative ${
        hasExtraControls ? "w-full lg:flex-1 lg:min-w-64 lg:max-w-104" : "flex-1 min-w-50"
      }`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-white border rounded-[10px] outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 ${
          searchValue ? "border-blue-500 ring-1 ring-blue-500" : "border-secondary"
        }`}
      />
    </div>
  );

  const filterDropdowns = filters?.length ? (
    <div className="flex items-center gap-3 w-full lg:w-auto">
      <ConfigProvider theme={FILTER_SELECT_THEME}>
        {filters.map((filter) => (
          <Select
            key={filter.id}
            value={filter.value || undefined}
            onChange={(value) => {
              onFilterChange?.(filter.id, (value as string | undefined) ?? "");
              (document.activeElement as HTMLElement | null)?.blur();
            }}
            options={filter.options}
            placeholder={filter.options[0]?.label}
            allowClear={false}
            showSearch={{
              optionFilterProp: "label",
              filterOption: (input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase()),
            }}
            suffixIcon={<ChevronRight className="w-4 h-4 text-[#99A0AE]" strokeWidth={2} />}
            notFoundContent={t("empty.noResults")}
            className="flex-1 min-w-0 lg:flex-none lg:w-56.75!"
            styles={{ input: { caretColor: "transparent", lineHeight: "40px" } }}
          />
        ))}
      </ConfigProvider>
    </div>
  ) : null;

  const filterButton = onFilterClick && (
    <AppButton
      variant="secondary"
      onClick={onFilterClick}
      className="shrink-0 justify-center rounded-[10px] border border-secondary inline-flex items-center gap-2"
    >
      <FilterIcon className="w-4 h-4 text-gray-600 shrink-0" />
      <span className="hidden md:inline whitespace-nowrap">{filterButtonText}</span>
    </AppButton>
  );

  const exportButton = onExportClick && (
    <AppButton
      variant="secondary"
      onClick={() => setConfirmOpen(true)}
      disabled={exportCount === 0}
      className={`shrink-0 justify-center rounded-[10px] border border-secondary inline-flex items-center gap-2 ${
        exportCount === 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Download className="w-4 h-4 text-gray-600 shrink-0" />
      <span className="hidden md:inline truncate">{exportButtonText}</span>
    </AppButton>
  );

  return (
    <div
      className={`flex items-center gap-3 flex-wrap ${
        hasExtraControls ? "w-full" : "w-full xl:w-1/2"
      }`}
    >
      {hasExtraControls ? (
        <>
          {searchBox}
          {filterDropdowns}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            {filterButton}
            {exportButton}
          </div>
        </>
      ) : (
        <>
          {searchBox}
          {exportButton}
        </>
      )}

      <ExportConfirmModal
        open={confirmOpen}
        onCancel={() => !exporting && setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={exporting}
        totalCount={exportCount}
      />
    </div>
  );
};
