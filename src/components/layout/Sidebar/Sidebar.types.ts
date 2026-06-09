import type { resources } from "@/i18n/resources";

type NestedKey<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}.${NestedKey<T[K]>}` : K;
}[keyof T & string];

export type TFuncKey = NestedKey<typeof resources.en.common>;
export interface SidebarMenuItem {
  key: string;
  label: TFuncKey;
  path: string;
  module?: string;
  icon?: React.ComponentType<{
    size?: number | string;
    strokeWidth?: number | string;
    className?: string;
  }>;
}
