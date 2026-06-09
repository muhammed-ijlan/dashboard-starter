import { Form } from "antd";
import type { FormItemProps } from "antd";

export function AppFormItem({ children, ...props }: FormItemProps) {
  return (
    <Form.Item
      className="mb-4"
      {...props}
      style={{ ...props.style }}
      label={props.label ? <span className="mb-0.5 inline-block">{props.label}</span> : undefined}
    >
      {children}
    </Form.Item>
  );
}
