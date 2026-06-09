import React, { useState, useMemo, useEffect } from "react";
import { Form, Divider } from "antd";
import { useAuthStore } from "@/store";
import { authApi } from "@/api";
import {
  PageHeader,
  AppFormItem,
  AppInputPassword,
  AppCardLayout,
  AppButton,
  PasswordStrengthBar,
  validatePasswordStrength,
  notifySuccess,
  notifyError,
} from "@/components/shared";
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  Check,
  X,
  Activity,
  Fingerprint,
} from "lucide-react";
import { SecuritySettingsCard } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useAdmin, usePermissions } from "@/hooks";
import { toPageModule, PAGE_MODULES } from "@/constants/permissions";
import type { PasswordChangeForm, ModulePermissionDisplay } from "@/types";

const AdminProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [passwordForm] = Form.useForm();
  const { t, i18n } = useTranslation(Namespace.Profile);

  useEffect(() => {
    const fieldsWithErrors = passwordForm
      .getFieldsError()
      .filter((f) => f.errors.length > 0)
      .map((f) => f.name);
    if (fieldsWithErrors.length === 0) return;
    passwordForm.validateFields(fieldsWithErrors).catch(() => {});
  }, [i18n.language, passwordForm]);

  const user = useAuthStore((s) => s.user);
  const { permissionKeys } = usePermissions();
  const userKeys = useMemo(() => new Set(permissionKeys), [permissionKeys]);

  const translatedRole = useMemo(() => {
    const role = user?.role;
    if (!role) return "";
    const titleCased = role.replace(/\b\w/g, (c) => c.toUpperCase());
    return t(`permissions.roles.${titleCased}`, {
      defaultValue: t(`permissions.roles.${role}`, role),
    });
  }, [user?.role, t]);

  const { permissions: allPermissions = [] } = useAdmin({
    rolesEnabled: false,
    summaryEnabled: false,
    permissionsEnabled: true,
  });

  const modulePermissions = useMemo<ModulePermissionDisplay[]>(() => {
    const grouped = new Map<
      string,
      {
        name: string;
        actions: { key: string; name: string; granted: boolean }[];
      }
    >();

    const isZh = i18n.language?.startsWith("zh");

    for (const perm of allPermissions) {
      const pageKey = toPageModule(perm.module);
      if (!pageKey) continue;

      if (!grouped.has(pageKey)) {
        const label = PAGE_MODULES.find((m) => m.key === pageKey)?.label ?? pageKey;
        grouped.set(pageKey, { name: label, actions: [] });
      }
      const localizedName = isZh ? (perm.nameZh ?? perm.name) : (perm.nameEn ?? perm.name);
      grouped.get(pageKey)!.actions.push({
        key: perm.key,
        name: localizedName,
        granted: userKeys.has(perm.key),
      });
    }

    return PAGE_MODULES.filter((m) => grouped.has(m.key)).map((m) => {
      const { name, actions } = grouped.get(m.key)!;
      return { module: m.key, label: name, actions };
    });
  }, [allPermissions, userKeys, i18n.language]);

  const handlePasswordChange = async (values: PasswordChangeForm) => {
    setLoading(true);
    try {
      const result = await authApi.changePassword(values);
      if (result.token) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth(result.token, currentUser);
        }
      }
      notifySuccess(t("securitySettings.passwordUpdated"));
      passwordForm.resetFields();
      setNewPasswordValue("");
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full font-sans">
      <PageHeader title={t("header.title")} description={t("header.description")} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-1 xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface card overflow-hidden flex flex-col h-full">
            <div className="h-28 bg-linear-to-r from-[#6C5DD3] to-[#988DF0] relative">
              <div
                className="absolute inset-0 bg-white/10 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              ></div>
            </div>

            <div className="px-6 pb-6 flex-1 flex flex-col relative -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-surface p-1 shadow-md mb-3 border border-border-primary relative z-10">
                <div className="w-full h-full rounded-xl bg-[#6C5DD3] text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                  {user?.account?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm"></div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-primary m-0 tracking-tight flex items-center gap-2">
                  {user?.account}
                </h2>
                <p className="text-sm text-secondary mt-0.5 mb-4 capitalize">{translatedRole}</p>

                <div className="flex flex-wrap gap-2">
                  <div className="capitalize inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                    <ShieldCheck size={14} className="text-indigo-500" />
                    {translatedRole}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-semibold">
                    <Activity size={14} className="text-green-500" />
                    {t("accountActive")}
                  </div>
                </div>
              </div>

              <Divider className="my-0 border-border-primary" />

              <div className="pt-6 space-y-4 flex-1">
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-surface-muted border border-border-primary hover:border-border-secondary transition-colors">
                  <span className="text-secondary flex items-center gap-2.5 text-body font-medium">
                    <div className="p-1.5 rounded-[10px] bg-surface border border-border-primary">
                      <User size={14} className="text-primary" />
                    </div>
                    {t("account")}
                  </span>
                  <span className="font-semibold text-primary text-body">{user?.account}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-surface-muted border border-border-primary hover:border-border-secondary transition-colors">
                  <span className="text-secondary flex items-center gap-2.5 text-body font-medium">
                    <div className="p-1.5 rounded-[10px] bg-surface border border-border-primary">
                      <Mail size={14} className="text-primary" />
                    </div>
                    {t("emailAddress")}
                  </span>
                  <span className="font-semibold text-primary text-body truncate max-w-35">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:col-span-8 flex flex-col gap-6">
          <AppCardLayout
            className="h-full"
            icon={
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center ">
                <Lock size={22} strokeWidth={2.5} />
              </div>
            }
            title={
              <div className="flex flex-col mt-1">
                <span className="text-[18px] font-semibold leading-7 text-primary">
                  {t("securitySettings.title")}
                </span>
                <span className="text-sm text-secondary font-normal mt-0.5">
                  {t("securitySettings.description")}
                </span>
              </div>
            }
          >
            <div className="pt-4">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
                requiredMark={false}
                className="max-w-md"
              >
                <AppFormItem
                  label={
                    <span className="text-body font-medium text-primary">
                      {t("securitySettings.currentPassword")}
                    </span>
                  }
                  name="currentPassword"
                  rules={[
                    {
                      required: true,
                      message: t("securitySettings.currentPasswordRequired"),
                    },
                  ]}
                >
                  <AppInputPassword
                    placeholder="••••••••"
                    prefix={<KeyRound size={16} className="text-secondary mr-2" />}
                  />
                </AppFormItem>

                <AppFormItem
                  label={
                    <span className="text-body font-medium text-primary">
                      {t("securitySettings.newPassword")}
                    </span>
                  }
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: t("securitySettings.newPasswordRequired"),
                    },
                    {
                      validator(_, value) {
                        if (!value) return Promise.resolve();
                        const err = validatePasswordStrength(value);
                        return err ? Promise.reject(new Error(err)) : Promise.resolve();
                      },
                    },
                  ]}
                >
                  <AppInputPassword
                    placeholder="••••••••"
                    prefix={<Fingerprint size={16} className="text-secondary mr-2" />}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                  />
                </AppFormItem>
                <PasswordStrengthBar password={newPasswordValue} />

                <AppFormItem
                  label={
                    <span className="text-body font-medium text-primary">
                      {t("securitySettings.confirmNewPassword")}
                    </span>
                  }
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: t("securitySettings.confirmPasswordRequired"),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value)
                          return Promise.resolve();
                        return Promise.reject(new Error(t("securitySettings.passwordMismatch")));
                      },
                    }),
                  ]}
                >
                  <AppInputPassword
                    placeholder="••••••••"
                    prefix={<Lock size={16} className="text-secondary mr-2" />}
                  />
                </AppFormItem>

                <AppButton htmlType="submit" loading={loading} className="mt-2">
                  {t("securitySettings.updatePassword")}
                </AppButton>
              </Form>
            </div>
          </AppCardLayout>
        </div>
      </div>

      <SecuritySettingsCard />

      <AppCardLayout
        className="w-full mt-2"
        title={
          <div className="flex flex-col mt-1">
            <span className="text-[18px] font-semibold leading-7 text-primary">
              {t("permissions.title")}
            </span>
            <span className="text-sm text-secondary font-normal mt-0.5">
              {t("permissions.description")}
              <strong className="text-primary"> {translatedRole}</strong> {t("permissions.policy")}
            </span>
          </div>
        }
        action={
          <div className="hidden sm:flex items-center gap-4 text-caption font-medium text-secondary bg-surface-muted px-4 py-2 rounded-[10px] border border-border-primary">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-green-500" /> {t("permissions.granted")}
            </span>
            <span className="flex items-center gap-1.5">
              <X size={14} className="text-red-400" /> {t("permissions.restricted")}
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {modulePermissions.map((mod) => (
            <div
              key={mod.module}
              className="group p-5 rounded-[14px] border border-border-primary bg-surface hover:border-border-secondary transition-all duration-200 flex flex-col"
            >
              <h4 className="text-body font-semibold text-primary mb-4 pb-3 border-b border-border-primary flex items-center justify-between">
                {t(`permissions.modules.${mod.module}`, mod.label)}
                {mod.actions.length > 0 && mod.actions.every((a) => a.granted) && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                    {t("permissions.fullAccess")}
                  </span>
                )}
              </h4>

              <div className="flex flex-col gap-3 mt-1">
                {mod.actions.map((action) => (
                  <div key={action.key} className="flex items-center justify-between text-sm">
                    <span className="text-secondary font-medium">{action.name}</span>
                    {action.granted ? (
                      <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center">
                        <X size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AppCardLayout>
    </div>
  );
};

export default AdminProfile;
