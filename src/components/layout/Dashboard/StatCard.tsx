import React, { memo } from "react";
import type { StatCardProps, SubtitleType } from "@/types";
import { STAT_CARD } from "@/constants/const";

// --- Helpers ---

const resolveSubtitleType = (subtitleType?: SubtitleType, isPositive?: boolean): SubtitleType => {
  if (subtitleType) return subtitleType;
  if (isPositive === undefined) return "neutral";
  return isPositive ? "positive" : "negative";
};

const getSubtitleColorClass = (type: SubtitleType): string => {
  switch (type) {
    case "positive":
      return "text-[#00A63E]";
    case "negative":
      return "text-[#E7000B]";
    default:
      return "text-secondary";
  }
};

export const StatCard: React.FC<StatCardProps> = memo(
  ({
    title,
    value,
    valueClassName = "",

    size = "sm",

    IconComponent,
    iconContainerClassName = "",
    iconClassName = "",

    subtitle,
    subtitleType,
    isPositive,

    layout = "standard",
    className = "",
  }) => {
    const resolvedSubtitleType = resolveSubtitleType(subtitleType, isPositive);
    const subtitleColorClass = getSubtitleColorClass(resolvedSubtitleType);

    const sizes = STAT_CARD.SIZES[size];

    const paddingClass = size === "sm" ? "p-4.25" : "p-6.25";

    const valueClass = `${sizes.value} ${size === "sm" ? "leading-[32px]" : "leading-[36px]"} font-semibold ${valueClassName}`;
    const iconContainerClass = `${sizes.container} flex items-center justify-center shrink-0 ${iconContainerClassName}`;
    const iconClass = `${sizes.icon} ${iconClassName}`;

    const baseCardClasses = `
    bg-white rounded-[14px]
    border border-default
    flex flex-col h-full
    ${paddingClass}
    ${className}
  `;

    const renderIcon = () => {
      if (!IconComponent) return null;
      return (
        <div className={iconContainerClass}>
          <IconComponent className={iconClass} />
        </div>
      );
    };

    const renderSubtitle = () => {
      if (!subtitle) return null;
      return (
        <div className={`flex items-center`}>
          <span className={`text-body font-normal ${subtitleColorClass}`}>{subtitle}</span>
        </div>
      );
    };

    // --- Layouts ---

    if (layout === "standard") {
      return (
        <div className={baseCardClasses}>
          <div className="flex flex-col h-full">
            <div className={`flex items-center gap-3 ${size === "sm" ? "mb-3" : "mb-4"}`}>
              {renderIcon()}
              <p className="text-muted text-body font-normal  tracking-[-0.15px]">{title}</p>
            </div>

            <div className={`${size === "sm" ? "mb-1" : "mb-2"}`}>
              <h3 className={valueClass}>{value}</h3>
            </div>

            {renderSubtitle()}
          </div>
        </div>
      );
    }

    if (layout === "simple") {
      return (
        <div className={baseCardClasses}>
          <div className="flex flex-col h-full">
            <p className="text-muted text-body font-normal  tracking-[-0.15px]">{title}</p>
            <div className="mt-auto">
              <h3 className={valueClass}>{value}</h3>
            </div>
          </div>
        </div>
      );
    }

    // dashboard
    return (
      <div className={baseCardClasses}>
        <div className="flex justify-between items-start">
          <div className="gap-1 flex flex-col">
            <p className="text-muted text-body font-normal  tracking-[-0.15px]">{title}</p>
            <h3 className="text-[24px] font-semibold leading-8">{value}</h3>
          </div>

          {renderIcon()}
        </div>

        {renderSubtitle()}
      </div>
    );
  },
);
