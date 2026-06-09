import { Suspense, useCallback, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Header, Sidebar } from "@/components/layout";
import { ScrollToTop } from "@/components/shared";
import { ErrorDisplay, LoadingSpinner } from "@/components/ui";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const openMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] font-sans">
      <Sidebar visible={isMobileMenuOpen} onClose={closeMobileMenu} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onOpenMenu={openMobileMenu} />
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{ scrollbarGutter: "stable" }}
        >
          <ScrollToTop containerRef={mainRef} />
          <ErrorBoundary FallbackComponent={ErrorDisplay} resetKeys={[location.pathname]}>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
