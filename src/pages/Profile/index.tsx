import React, { useState, useEffect } from "react";
import { Form, Divider } from "antd";
import { useAuthStore } from "@/store";
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
import { User, Lock, Mail, ShieldCheck, Activity, KeyRound, Fingerprint } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [passwordForm] = Form.useForm();
  const { t, i18n } = useTranslation(Namespace.Common);

  useEffect(() => {
    const fieldsWithErrors = passwordForm
      .getFieldsError()
      .filter((f) => f.errors.length > 0)
      .map((f) => f.name);
    if (fieldsWithErrors.length === 0) return;
    passwordForm.validateFields(fieldsWithErrors).catch(() => {});
  }, [i18n.language, passwordForm]);

  const user = useAuthStore((s) => s.user);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePasswordChange = async (_values: PasswordChangeForm) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      notifySuccess("Password updated successfully");
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
      <PageHeader
        title={t("sidebar.accountSettings")}
        description="Manage your account and security settings"
      />

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
              />
            </div>

            <div className="px-6 pb-6 flex-1 flex flex-col relative -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-surface p-1 shadow-md mb-3 border border-border-primary relative z-10">
                <div className="w-full h-full rounded-xl bg-[#6C5DD3] text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                  {user?.account?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm" />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-primary m-0 tracking-tight">
                  {user?.account}
                </h2>
                <p className="text-sm text-secondary mt-0.5 mb-4 capitalize">{user?.role}</p>

                <div className="flex flex-wrap gap-2">
                  <div className="capitalize inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                    <ShieldCheck size={14} className="text-indigo-500" />
                    {user?.role}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-semibold">
                    <Activity size={14} className="text-green-500" />
                    Active
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
                    Account
                  </span>
                  <span className="font-semibold text-primary text-body">{user?.account}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-surface-muted border border-border-primary hover:border-border-secondary transition-colors">
                  <span className="text-secondary flex items-center gap-2.5 text-body font-medium">
                    <div className="p-1.5 rounded-[10px] bg-surface border border-border-primary">
                      <Mail size={14} className="text-primary" />
                    </div>
                    Email
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
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <Lock size={22} strokeWidth={2.5} />
              </div>
            }
            title={
              <div className="flex flex-col mt-1">
                <span className="text-[18px] font-semibold leading-7 text-primary">
                  Security Settings
                </span>
                <span className="text-sm text-secondary font-normal mt-0.5">
                  Update your password to keep your account secure
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
                    <span className="text-body font-medium text-primary">Current Password</span>
                  }
                  name="currentPassword"
                  rules={[{ required: true, message: "Current password is required" }]}
                >
                  <AppInputPassword
                    placeholder="••••••••"
                    prefix={<KeyRound size={16} className="text-secondary mr-2" />}
                  />
                </AppFormItem>

                <AppFormItem
                  label={<span className="text-body font-medium text-primary">New Password</span>}
                  name="newPassword"
                  rules={[
                    { required: true, message: "New password is required" },
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
                    <span className="text-body font-medium text-primary">Confirm New Password</span>
                  }
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Please confirm your new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value)
                          return Promise.resolve();
                        return Promise.reject(new Error("Passwords do not match"));
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
                  Update Password
                </AppButton>
              </Form>
            </div>
          </AppCardLayout>
        </div>
      </div>
    </div>
  );
};

export default Profile;
