import React from "react";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppCardLayout, AppScrollArea, TruncatedId } from "@/components/shared";
import type { RecentActivity as RecentActivityType } from "@/api/dashboard";
import { useDashboard } from "@/hooks";
import { formatTimeAgo } from "@/utils";
import { Link } from "react-router-dom";
import { RecentActivitySkeleton } from "./RecentActivitySkeleton";
import { routes } from "@/routes/paths";

export const RecentActivity: React.FC = () => {
  const { t, i18n } = useTranslation(Namespace.Dashboard);
  const { recentActivity, isLoading } = useDashboard();

  return (
    <AppCardLayout
      title={t("recentActivities")}
      icon={<Activity className="w-5 h-5" />}
      action={
        <Link
          to={`/${routes?.TRANSACTIONS}`}
          className="cursor-pointer text-body font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
        >
          {t("action.viewAll")}
        </Link>
      }
      className="h-100"
      contentClassName="min-h-0"
    >
      <AppScrollArea scrollbarClassName="right-[-20px]">
        <div className="">
          {isLoading ? (
            <RecentActivitySkeleton />
          ) : (
            <div className="flex flex-col">
              {recentActivity?.map((activity: RecentActivityType) => {
                const rawType = (activity.rawType ?? "").toLowerCase().trim();
                const isSend = rawType === "send" || rawType.includes("out");
                const raw = (activity.status ?? "").toLowerCase().trim();
                const statusLabel =
                  raw === "pending"
                    ? "processing"
                    : raw === "success" || raw === "completed"
                      ? "completed"
                      : "failed";
                const status = t(`common:status.${statusLabel}`, statusLabel);

                const statusStyle =
                  statusLabel === "completed"
                    ? "text-[#00A63E]"
                    : statusLabel === "processing"
                      ? "text-[#D08700]"
                      : "text-[#E7000B]";

                return (
                  <Link
                    key={activity.txHash}
                    to={`/${routes.TRANSACTIONS}?search=${encodeURIComponent(activity.txHash)}`}
                    className="flex justify-between items-center gap-3 py-3.5 border-b border-surface-muted last:border-b-0 last:pb-0 first:pt-1 hover:bg-surface-muted/50 -mx-2 px-2  transition-colors"
                  >
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <div className="flex gap-2.5 items-center min-w-0">
                        <span
                          className={`text-[14px] font-medium shrink-0 ${
                            isSend ? "text-[#F54900]" : "text-[#00A63E]"
                          }`}
                        >
                          {activity.type}
                        </span>

                        {activity.user ? (
                          <TruncatedId value={activity.user} startChars={15} endChars={15} />
                        ) : (
                          <span className="text-[14px] font-normal text-[#4A5565]">-</span>
                        )}
                      </div>

                      <span className="text-[12px] font-normal text-secondary">
                        {formatTimeAgo(activity.createdAt, i18n.language)}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[14px] font-medium text-primary">
                        {activity.amount}
                        {activity.tokenSymbol ? ` ${activity.tokenSymbol}` : ""}
                      </span>

                      <span className={`text-[12px] font-normal ${statusStyle}`}>{status}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </AppScrollArea>
    </AppCardLayout>
  );
};
