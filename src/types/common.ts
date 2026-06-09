import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

export type StatCardLayout = "dashboard" | "standard" | "simple";
export type SubtitleType = "positive" | "negative" | "neutral";
export type SizeVariant = "sm" | "lg";

export interface SizeConfig {
  container: string;
  icon: string;
  value: string;
}

export type IconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface ColorConfig {
  background: string;
  textColor: string;
  borderColor?: string;
}

export type DraftEntry<T extends { id: string }> = Omit<T, "id"> & {
  id?: string;
};
