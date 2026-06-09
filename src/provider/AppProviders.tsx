import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { theme } from "@/theme";
import { ErrorDisplay, LoadingSpinner } from "@/components/ui";
import { notifyError } from "@/components/shared";
import { ApiError } from "@/api/types";
import { queryKeys } from "@/api";

function isForbidden(error: unknown): boolean {
  return error instanceof ApiError && (error.statusCode === 403 || error.code === 403);
}

const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      notifyError(error);
      if (isForbidden(error)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.permissions() });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      notifyError(error);
      if (isForbidden(error)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.permissions() });
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

type Props = {
  children: ReactNode;
};

export const AppProviders = ({ children }: Props) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
      <Suspense fallback={<LoadingSpinner />}>
        <QueryClientProvider client={queryClient}>
          <StyleProvider layer>
            <ConfigProvider
              theme={theme}
              modal={{ styles: { body: { padding: 0 }, container: { padding: 0 } } }}
              drawer={{ styles: { body: { padding: 0 }, content: { padding: 0 } } }}
              form={{
                requiredMark: (label, { required }) => (
                  <>
                    {label}
                    {required && <span style={{ color: "#FB2C36", marginLeft: 4 }}>*</span>}
                  </>
                ),
              }}
            >
              {children}
            </ConfigProvider>
          </StyleProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
