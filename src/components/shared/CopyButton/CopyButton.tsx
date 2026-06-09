import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  title?: string;
  size?: number;
  className?: string;
}

export const CopyButton = ({ text, title, size = 15, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      className={`relative text-[#4A5565] hover:text-primary transition-colors cursor-pointer ${className ?? ""}`}
      onClick={handleCopy}
      title={title}
    >
      <span
        className="block transition-all duration-300"
        style={{
          opacity: copied ? 0 : 1,
          transform: copied ? "scale(0.5) rotate(-90deg)" : "scale(1) rotate(0deg)",
        }}
      >
        <Copy size={size} />
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-green-500 transition-all duration-300"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
        }}
      >
        <Check size={size} />
      </span>
    </button>
  );
};
