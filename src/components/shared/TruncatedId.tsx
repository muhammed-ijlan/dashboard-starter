import { AppTooltip } from "./AppTooltip";

type TruncatedIdVariant = "default" | "plain";

interface TruncatedIdProps {
  value: string;
  startChars?: number;
  endChars?: number;
  className?: string;
  variant?: TruncatedIdVariant;
}

const variantClasses: Record<TruncatedIdVariant, string> = {
  default:
    "font-mono text-[14px] cursor-default text-primary bg-surface-muted px-2 py-1 rounded-sm tracking-tight truncate",
  plain: "cursor-default text-primary truncate",
};

export const TruncatedId: React.FC<TruncatedIdProps> = ({
  value,
  startChars = 10,
  endChars = 8,
  className = "",
  variant = "default",
}) => {
  const isTruncated = value.length > startChars + endChars + 3;
  const display = isTruncated ? `${value.slice(0, startChars)}...${value.slice(-endChars)}` : value;

  const content = <span className={`${variantClasses[variant]} ${className}`}>{display}</span>;

  if (!isTruncated) return content;

  return (
    <AppTooltip title={<span className="font-mono text-xs break-all">{value}</span>}>
      {content}
    </AppTooltip>
  );
};
