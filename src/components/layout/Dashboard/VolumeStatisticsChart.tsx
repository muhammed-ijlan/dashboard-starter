import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CustomLegendProps, CustomTooltipProps } from "@/types";
import { COLORS } from "@/constants/const";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppCardLayout } from "@/components/shared";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCompact, formatUSD } from "@/utils";
import { ChartSkeleton } from "./ChartSkeleton";

interface TransactionVolume7d {
  date: string;
  volume: number;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded text-[15px]">
        <p className="text-gray-900 font-medium mb-2">{label}</p>

        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            style={{ color: entry.color }}
            className="font-medium leading-relaxed"
          >
            {String(entry.name)} : {formatUSD(Number(entry.value))}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span style={{ color: entry.color }} className="text-body font-medium">
            {String(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const VolumeStatisticsChart = () => {
  const { t } = useTranslation(Namespace.Dashboard);
  const { transactionVolume7d, isLoading } = useDashboard();

  const chartData = React.useMemo(() => {
    if (!transactionVolume7d) return [];

    return transactionVolume7d.map((item: TransactionVolume7d) => {
      const d = new Date(item.date);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return {
        date: `${mm}/${dd}`,
        volume: item.volume,
      };
    });
  }, [transactionVolume7d]);

  if (isLoading) {
    return (
      <AppCardLayout title={t("sevenDayStats")} className="h-100">
        <ChartSkeleton />
      </AppCardLayout>
    );
  }

  return (
    <AppCardLayout title={t("sevenDayStats")} className="h-100" contentClassName="relative">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" vertical stroke="#E5E7EB" />

          <XAxis
            dataKey="date"
            axisLine={{ stroke: "#6B7280" }}
            tickLine={{ stroke: "#6B7280" }}
            tick={{ fontSize: 13, fill: "#6B7280" }}
            dy={10}
          />

          <YAxis
            axisLine={{ stroke: "#6B7280" }}
            tickLine={{ stroke: "#6B7280" }}
            tick={{ fontSize: 13, fill: "#6B7280" }}
            tickFormatter={(value) => formatCompact(value)}
            width={70}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#D1D5DB", opacity: 0.6 }} />

          <Legend content={<CustomLegend />} />

          <Bar
            dataKey="volume"
            name={t("chartTooltip.volume")}
            fill={COLORS.primary}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </AppCardLayout>
  );
};
