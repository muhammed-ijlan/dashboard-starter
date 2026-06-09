import { Select } from "antd";
import type { SelectProps } from "antd";

export interface AppSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface AppSelectProps extends Omit<SelectProps, "options"> {
  options: AppSelectOption[];
}

export function AppSelect({ options, className, popupClassName, ...props }: AppSelectProps) {
  return (
    <Select
      showSearch
      allowClear
      optionFilterProp="label"
      options={options}
      className={`w-full px-4 py-2.5 border border-secondary rounded-[10px] ${className ?? ""}`}
      popupClassName={`[&_.ant-select-item]:!px-3 ${popupClassName ?? ""} `}
      {...props}
    />
  );
}
