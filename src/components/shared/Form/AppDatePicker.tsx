import { DatePicker } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";

export function AppDatePicker(props: DatePickerProps) {
  return <DatePicker style={{ width: "100%" }} {...props} />;
}

export function AppRangePicker(props: RangePickerProps) {
  return <DatePicker.RangePicker style={{ width: "100%" }} {...props} />;
}
