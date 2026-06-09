import type { ReactNode } from "react";
import clsx from "clsx";

interface AppCardLayoutProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export const AppCardLayout = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  contentClassName,
  headerClassName,
}: AppCardLayoutProps) => {
  const hasHeader = title || icon || action;

  return (
    <div className={clsx("card flex flex-col", className)}>
      {hasHeader && (
        <div
          className={clsx(
            "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-6 pt-6 pb-4 shrink-0",
            headerClassName,
          )}
        >
          <div className="flex items-center gap-3 text-primary">
            {icon}
            <div>
              <span>
                {title && <h3 className="text-[18px] font-semibold leading-7">{title}</h3>}
              </span>
              <span>{subtitle && <p className="text-caption text-secondary">{subtitle}</p>}</span>
            </div>
          </div>

          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx("flex-1 w-full min-h-0 px-6 pb-6", contentClassName)}>{children}</div>
    </div>
  );
};
