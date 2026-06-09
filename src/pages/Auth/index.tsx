import { Button, Form, Dropdown } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { AppFormItem, AppInput, AppInputPassword, notifyError } from "@/components/shared";
import { zodValidator } from "@/components/shared/Form";
import { getLoginSchemas } from "@/schemas";
import { LockKeyhole, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import i18nInstance from "@/i18n/i18n";
import { LANGUAGE_STORAGE_KEY } from "@/constants/const";
import { routes } from "@/routes/paths";
import type { LoginForm } from "@/types";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(Namespace.Auth);
  const [form] = Form.useForm<LoginForm>();
  const loginSchemas = useMemo(
    () => getLoginSchemas(t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language],
  );

  useEffect(() => {
    const fieldsWithErrors = form
      .getFieldsError()
      .filter((f) => f.errors.length > 0)
      .map((f) => f.name);
    if (fieldsWithErrors.length === 0) return;

    form.validateFields(fieldsWithErrors).catch(() => {});
  }, [i18n.language, form]);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // TODO: replace with your real API call, e.g. await authApi.login({ account, password })
      await new Promise((r) => setTimeout(r, 600));
      setAuth("mock-token", {
        id: 1,
        account: values.account,
        email: `${values.account}@example.com`,
        role: "Admin",
      });
      navigate(`/${routes.DASHBOARD}`, { replace: true });
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  const languageItems = [
    {
      key: "en",
      label: (
        <span className="flex justify-between items-center w-full p-2">
          English {i18n.language === "en" && "✓"}
        </span>
      ),
    },
    {
      key: "zh",
      label: (
        <span className="flex justify-between items-center w-full p-2">
          中文 {i18n.language === "zh" && "✓"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-muted/50 p-4 ">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <Dropdown
          menu={{
            items: languageItems,
            onClick: ({ key }) => {
              i18nInstance.changeLanguage(key);
              localStorage.setItem(LANGUAGE_STORAGE_KEY, key);
            },
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button
            type="text"
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors px-2"
          >
            <Globe size={18} />
            <span className="font-medium">{t("langName")}</span>
          </Button>
        </Dropdown>
      </div>
      <div className="relative w-full max-w-105 bg-surface rounded-2xl shadow-xl shadow-primary/5 border border-border-primary p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary text-surface rounded-xl flex items-center justify-center mb-5 shadow-sm">
            <LockKeyhole size={24} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold text-primary tracking-tight m-0 mb-1.5">
            {t("auth.welcome")}
          </h1>
          <p className="text-sm text-secondary m-0">{t("auth.subtitle")}</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          requiredMark={false}
          className="flex flex-col"
        >
          <AppFormItem
            label={<span className="text-sm font-medium text-primary">{t("auth.account")}</span>}
            name="account"
            rules={[zodValidator(loginSchemas.account)]}
            className="mb-4"
          >
            <AppInput
              placeholder={t("auth.accountPlaceholder")}
              size="large"
              className="rounded-lg border-border-primary hover:border-primary focus:border-primary"
            />
          </AppFormItem>

          <AppFormItem
            label={<span className="text-sm font-medium text-primary">{t("auth.password")}</span>}
            name="password"
            rules={[zodValidator(loginSchemas.password)]}
            className="mb-6"
          >
            <AppInputPassword
              placeholder={t("auth.passwordPlaceholder")}
              size="large"
              className="rounded-lg border-border-primary hover:border-primary focus:border-primary"
            />
          </AppFormItem>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            className="h-12 bg-primary text-surface font-medium text-base rounded-lg shadow-none hover:bg-muted border-none transition-colors"
          >
            {t("auth.signIn")}
          </Button>
        </Form>
        <p className="mt-6 text-center text-xs text-gray-400">
          {t("auth.platformName")} <span className="text-gray-400">v{__APP_VERSION__}</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
