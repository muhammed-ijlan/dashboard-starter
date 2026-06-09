import { Button, Collapse, Typography } from "antd";
import { AlertTriangle, RotateCcw, Home, Code2 } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

const { Text, Paragraph } = Typography;

export const ErrorDisplay = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation(Namespace.Common);
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : t("error.noStack");

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-6 bg-surface-muted/50">
      <div className="w-full max-w-lg bg-surface border border-border-primary rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5 ring-4 ring-red-50/50">
            <AlertTriangle className="text-red-500 w-6 h-6" strokeWidth={2.2} />
          </div>

          <h2 className="text-primary text-xl font-semibold mb-2 m-0">{t("error.title")}</h2>

          <p className="text-secondary text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            {t("error.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              type="primary"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={resetErrorBoundary}
              size="large"
              className="w-full sm:w-auto shadow-none font-medium"
            >
              {t("error.tryAgain")}
            </Button>

            <Button
              icon={<Home className="w-4 h-4" />}
              onClick={() => {
                window.location.href = "/";
              }}
              size="large"
              className="w-full sm:w-auto text-muted border-border-primary font-medium hover:text-primary hover:bg-surface-muted"
            >
              {t("error.goHome")}
            </Button>
          </div>
        </div>

        <div className="bg-surface-muted border-t border-border-primary px-2 py-1">
          <Collapse
            ghost
            expandIconPosition="end"
            items={[
              {
                key: "1",
                label: (
                  <div className="flex items-center gap-2 text-secondary text-xs font-medium uppercase tracking-wider">
                    <Code2 className="w-4 h-4" />
                    <span>{t("error.technicalDetails")}</span>
                  </div>
                ),
                children: (
                  <div className="bg-surface border border-border-primary rounded-md p-4 text-left overflow-x-auto">
                    <Text type="danger" className="block font-mono text-xs mb-2 font-semibold">
                      {t("error.errorLabel", { message: errorMessage })}
                    </Text>

                    <Paragraph className="font-mono text-[11px] text-secondary whitespace-pre-wrap m-0">
                      {errorStack}
                    </Paragraph>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
