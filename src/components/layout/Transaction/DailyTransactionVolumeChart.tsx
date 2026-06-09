import { AppCardLayout } from "@/components/shared";
import { ChartSkeleton } from "@/components/layout/Dashboard/ChartSkeleton";
import { useTransactions } from "@/hooks";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { formatCompact, formatUSD } from "@/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "24h" | "7d";

const PERIODS: Period[] = ["24h", "7d"];

export const DailyTransactionVolumeChart: React.FC = () => {
  const { t } = useTranslation(Namespace.Transactions);
  const [period, setPeriod] = useState<Period>("24h");

  const {
    volume24h: data24h,
    volume24hLoading: loading24h,
    volume7d: data7d,
    volume7dLoading: loading7d,
  } = useTransactions();

  const isLoading = period === "24h" ? loading24h : loading7d;
  const chartData = period === "24h" ? (data24h ?? []) : (data7d ?? []);
  const xDataKey = period === "24h" ? "hour" : "date";

  const periodToggle = (
    <div className="inline-flex bg-white rounded-[14px] p-1 gap-1 border border-default">
      {PERIODS.map((key) => (
        <button
          key={key}
          onClick={() => setPeriod(key)}
          className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            period === key
              ? "bg-[#155DFC] text-white shadow-sm"
              : "bg-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t(`periodToggle.${key}`)}
        </button>
      ))}
    </div>
  );

  return (
    <AppCardLayout
      title={period === "24h" ? t("trxVolume24") : t("trxVolume7d")}
      action={periodToggle}
      className="h-100"
    >
      <div className="flex-1 w-full min-h-0">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData as object[]}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                horizontal={true}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey={xDataKey}
                axisLine={{ stroke: "#9CA3AF" }}
                tickLine={{ stroke: "#9CA3AF" }}
                tick={{ fontSize: 13, fill: "#6B7280" }}
                dy={10}
              />

              <YAxis
                axisLine={{ stroke: "#9CA3AF" }}
                tickLine={{ stroke: "#9CA3AF" }}
                tick={{ fontSize: 13, fill: "#6B7280" }}
                tickFormatter={(value) => formatCompact(value)}
              />

              <Tooltip
                cursor={{
                  stroke: "#D1D5DB",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                formatter={(value) => formatUSD(Number(value))}
              />

              <Line
                type="monotone"
                dataKey="volume"
                name={t("chartTooltip.volume")}
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "#3B82F6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#3B82F6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </AppCardLayout>
  );
};
