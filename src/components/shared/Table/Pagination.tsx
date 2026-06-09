import type { PaginationProps } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useState, type RefObject } from "react";
import { Select } from "antd";
import { getPageNumbers } from "./getPageNumbers";
import { scrollToWithOffset } from "@/utils";
import { PAGE_SIZE_OPTIONS } from "@/constants/pagination";

interface ExtendedPaginationProps extends PaginationProps {
  scrollRef?: RefObject<HTMLElement | null>;
}

export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showTotal,
  scrollRef,
  pageSizeOptions,
  onPageSizeChange,
}: ExtendedPaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  const pages = getPageNumbers(current, totalPages);
  const { t } = useTranslation(Namespace.Common);

  const [jumpValue, setJumpValue] = useState("");

  const handleChange = (page: number) => {
    onChange(page);
    if (scrollRef?.current) {
      scrollToWithOffset(scrollRef.current);
    }
  };

  const handleJump = () => {
    const page = parseInt(jumpValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages && page !== current) {
      handleChange(page);
    }
    setJumpValue("");
  };

  const sizeOptions = pageSizeOptions ?? PAGE_SIZE_OPTIONS;
  const hasControls = onPageSizeChange || totalPages > 1;

  const btnBase =
    "inline-flex px-3 py-2 min-w-9 h-9 items-center justify-center rounded-[10px] border text-[13px] font-medium transition-colors select-none";
  const btnDefault =
    "border-border-secondary bg-white text-primary hover:bg-surface-muted cursor-pointer";
  const btnActive = "border-[#155DFC] bg-[#155DFC] text-white cursor-default";
  const btnDisabled = "border-border-secondary bg-white text-gray-300 cursor-not-allowed";

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile total */}
      <div className="flex justify-center md:hidden">
        <span className="text-[13px] text-secondary">
          {showTotal ? showTotal(total, [start, end]) : `${start}-${end} of ${total}`}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-between">
        {/* Desktop total */}
        <span className="hidden md:block text-[13px] text-secondary shrink-0">
          {showTotal ? showTotal(total, [start, end]) : `${start}-${end} of ${total}`}
        </span>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            className={`${btnBase} gap-1.5 ${current === 1 ? btnDisabled : btnDefault}`}
            onClick={() => current > 1 && handleChange(current - 1)}
            disabled={current === 1}
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:block">{t("actions.previous")}</span>
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="hidden md:flex h-9 min-w-9 items-center justify-center text-secondary text-[13px]"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`${btnBase} ${p === current ? btnActive : `hidden md:flex ${btnDefault}`}`}
                onClick={() => p !== current && handleChange(p)}
              >
                {p}
              </button>
            ),
          )}

          <button
            className={`${btnBase} gap-1.5 ${current === totalPages || total === 0 ? btnDisabled : btnDefault}`}
            onClick={() => current < totalPages && handleChange(current + 1)}
            disabled={current === totalPages || total === 0}
          >
            <span className="hidden sm:block">{t("actions.next")}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Controls: page size + jump */}
        {hasControls && (
          <div className="flex items-center gap-2.5 shrink-0">
            {onPageSizeChange && (
              <Select
                value={pageSize}
                onChange={(value) => onPageSizeChange(Number(value))}
                size="middle"
                style={{ height: 36 }}
                popupMatchSelectWidth={false}
                options={sizeOptions.map((size) => ({
                  value: size,
                  label: t("paginationPageSize", { size }),
                }))}
              />
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 text-[13px] text-secondary">
                <span>{t("paginationGoTo")}</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJump()}
                  onBlur={handleJump}
                  className="h-9 w-14 border border-border-secondary rounded-[10px] px-2 text-[13px] text-center text-primary bg-white focus:outline-none focus:border-[#155DFC] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder={String(current)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
