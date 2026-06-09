import type React from "react";
import { useOverflow } from "@/hooks";

interface AppScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string;
  scrollbarClassName?: string;
}

export const AppScrollArea: React.FC<AppScrollAreaProps> = ({
  children,
  className = "",
  maxHeight,
  scrollbarClassName = "right-0",
  ...rest
}) => {
  const { viewportRef, contentRef, scrollbarRef, thumbRef } = useOverflow();

  return (
    <div className={`relative h-full w-full ${className}`} {...rest}>
      <div
        ref={viewportRef}
        className={`scrollbar-hidden relative h-full overflow-y-auto overflow-x-hidden ${maxHeight ?? ""}`}
      >
        <div ref={contentRef} className="h-full w-full">
          {children}
        </div>
      </div>

      <div
        ref={scrollbarRef}
        className={`pointer-events-auto absolute bottom-0 top-0 z-10 w-2 select-none opacity-0 transition-opacity duration-200 [&.visible]:opacity-100 ${scrollbarClassName}`}
      >
        <div ref={thumbRef} className="absolute left-0 top-0 w-full">
          <div className="absolute bottom-1 left-0.5 top-1 w-1 rounded-full bg-[#8a8f9794]" />
        </div>
      </div>
    </div>
  );
};
