import type { LegendProps } from "recharts";

export type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
};

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export type LegendPayloadItem = {
  value?: string;
  color?: string;
};

export interface CustomLegendProps extends LegendProps {
  payload?: LegendPayloadItem[];
}
