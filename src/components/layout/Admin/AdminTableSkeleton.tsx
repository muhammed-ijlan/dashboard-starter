import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { MobileCardSkeleton } from "@/components/shared/Table/MobileCardSkeleton";

const ROWS = 5;

export const AdminTableSkeleton = () => {
  const { t } = useTranslation([Namespace.Admin, Namespace.Common]);

  const headers = [
    { key: "admin", label: t("table.columns.admin"), width: "18%" },
    { key: "account", label: t("table.columns.account"), width: "12%" },
    { key: "role", label: t("table.columns.role"), width: "10%" },
    { key: "state", label: t("table.columns.state"), width: "10%" },
    { key: "google2FA", label: t("table.columns.google2FA"), width: "10%" },
    { key: "createdAt", label: t("table.columns.createdAt"), width: "12%" },
    { key: "lastLogin", label: t("table.columns.lastLogin"), width: "12%" },
    { key: "createdBy", label: t("table.columns.createdBy"), width: "10%" },
    { key: "actions", label: t("table.columns.actions"), width: "6%" },
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
                  className="text-left text-sm font-medium text-secondary whitespace-nowrap"
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
                {/* Admin: avatar 40×40 + name (14px) + email (12px) */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-muted shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3.5 w-24 rounded bg-surface-muted" />
                      <div className="h-3 w-36 rounded bg-surface-muted" />
                    </div>
                  </div>
                </td>

                {/* Account: TruncatedId (monospace) */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3.5 w-32 rounded bg-surface-muted" />
                </td>

                {/* Role chip: ~22px tall, content-sized */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-5.5 w-20 rounded-full bg-surface-muted" />
                </td>

                {/* State chip: icon + label */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-5.5 w-20 rounded-full bg-surface-muted" />
                </td>

                {/* Google 2FA chip: icon + label */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-5.5 w-22 rounded-full bg-surface-muted" />
                </td>

                {/* Created At: 13px date text */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3.5 w-28 rounded bg-surface-muted" />
                </td>

                {/* Last Login: 13px date text */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3.5 w-24 rounded bg-surface-muted" />
                </td>

                {/* Created By: short label */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="h-3.5 w-16 rounded bg-surface-muted" />
                </td>

                {/* Actions: 4 icon buttons (~28×28 each) */}
                <td style={{ padding: "20px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-surface-muted" />
                    <div className="h-7 w-7 rounded-md bg-surface-muted" />
                    <div className="h-7 w-7 rounded-md bg-surface-muted" />
                    <div className="h-7 w-7 rounded-md bg-surface-muted" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden">
        <MobileCardSkeleton cards={ROWS} rows={7} />
      </div>
    </div>
  );
};
