import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { MobileCardSkeleton } from "@/components/shared/Table/MobileCardSkeleton";

const ROWS = 5;

export const DAppTableSkeleton = () => {
  const { t } = useTranslation([Namespace.Dapps, Namespace.Common]);

  const headers = [
    { key: "dapp", label: t("table.columns.dapp"), width: "20%" },
    { key: "description", label: t("table.columns.description"), width: "22%" },
    { key: "url", label: t("table.columns.url"), width: "18%" },
    { key: "type", label: t("table.columns.type"), width: "10%" },
    { key: "clicks", label: t("table.columns.clicks"), width: "8%" },
    { key: "favorites", label: t("table.columns.favorites"), width: "8%" },
    { key: "status", label: t("table.columns.status"), width: "10%" },
    { key: "actions", label: t("table.columns.actions"), width: "4%" },
  ];

  return (
    <div className="min-h-80 w-full">
      <div className="hidden xl:block overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {headers.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-sm font-medium text-gray-500 whitespace-nowrap"
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #E5E7EB",
                    background: "transparent",
                    width: col.width,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                    <div className="h-4 w-3/4 max-w-30 rounded bg-gray-100" />
                  </div>
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-3/4 rounded bg-gray-100" />
                  </div>
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3 w-3/4 rounded bg-gray-100" />
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-6 w-16 rounded-full bg-gray-100" />
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3 w-12 rounded bg-gray-100" />
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3 w-12 rounded bg-gray-100" />
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-6 w-20 rounded-full bg-gray-100" />
                </td>
                <td style={{ padding: "24.5px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-3 w-10 rounded-lg bg-gray-100" />
                    <div className="h-3 w-10 rounded-lg bg-gray-100" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden">
        <MobileCardSkeleton cards={ROWS} rows={5} />
      </div>
    </div>
  );
};
