import { useEffect, useMemo, useState } from "react";
import { Modal, Form } from "antd";
import { AppButton, PasswordStrengthBar, validatePasswordStrength } from "@/components/shared";
import {
  AppFormItem,
  AppInput,
  AppInputPassword,
  AppSelect,
  zodValidator,
} from "@/components/shared/Form";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { adminModalSchemas } from "@/schemas";
import type { AdminFormValues, AdminModalProps } from "@/types";
import { useAdmin } from "@/hooks";

export function AdminModal({ open, editingEntry, onClose, onSubmit }: AdminModalProps) {
  const [form] = Form.useForm<AdminFormValues>();
  const isEdit = !!editingEntry;
  const isEditingSuperAdmin =
    isEdit && (editingEntry?.role ?? "").trim().toLowerCase() === "super admin";
  const { t } = useTranslation([Namespace.Admin, Namespace.Common]);

  const schemas = adminModalSchemas({
    accountRequired: t("modal.fields.account.required"),
    nameRequired: t("modal.fields.name.required"),
    emailRequired: t("modal.fields.email.required"),
    emailInvalid: t("modal.fields.email.invalid"),
    roleRequired: t("modal.fields.role.required"),
    passwordRequired: t("modal.fields.password.required"),
    confirmRequired: t("modal.fields.confirm.required"),
  });

  const { roles = [] } = useAdmin({ summaryEnabled: false });

  const roleOptions = useMemo(
    () =>
      roles
        .filter((r) => isEditingSuperAdmin || r.displayName.toLowerCase() !== "super admin")
        .map((r) => ({ label: r.displayName, value: r.name })),
    [roles, isEditingSuperAdmin],
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setPasswordValue("");
      return;
    }
    form.resetFields();
    setPasswordValue("");
    if (editingEntry) {
      const matched = roles.find(
        (r) => r.name === editingEntry.role || r.displayName === editingEntry.role,
      );
      form.setFieldsValue({
        account: editingEntry.account,
        name: editingEntry.name,
        email: editingEntry.email,
        role: matched?.name ?? editingEntry.role,
      });
    }
  }, [open, editingEntry, form, roles]);

  const [submitting, setSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const handleFinish = async (values: AdminFormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(
        {
          id: editingEntry?.id,
          account: values.account,
          name: values.name,
          email: values.email,
          role: values.role,
          state: editingEntry?.state ?? "Normal",
          google2FA: editingEntry?.google2FA ?? "Unbound",
          createdAt:
            editingEntry?.createdAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
          lastLogin: editingEntry?.lastLogin ?? "-",
          createdBy: editingEntry?.createdBy ?? "Admin",
        },
        values.password,
        values.confirm,
      );
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closeIcon={false}
      centered
      footer={null}
      width={480}
      destroyOnHidden
    >
      <div className="flex justify-between border-b border-gray-200 px-5 py-3 items-center font-semibold text-[17px]">
        <span>{isEdit ? t("modal.title.edit") : t("modal.title.add")}</span>
        <AppButton variant="secondary" className="border-none" onClick={onClose}>
          <X className="cursor-pointer" />
        </AppButton>
      </div>
      <div className="px-5 pt-3 pb-5">
        <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-2">
          <AppFormItem
            label={t("modal.fields.account.label")}
            name="account"
            required
            rules={[zodValidator(schemas.account)]}
          >
            <AppInput placeholder={t("modal.fields.account.placeholder")} />
          </AppFormItem>

          <AppFormItem
            label={t("modal.fields.name.label")}
            name="name"
            required
            rules={[zodValidator(schemas.name)]}
          >
            <AppInput placeholder={t("modal.fields.name.placeholder")} />
          </AppFormItem>

          <AppFormItem
            label={t("modal.fields.email.label")}
            name="email"
            required
            rules={[zodValidator(schemas.email)]}
          >
            <AppInput placeholder={t("modal.fields.email.placeholder")} />
          </AppFormItem>

          <AppFormItem
            label={t("modal.fields.role.label")}
            name="role"
            required
            rules={[zodValidator(schemas.role)]}
          >
            <AppSelect
              options={roleOptions}
              allowClear={false}
              showSearch={false}
              disabled={isEditingSuperAdmin}
            />
          </AppFormItem>

          {!isEdit && (
            <>
              <AppFormItem
                label={t("modal.fields.password.label")}
                name="password"
                required
                rules={[
                  zodValidator(schemas.password),
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
                  placeholder={t("modal.fields.password.placeholder")}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
              </AppFormItem>
              <PasswordStrengthBar password={passwordValue} />

              <AppFormItem
                label={t("modal.fields.confirm.label")}
                name="confirm"
                required
                dependencies={["password"]}
                rules={[
                  zodValidator(schemas.confirm),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("modal.fields.confirm.mismatch")));
                    },
                  }),
                ]}
              >
                <AppInputPassword placeholder={t("modal.fields.confirm.placeholder")} />
              </AppFormItem>
            </>
          )}

          <div className="flex gap-3 pt-2 border-gray-200 mt-1">
            <AppButton variant="secondary" className="flex-1" onClick={onClose}>
              {t("common:actions.cancel")}
            </AppButton>
            <AppButton
              className="flex-1"
              onClick={() => form.submit()}
              disabled={submitting}
              loading={submitting}
            >
              {isEdit ? t("common:actions.save") : t("modal.actions.confirmAdd")}
            </AppButton>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
