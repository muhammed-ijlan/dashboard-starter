import type { PlatformDistribution as PlatformDistributionData } from "@/api";
import { AppCardLayout } from "@/components/shared";
import { Monitor, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { PlatformDistributionSkeleton } from "./PlatformDistributionSkeleton";

interface PlatformDistributionProps {
  data?: PlatformDistributionData;
}

export const PlatformDistribution = ({ data }: PlatformDistributionProps) => {
  const { t } = useTranslation(Namespace.Users);
  const platformDistribution = [
    {
      label: "iOS",
      icon: Smartphone,
      background: "#EFF6FF",
      iconColor: "#3B82F6",
      value: data?.ios ?? 0,
    },
    {
      label: "Android",
      icon: Smartphone,
      background: "#F0FDF4",
      iconColor: "#22C55E",
      value: data?.android ?? 0,
    },
    {
      label: "Web",
      icon: Monitor,
      background: "#FAF5FF",
      iconColor: "#A855F7",
      value: data?.web ?? 0,
    },
    {
      label: "Desktop",
      icon: Monitor,
      background: "#FFF7ED",
      iconColor: "#F97316",
      value: data?.desktop ?? 0,
    },
  ];

  if (!data) {
    return (
      <AppCardLayout title={t("platformDistribution")}>
        <PlatformDistributionSkeleton count={platformDistribution.length} />
      </AppCardLayout>
    );
  }

  return (
    <AppCardLayout title={t("platformDistribution")}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        {platformDistribution.map(({ label, icon: Icon, background, iconColor, value }) => (
          <div
            key={label}
            className="rounded-[10px] flex flex-col items-center justify-center  p-4"
            style={{ background }}
          >
            <Icon size={32} style={{ color: iconColor }} strokeWidth={1.6} />
            <span className="text-[24px] leading-8 font-semibold text-primary mt-2 mb-1">
              {value}
            </span>
            <span className="text-caption font-normal  text-muted">{label}</span>
          </div>
        ))}
      </div>
    </AppCardLayout>
  );
};
