import { useEffect, type RefObject } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  containerRef: RefObject<HTMLElement | null>;
}

export function ScrollToTop({ containerRef }: ScrollToTopProps) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (new URLSearchParams(search).has("search")) return;
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search, containerRef]);

  return null;
}
