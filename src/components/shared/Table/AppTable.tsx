import React, { useState, useMemo, useRef } from "react";
import { Table } from "antd";
import { Pagination } from "./Pagination";
import { MobileCardView } from "./MobileCardView";
import { MobileCardSkeleton } from "./MobileCardSkeleton";
import type { AppTableProps } from "@/types";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

export function AppTable<T extends object>({
  data,
  columns,
  loading = false,
  pagination,
  rowKey = "id",
  options = {},
  scrollRef: externalScrollRef,
  ...rest
}: AppTableProps<T>) {
  const { t } = useTranslation(Namespace.Common);
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const paginationScrollRef = externalScrollRef ?? internalScrollRef;

  const {
    bordered = true,
    size = "middle",
    scrollX,
    scrollY,
    sticky = true,
    selectable = false,
    onSelectionChange,
    bodyCellPadding = "14px 16px",
  } = options;

  const pageSize = (pagination !== false && pagination?.pageSize) || 10;
  const showTotal = pagination !== false ? pagination?.showTotal : undefined;
  const isControlled = pagination !== false && pagination?.current !== undefined;

  const [internalPage, setInternalPage] = useState(1);
  const currentPage = isControlled ? (pagination?.current ?? 1) : internalPage;
  const handlePageChange = isControlled ? (pagination?.onChange ?? (() => {})) : setInternalPage;
  const totalRows = isControlled ? (pagination?.total ?? data.length) : data.length;

  const pagedData = useMemo(
    () =>
      pagination === false || isControlled
        ? data
        : data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, pagination, isControlled, currentPage, pageSize],
  );

  const rowSelection = useMemo(
    () =>
      selectable
        ? {
            onChange: (selectedRowKeys: React.Key[]) => {
              onSelectionChange?.(selectedRowKeys);
            },
          }
        : undefined,
    [selectable, onSelectionChange],
  );

  const scroll = useMemo(
    () => (scrollX || scrollY ? { x: scrollX, y: scrollY } : { x: "max-content" }),
    [scrollX, scrollY],
  );

  return (
    <div ref={internalScrollRef} className="flex flex-col gap-6">
      {/* Desktop: Table */}
      <div className="hidden xl:block" style={{ minHeight: 320 }}>
        <div
          className="transition-opacity duration-300"
          style={{
            opacity: loading ? 0.5 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <Table<T>
            dataSource={pagedData}
            columns={columns}
            loading={loading && pagedData.length === 0}
            rowKey={rowKey}
            pagination={false}
            bordered={bordered}
            size={size}
            scroll={scroll}
            sticky={sticky === true ? { offsetHeader: 0 } : sticky}
            rowSelection={rowSelection}
            locale={{
              emptyText: loading ? (
                <div style={{ minHeight: 200 }} />
              ) : (
                <div className="py-16 text-center text-secondary text-body">
                  {t("empty.noData")}
                </div>
              ),
            }}
            components={{
              header: {
                cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
                  <th
                    {...props}
                    className={`${props.className ?? ""} whitespace-nowrap`}
                    style={{
                      ...props.style,
                      padding: "12px 16px",
                      borderBottom: "1px solid #E5E7EB",
                      background: "transparent",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#364153",
                      letterSpacing: "0.01em",
                      boxShadow: "0 1px 0 rgba(15, 23, 42, 0.04)",
                    }}
                  />
                ),
              },
              body: {
                cell: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
                  <td
                    {...props}
                    style={{
                      ...props.style,
                      padding: bodyCellPadding,
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  />
                ),
              },
            }}
            {...rest}
          />
        </div>
      </div>

      {/* Mobile: Card view */}
      <div className="xl:hidden" style={{ minHeight: 320 }}>
        {loading ? (
          <MobileCardSkeleton cards={4} rows={columns.length} />
        ) : pagedData.length > 0 ? (
          <MobileCardView<T> data={pagedData} columns={columns} rowKey={rowKey} />
        ) : (
          <div className="py-16 text-center text-secondary text-body">{t("empty.noData")}</div>
        )}
      </div>

      {pagination !== false && totalRows > 0 && (
        <Pagination
          current={currentPage}
          total={totalRows}
          pageSize={pageSize}
          onChange={handlePageChange}
          showTotal={showTotal}
          scrollRef={paginationScrollRef}
          pageSizeOptions={pagination?.pageSizeOptions}
          onPageSizeChange={pagination?.onPageSizeChange}
        />
      )}
    </div>
  );
}
