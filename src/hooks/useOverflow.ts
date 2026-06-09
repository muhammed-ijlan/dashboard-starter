import { useEffect, useRef } from "react";

export const useOverflow = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;

    if (!viewport || !content || !scrollbar || !thumb) return;

    let isDragging = false;
    let isHovering = false;

    let hideTimer: number | null = null;

    let startY = 0;
    let startScroll = 0;

    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    const clearTimer = () => {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const showBar = () => {
      scrollbar.classList.add("visible");
      clearTimer();
    };

    const hideBarLater = () => {
      clearTimer();

      hideTimer = window.setTimeout(() => {
        if (!isDragging && !isHovering) {
          scrollbar.classList.remove("visible");
        }
      }, 1000);
    };

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;

      document.body.style.userSelect = "";

      scrollbar.classList.remove("dragging");

      hideBarLater();

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopDragging();
    };

    const update = () => {
      const viewH = viewport.clientHeight;
      const contentH = content.scrollHeight;

      const scrollH = contentH - viewH;

      if (scrollH <= 0) {
        scrollbar.style.display = "none";
        thumb.style.transform = "translateY(0)";
        thumb.style.height = "100%";
        return;
      }

      scrollbar.style.display = "block";

      const ratio = viewH / contentH;

      const thumbH = clamp(scrollbar.clientHeight * ratio, 30, scrollbar.clientHeight);

      thumb.style.height = `${thumbH}px`;

      const percent = viewport.scrollTop / scrollH;

      const max = scrollbar.clientHeight - thumbH;

      thumb.style.transform = `translateY(${max * percent}px)`;
    };

    const onScroll = () => {
      update();
      showBar();
      hideBarLater();
    };

    const onThumbDown = (e: MouseEvent) => {
      if (content.scrollHeight <= viewport.clientHeight) return;

      e.preventDefault();

      isDragging = true;

      startY = e.clientY;
      startScroll = viewport.scrollTop;

      showBar();

      document.body.style.userSelect = "none";

      scrollbar.classList.add("dragging");

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging || e.buttons !== 1) {
        stopDragging();
        return;
      }

      const delta = e.clientY - startY;

      const ratio = content.scrollHeight / scrollbar.clientHeight;

      viewport.scrollTop = startScroll + delta * ratio;
    };

    const onUp = () => {
      stopDragging();
    };

    const onEnter = () => {
      isHovering = true;
      showBar();
    };

    const onLeave = () => {
      isHovering = false;

      if (!isDragging) {
        hideBarLater();
      }
    };

    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    ro.observe(content);

    const mo = new MutationObserver(() => {
      requestAnimationFrame(update);
    });

    mo.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("blur", stopDragging);

    document.addEventListener("visibilitychange", onVisibilityChange);

    viewport.addEventListener("scroll", onScroll, {
      passive: true,
    });

    thumb.addEventListener("mousedown", onThumbDown);

    scrollbar.addEventListener("mouseenter", onEnter);
    scrollbar.addEventListener("mouseleave", onLeave);
    scrollbar.addEventListener("mousemove", showBar);

    update();

    return () => {
      stopDragging();
      clearTimer();

      ro.disconnect();
      mo.disconnect();

      window.removeEventListener("blur", stopDragging);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      viewport.removeEventListener("scroll", onScroll);

      thumb.removeEventListener("mousedown", onThumbDown);

      scrollbar.removeEventListener("mouseenter", onEnter);
      scrollbar.removeEventListener("mouseleave", onLeave);
      scrollbar.removeEventListener("mousemove", showBar);
    };
  }, []);

  return {
    viewportRef,
    contentRef,
    scrollbarRef,
    thumbRef,
  };
};
