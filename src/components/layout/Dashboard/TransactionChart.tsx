import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppCardLayout } from "@/components/shared";
import { useDashboard } from "@/hooks";
import { ChartSkeleton } from "./ChartSkeleton";

export const TransactionChart: React.FC = () => {
  const { t } = useTranslation(Namespace.Dashboard);

  const { trend, isLoading } = useDashboard();

  const chartData = useMemo(
    () =>
      (
        trend?.map((item) => ({
          date: item.date,
          transactions: item.transactions,
        })) ?? []
      ).slice(-6),
    [trend],
  );

  if (isLoading || chartData.length === 0) {
    return (
      <AppCardLayout title={t("transactionTrend")} className="h-100">
        <ChartSkeleton />
      </AppCardLayout>
    );
  }

  return (
    <AppCardLayout title={t("transactionTrend")} className="h-100">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(59, 130, 246, 0.5)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3B82F600" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical stroke="#f0f0f0" />

          <XAxis
            axisLine={{ stroke: "#6B7280" }}
            tickLine={{ stroke: "#6B7280" }}
            dataKey="date"
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            dy={10}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            }
          />

          <YAxis
            axisLine={{ stroke: "#6B7280" }}
            tickLine={{ stroke: "#6B7280" }}
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            domain={["auto", "auto"]}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />

          <Area
            type="monotone"
            dataKey="transactions"
            name={t("chartTooltip.transactions")}
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorValue)"
            activeDot={{
              r: 6,
              fill: "#3B82F6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AppCardLayout>
  );
};
