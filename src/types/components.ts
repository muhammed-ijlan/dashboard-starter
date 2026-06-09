import type { ButtonProps, TableColumnsType, TableProps } from "antd";
import type { StatCardLayout, SubtitleType, SizeVariant } from "./common";

export interface StatCardProps {
  title: string;
  value: string | number;
  valueClassName?: string;

  size?: SizeVariant;

  IconComponent?: React.ElementType;
  iconContainerClassName?: string;
  iconClassName?: string;

  subtitle?: string;
  trend?: string;
  subtitleType?: SubtitleType;
  isPositive?: boolean;

  layout?: StatCardLayout;
  className?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  options: FilterOption[];
  value: string;
}

export interface FilterToolbarProps {
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string) => void;
  onFilterClick?: () => void;
  onExportClick?: () => void | Promise<void>;
  exportCount?: number;
  filterButtonText?: string;
  exportButtonText?: string;
}

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showTotal?: (total: number, range: [number, number]) => string;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export interface AppButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  variant?: "primary" | "secondary";
}

export interface PillTabItem {
  key: string;
  label: string;
  children: React.ReactNode;
}

export interface PillTabsProps {
  items: PillTabItem[];
  defaultActiveKey?: string;
}

export interface AppTableOptions {
  bordered?: boolean;
  size?: "small" | "middle" | "large";
  scrollX?: number | string;
  scrollY?: number | string;
  sticky?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRowKeys: React.Key[]) => void;
  bodyCellPadding?: string;
}

export interface AppTablePagination {
  pageSize?: number;
  showTotal?: (total: number, range: [number, number]) => string;
  current?: number;
  total?: number;
  onChange?: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export interface AppTableProps<T extends object> extends Omit<
  TableProps<T>,
  "dataSource" | "columns" | "pagination"
> {
  data: T[];
  columns: TableColumnsType<T>;
  loading?: boolean;
  pagination?: AppTablePagination | false;
  rowKey?: string | ((record: T) => string);
  options?: AppTableOptions;
  scrollRef?: React.RefObject<HTMLElement | null>;
}
