import type { TableColumnsType } from "antd";
import type { ReactNode } from "react";

interface MobileCardViewProps<T extends object> {
  data: T[];
  columns: TableColumnsType<T>;
  rowKey: string | ((record: T) => string);
  headerColIndex?: number;
  actionColKey?: string;
}

function getRowKeyValue<T extends object>(
  record: T,
  rowKey: string | ((record: T) => string),
): string {
  return typeof rowKey === "function"
    ? rowKey(record)
    : String((record as Record<string, unknown>)[rowKey]);
}

export function MobileCardView<T extends object>({
  data,
  columns,
  rowKey,
  headerColIndex = 0,
  actionColKey = "actions",
}: MobileCardViewProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((record, rowIdx) => {
        const key = getRowKeyValue(record, rowKey);

        const headerCol = columns[headerColIndex];
        const actionCol = columns.find(
          (col) =>
            col.key === actionColKey || (col as { dataIndex?: string }).dataIndex === actionColKey,
        );
        const bodyCols = columns.filter(
          (col, idx) =>
            idx !== headerColIndex &&
            col.key !== actionColKey &&
            (col as { dataIndex?: string }).dataIndex !== actionColKey,
        );

        const renderColValue = (col: TableColumnsType<T>[number]): ReactNode => {
          const dataIndex = (col as { dataIndex?: string }).dataIndex;
          const rawValue = dataIndex ? (record as Record<string, unknown>)[dataIndex] : undefined;
          const render = (col as { render?: (v: unknown, r: T, i: number) => ReactNode }).render;
          return render ? render(rawValue, record, rowIdx) : (rawValue as ReactNode);
        };

        return (
          <div
            key={key}
            className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col transition-shadow hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)]"
          >
            {(headerCol || actionCol) && (
              <div className="px-4 py-3.5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">{headerCol && renderColValue(headerCol)}</div>
                {actionCol && (
                  <div className="shrink-0 flex items-center gap-2">
                    {renderColValue(actionCol)}
                  </div>
                )}
              </div>
            )}

            <div className="p-4 flex flex-col gap-3.5">
              {bodyCols.map((col, colIdx) => {
                const colKey = col.key ?? (col as { dataIndex?: string }).dataIndex ?? colIdx;
                const title = col.title as ReactNode;
                const rendered = renderColValue(col);

                if (!title && !rendered) return null;

                return (
                  <div
                    key={String(colKey)}
                    className="flex flex-row items-start justify-between gap-4"
                  >
                    {title && (
                      <span className="text-[13px] text-gray-500 font-medium shrink-0 pt-0.5">
                        {title}
                      </span>
                    )}
                    <div className="text-[13px] text-gray-900 text-right min-w-0 break-words flex-1 flex justify-end">
                      {rendered != null ? (rendered as ReactNode) : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <span className="text-[14px] text-gray-400 font-medium">No data available</span>
        </div>
      )}
    </div>
  );
}
