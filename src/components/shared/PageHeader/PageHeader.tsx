interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <h1 className="text-[24px] font-semibold text-primary leading-8">{title}</h1>

        {description && (
          <p className="text-[16px] text-muted font-normal leading-6">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
