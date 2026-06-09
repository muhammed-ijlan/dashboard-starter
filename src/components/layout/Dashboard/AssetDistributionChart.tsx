import { AppCardLayout } from "@/components/shared";
import { useDashboard } from "@/hooks";
import { PieChartSkeleton } from "./PieChartSkeleton";
import React from "react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type PieLabelRenderProps,
} from "recharts";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  name,
  fill,
}: PieLabelRenderProps) => {
  if (!midAngle || !name) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius! * 1.2;
  const x = cx! + radius * Math.cos(-midAngle * RADIAN);
  const y = cy! + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill || "#333"}
      textAnchor={x > cx! ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} (${Number(value).toFixed(2)}%)`}
    </text>
  );
};

export const AssetDistributionChart: React.FC = () => {
  const { t } = useTranslation(Namespace.Dashboard);
  const { assetDistribution, isLoading } = useDashboard();

  const getColorFromString = (str: string) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 55%)`;
  };

  const chartData = React.useMemo(() => {
    if (!assetDistribution) return [];
    return [...assetDistribution]
      .sort((a, b) => b.percentage - a.percentage)
      .map((item) => ({
        name: item.chainLabel,
        value: item.percentage,
        color: getColorFromString(item.chainLabel),
      }));
  }, [assetDistribution]);

  if (isLoading || chartData.length === 0) {
    return (
      <AppCardLayout title={t("assetDistribution")} className="h-full">
        <PieChartSkeleton />
      </AppCardLayout>
    );
  }

  return (
    <AppCardLayout title={t("assetDistribution")} className="h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="60%"
            dataKey="value"
            stroke="#fff"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            wrapperStyle={{ zIndex: 1000 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const entry = payload[0]?.payload as
                | { name: string; value: number; color: string }
                | undefined;
              if (!entry) return null;
              const { name, value, color } = entry;
              return (
                <div className="bg-white px-4 py-3 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-lg">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{name}</span>
                    <span className="text-sm font-semibold text-gray-900 ml-1">
                      {value.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </AppCardLayout>
  );
};

export default React.memo(AssetDistributionChart);
