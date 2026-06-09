import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { MobileCardSkeleton } from "@/components/shared/Table/MobileCardSkeleton";

interface UserCenterTableSkeletonProps {
  rows?: number;
}

export const UserCenterTableSkeleton = ({ rows = 20 }: UserCenterTableSkeletonProps) => {
  const { t } = useTranslation(Namespace.Users);

  const headers = [
    { key: "deviceId", label: t("table.columns.deviceId") },
    { key: "installTime", label: t("table.columns.installTime") },
    { key: "platform", label: t("table.columns.platform") },
    { key: "wallets", label: t("table.columns.wallets") },
    { key: "lastActive", label: t("table.columns.lastActive") },
  ];

  return (
    <div className="min-h-80 w-full">
      <div className="hidden xl:block overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              {headers.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-sm font-medium text-secondary"
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #E5E7EB",
                    background: "transparent",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center gap-3 px-4 py-[18.5px]">
                    <div className="w-9 h-9 rounded-[10px] bg-surface-muted shrink-0" />
                    <div className="h-5 w-48 rounded bg-surface-muted" />
                    <div className="h-4 w-4 rounded bg-surface-muted shrink-0" />
                  </div>
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-4 w-28 rounded bg-surface-muted" />
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-6 w-20 rounded-full bg-surface-muted mx-auto" />
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-4 w-16 rounded bg-surface-muted" />
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-4 w-28 rounded bg-surface-muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden">
        <MobileCardSkeleton cards={rows} rows={4} showActions={false} />
      </div>
    </div>
  );
};
