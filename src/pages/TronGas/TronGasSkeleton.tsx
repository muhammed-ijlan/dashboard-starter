import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { PageHeader } from "@/components/shared";
import { StatCardSkeleton } from "@/components/layout/Dashboard/StatCardSkeleton";

export const TronGasSkeleton = () => {
  const { t } = useTranslation(Namespace.TronGas);

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <PageHeader
        title={t("header.title")}
        description={t("header.description")}
        actions={<div className="h-10 w-28 rounded-[10px] bg-surface-muted animate-pulse" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} layout="standard" size="sm" showSubtitle />
        ))}
      </div>

      <CardSkeleton>
        <CardHeader />
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between bg-[#F9FAFB] rounded-[10px] p-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-40 rounded bg-surface-muted" />
              <div className="h-3 w-64 rounded bg-surface-muted" />
            </div>
            <div className="h-5 w-10 rounded-full bg-surface-muted" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-3 w-32 rounded bg-surface-muted" />
                <div className="h-10 w-full rounded-[10px] bg-surface-muted" />
                <div className="h-3 w-48 rounded bg-surface-muted" />
              </div>
            ))}
          </div>

          <div className="rounded-[10px] border border-gray-100 bg-gray-50 p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3.5 w-3.5 rounded bg-surface-muted" />
              <div className="h-3 w-32 rounded bg-surface-muted" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-28 rounded bg-surface-muted" />
              ))}
            </div>
          </div>

          <div className="rounded-[10px] border border-gray-100 bg-gray-50 p-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-surface-muted" />
            <div className="h-3 w-40 rounded bg-surface-muted" />
          </div>
        </div>
      </CardSkeleton>

      {/* TODO: re-enable Free Quota Configuration skeleton */}
      {/* <CardSkeleton>
        <CardHeader />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-1.5 mb-5 max-w-100">
            <div className="h-3 w-32 rounded bg-surface-muted" />
            <div className="h-10 w-full rounded-[10px] bg-surface-muted" />
            <div className="h-3 w-48 rounded bg-surface-muted" />
          </div>

          <div className="flex flex-col gap-3 mb-3">
            <div className="h-3 w-24 rounded bg-surface-muted" />

            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="border border-default bg-white rounded-[10px] px-4 py-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-surface-muted" />
                  <div className="h-4 w-44 rounded bg-surface-muted" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-3 w-72 rounded bg-surface-muted" />
        </div>
      </CardSkeleton> */}

      {/* Netts Account Card */}
      <CardSkeleton>
        <CardHeader withAction />
        <div className="px-6 pb-6">
          {/* Balance + Consumed cards (2 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[10px] border border-gray-100 bg-gray-50 p-4 flex flex-col gap-2"
              >
                <div className="h-3 w-28 rounded bg-surface-muted" />
                <div className="h-7 w-40 rounded bg-surface-muted" />
                <div className="h-3 w-32 rounded bg-surface-muted" />
              </div>
            ))}
          </div>

          {/* Recharge address row */}
          <div className="rounded-[10px] border border-default bg-surface-muted/60 px-4 py-3 flex flex-col gap-2">
            <div className="h-3 w-32 rounded bg-surface-muted" />
            <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-300">
              <div className="h-4 flex-1 rounded bg-surface-muted" />
              <div className="h-4 w-4 rounded bg-surface-muted shrink-0" />
            </div>
            <div className="h-3 w-44 rounded bg-surface-muted" />
          </div>
        </div>
      </CardSkeleton>
    </div>
  );
};

// Local building blocks ----------------------------------------------------

function CardSkeleton({ children }: { children: React.ReactNode }) {
  return <div className="card flex flex-col animate-pulse">{children}</div>;
}

function CardHeader({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-[10px] bg-surface-muted shrink-0" />
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="h-5 w-40 rounded bg-surface-muted" />
          <div className="h-3 w-56 rounded bg-surface-muted" />
        </div>
      </div>
      {withAction && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block h-10 w-64 rounded-[10px] bg-surface-muted" />
          <div className="h-10 w-36 rounded-[10px] bg-surface-muted" />
        </div>
      )}
    </div>
  );
}
