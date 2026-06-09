import { forwardRef, type ReactNode } from "react";

export interface AppCheckboxProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const AppCheckbox = forwardRef<HTMLInputElement, AppCheckboxProps>(
  ({ checked, onChange, disabled, label, children, className }, ref) => (
    <label
      className={`inline-flex items-center gap-2 select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className ?? ""}`}
    >
      <span className="relative inline-flex items-center justify-center w-4 h-4 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          className="peer appearance-none w-4 h-4 rounded border border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors m-0"
        />
        <svg
          className="pointer-events-none absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
        </svg>
      </span>
      {(label ?? children) && <span>{label ?? children}</span>}
    </label>
  ),
);
AppCheckbox.displayName = "AppCheckbox";
