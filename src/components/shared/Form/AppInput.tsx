import { Input, type InputRef } from "antd";
import type { InputProps, PasswordProps, TextAreaProps } from "antd/es/input";

const baseClass =
  "w-full text-sm text-gray-700 bg-white border border-secondary rounded-[10px] outline-none transition-all placeholder-gray-400 ";

export function AppInput({ ref, className, ...props }: InputProps & { ref?: React.Ref<InputRef> }) {
  return (
    <Input
      ref={ref}
      allowClear
      className={`${baseClass} py-2.5 px-4 ${className ?? ""}`}
      {...props}
    />
  );
}

export function AppInputPassword({ className, ...props }: PasswordProps) {
  return <Input.Password className={`${baseClass} px-4 py-2.5 ${className ?? ""}`} {...props} />;
}

export function AppTextArea({ className, ...props }: TextAreaProps) {
  return (
    <Input.TextArea
      allowClear
      autoSize={{ minRows: 3 }}
      className={`${baseClass} py-2.5 px-4 ${className ?? ""}`}
      classNames={{ textarea: "p-0" }}
      {...props}
    />
  );
}
