import { ChevronUp, ChevronDown, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameZhCn: string;
  nameZhHk?: string;
  sort: number;
  enabled: boolean;
  dappCount: number;
}

interface SortableCategoryRowProps {
  cat: CategoryItem;
  displayName: string;
  isFirst: boolean;
  isLast: boolean;
  canEdit: boolean;
  canDelete: boolean;
  sortPending?: boolean;
  togglePending?: boolean;
  summary: string;
  labelEnabled: string;
  labelDisabled: string;
  labelEdit: string;
  labelDelete: string;
  labelToggle: string;
  registerNode: (id: string, node: HTMLDivElement | null) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function SortableCategoryRow({
  cat,
  displayName,
  isFirst,
  isLast,
  canEdit,
  canDelete,
  sortPending = false,
  togglePending = false,
  summary,
  labelEnabled,
  labelDisabled,
  labelEdit,
  labelDelete,
  labelToggle,
  registerNode,
  onMoveUp,
  onMoveDown,
  onEdit,
  onToggle,
  onDelete,
}: SortableCategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cat.id,
  });

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    registerNode(cat.id, node);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    boxShadow: isDragging
      ? "0px 10px 20px -5px rgba(0,0,0,0.15), 0px 4px 8px -2px rgba(0,0,0,0.08)"
      : undefined,
    position: "relative",
  };

  const isDeletable = cat.dappCount === 0;
  const dragEnabled = canEdit && !sortPending;
  const dragProps = dragEnabled ? { ...attributes, ...listeners } : {};
  const cursorClass = dragEnabled
    ? isDragging
      ? "cursor-grabbing"
      : "cursor-grab"
    : sortPending && canEdit
      ? "cursor-wait"
      : "";

  return (
    <div
      ref={setRefs}
      style={style}
      {...dragProps}
      className={`flex items-center gap-3 p-4 bg-white touch-none select-none ${cursorClass} ${
        isLast ? "rounded-b-xl" : "border-b border-[#E5E7EB]"
      }`}
    >
      {canEdit && (
        <div
          className={`flex flex-col text-[#6A7282] shrink-0 ${sortPending ? "cursor-not-allowed" : ""}`}
        >
          <button
            type="button"
            onClick={onMoveUp}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isFirst || sortPending}
            className="p-1.5 rounded inline-flex items-center justify-center hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronUp size={12} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isLast || sortPending}
            className="p-1.5 rounded inline-flex items-center justify-center hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <ChevronDown size={12} strokeWidth={2.2} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[16px] font-medium text-primary truncate min-w-0"
            style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
            title={displayName}
          >
            {displayName.length > 20 ? `${displayName.slice(0, 20)}…` : displayName}
          </span>
          {cat.enabled ? (
            <span
              className="text-[12px] font-normal h-5 px-2 inline-flex items-center rounded-full bg-[#DCFCE7] text-[#008236]"
              style={{ lineHeight: "16px" }}
            >
              {labelEnabled}
            </span>
          ) : (
            <span
              className="text-[12px] font-normal h-5 px-2 inline-flex items-center rounded-full bg-[#FFF1F0] text-[#FB3748]"
              style={{ lineHeight: "16px" }}
            >
              {labelDisabled}
            </span>
          )}
        </div>
        <span
          className="text-[14px] font-normal text-[#6A7282]"
          style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
        >
          {summary}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {canEdit && (
          <>
            <button
              type="button"
              onClick={onEdit}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 rounded text-[#4A5565] hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer"
              title={labelEdit}
            >
              <Pencil size={16} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onToggle}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={togglePending}
              className="p-1 rounded text-[#4A5565] hover:text-primary hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-wait disabled:hover:bg-transparent disabled:hover:text-[#4A5565]"
              title={labelToggle}
            >
              {cat.enabled ? (
                <Eye size={16} strokeWidth={2} />
              ) : (
                <EyeOff size={16} strokeWidth={2} />
              )}
            </button>
          </>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={!isDeletable}
            className={
              isDeletable
                ? "p-1 rounded text-[#E7000B] hover:bg-red-50 transition-colors cursor-pointer"
                : "p-1 rounded text-[#D1D5DC] cursor-not-allowed"
            }
            title={labelDelete}
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
