import { Check } from "lucide-react";

export interface ScopeOptionProps {
  selected: boolean;
  canManage: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
}

export const ScopeOption = ({
  selected,
  canManage,
  onSelect,
  icon,
  label,
  children,
}: ScopeOptionProps) => {
  const selectedClasses = "border-[#155DFC] bg-[#F6F8FF]";
  const unselectedClasses = "border-default bg-white";
  const cursorClass = canManage ? "cursor-pointer" : "cursor-default";

  return (
    <div
      role="button"
      tabIndex={canManage ? 0 : -1}
      className={`border rounded-[10px] px-4 py-3 transition-colors ${
        selected ? selectedClasses : unselectedClasses
      } ${cursorClass}`}
      onClick={() => {
        if (canManage) onSelect();
      }}
      onKeyDown={(e) => {
        if (!canManage) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-5 h-5 inline-flex items-center justify-center rounded shrink-0 border ${
            selected ? "bg-[#155DFC] border-[#155DFC]" : "bg-white border-[#D1D5DC]"
          }`}
        >
          {selected && <Check size={14} strokeWidth={3} className="text-white" />}
        </span>
        <span className="text-[#4A5565] shrink-0 inline-flex">{icon}</span>
        <span
          className="text-[14px] font-medium text-primary"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
};
