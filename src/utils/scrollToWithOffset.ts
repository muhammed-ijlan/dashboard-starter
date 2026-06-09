export function scrollToWithOffset(
  el: HTMLElement,
  offset = 150,
  behavior: ScrollBehavior = "smooth",
): void {
  let scroller: HTMLElement | null = el.parentElement;
  while (scroller) {
    const overflowY = window.getComputedStyle(scroller).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") break;
    scroller = scroller.parentElement;
  }

  const elTop = el.getBoundingClientRect().top;
  if (scroller) {
    const top = scroller.scrollTop + elTop - scroller.getBoundingClientRect().top - offset;
    scroller.scrollTo({ top, behavior });
  } else {
    window.scrollTo({ top: elTop + window.scrollY - offset, behavior });
  }
}
