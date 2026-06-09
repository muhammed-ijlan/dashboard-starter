import type { AppButtonProps } from "@/types";
import { Button } from "antd";

export function AppButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: AppButtonProps) {
  const base =
    "rounded-[10px] px-4 min-h-10 text-[16px] font-medium leading-6 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#155DFC]! text-white! border-none disabled:bg-[#E5E7EB]! disabled:text-[#9CA3AF]!",
    secondary:
      "border border-[#D1D5DC] text-[#0A0A0A] bg-white disabled:bg-[#F3F4F6]! disabled:text-[#9CA3AF]! disabled:border-[#E5E7EB]!",
  };

  return (
    <Button
      type={variant === "primary" ? "primary" : "default"}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
