import React from "react";
import { Loader2 } from "lucide-react";
import i18n from "@/i18n/i18n";

export interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, fullScreen = false }) => {
  const text = message ?? i18n.t("loading", { ns: "common", defaultValue: "Loading..." });
  return (
    <div
      className={`flex flex-col w-full items-center justify-center gap-4 p-6 ${
        fullScreen ? "min-h-screen bg-surface-muted/50" : "min-h-75"
      }`}
    >
      <div className="relative flex items-center justify-center p-4 bg-surface border border-border-primary rounded-2xl shadow-sm">
        <Loader2 className="w-7 h-7 text-primary animate-spin" strokeWidth={2.5} />
      </div>

      <p className="text-secondary text-sm font-medium tracking-wide animate-pulse m-0">{text}</p>
    </div>
  );
};
