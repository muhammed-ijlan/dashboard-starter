import { useEffect } from "react";
import { Drawer, Form } from "antd";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";

import { AppButton } from "@/components/shared";
import {
  AppFormItem,
  AppInput,
  AppTextArea,
  AppSelect,
  AppCheckbox,
  zodValidator,
} from "@/components/shared/Form";
import { dappDrawerSchemas } from "@/schemas";
import type { DAppDrawerProps, DAppFormValues } from "@/types";
import type { CreateDappsPayload } from "@/api/dapps";
import { useDappCategories } from "@/hooks";
import { getCategoryDisplayName, matchCategoryByDisplayName } from "./category";

export function DAppDrawer({
  open,
  editingEntry,
  isSubmitting,
  onClose,
  onSubmit,
}: DAppDrawerProps) {
  const [form] = Form.useForm();
  const isEdit = !!editingEntry;
  const { t, i18n } = useTranslation([Namespace.Dapps, Namespace.Common]);

  const { categories: dappCategories } = useDappCategories({ enabled: open });

  const categoryOptions = (() => {
    const all = dappCategories ?? [];
    const active = all.filter((c) => c.isActive);
    const options: { label: string; value: number }[] = active.map((c) => ({
      label: getCategoryDisplayName(c, i18n.language),
      value: c.id,
    }));
    const currentName = editingEntry?.type;
    const matched = currentName
      ? all.find((c) => matchCategoryByDisplayName(c, currentName))
      : undefined;
    if (matched && !options.some((o) => o.value === matched.id)) {
      options.push({ label: getCategoryDisplayName(matched, i18n.language), value: matched.id });
    }
    return options;
  })();

  const schemas = dappDrawerSchemas({
    nameRequired: t("drawer.fields.name.required"),
    categoryRequired: t("drawer.fields.category.required"),
    urlRequired: t("drawer.fields.url.required"),
    urlInvalid: t("drawer.fields.url.invalid"),
    iconInvalid: t("drawer.fields.logo.invalid"),
  });

  useEffect(() => {
    if (!open) return;
    if (editingEntry) {
      const matchedCategory = editingEntry.type
        ? dappCategories?.find((c) => matchCategoryByDisplayName(c, editingEntry.type))
        : undefined;
      form.setFieldsValue({
        name: editingEntry.name,
        icon: editingEntry.icon || editingEntry.logo,
        description: editingEntry.description,
        url: editingEntry.url,
        typeId: matchedCategory?.id,
        isActive: editingEntry.statusKey === "active",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
  }, [open, editingEntry, form, dappCategories]);

  const handleFinish = (values: DAppFormValues) => {
    const payload: CreateDappsPayload & { id?: number } = {
      id: editingEntry?.id,
      name: values.name,
      typeId: values.typeId,
      description: values.description ?? "",
      icon: values.icon ?? "",
      url: values.url,
      status: values.isActive ? "active" : "inactive",
    };

    onSubmit(payload);
  };

  return (
    <Drawer open={open} closeIcon={false} onClose={onClose} styles={{ wrapper: { width: 400 } }}>
      <div className="flex justify-between border-b border-gray-200 p-5 items-center font-semibold text-[20px]">
        <span>{isEdit ? t("drawer.title.edit") : t("drawer.title.add")}</span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          disabled={isSubmitting}
        >
          <X size={18} />
        </button>
      </div>

      <Form className="py-5 px-6" layout="vertical" form={form} onFinish={handleFinish}>
        <AppFormItem
          label={t("drawer.fields.name.label")}
          name="name"
          required
          rules={[zodValidator(schemas.name)]}
        >
          <AppInput placeholder={t("drawer.fields.name.placeholder")} disabled={isSubmitting} />
        </AppFormItem>

        <AppFormItem
          label={t("drawer.fields.logo.label")}
          name="icon"
          rules={[zodValidator(schemas.icon)]}
        >
          <AppInput placeholder={t("drawer.fields.logo.placeholder")} disabled={isSubmitting} />
        </AppFormItem>

        <AppFormItem label={t("drawer.fields.description.label")} name="description">
          <AppTextArea
            placeholder={t("drawer.fields.description.placeholder")}
            disabled={isSubmitting}
            rows={4}
          />
        </AppFormItem>

        <AppFormItem
          label={t("drawer.fields.url.label")}
          name="url"
          required
          rules={[zodValidator(schemas.url)]}
        >
          <AppInput placeholder={t("drawer.fields.url.placeholder")} disabled={isSubmitting} />
        </AppFormItem>

        <AppFormItem
          label={t("drawer.fields.category.label")}
          name="typeId"
          required
          rules={[zodValidator(schemas.typeId)]}
        >
          <AppSelect
            options={categoryOptions}
            placeholder={t("drawer.fields.category.placeholder")}
            allowClear={false}
            disabled={isSubmitting}
          />
        </AppFormItem>

        <AppFormItem name="isActive" valuePropName="checked" noStyle>
          <AppCheckbox disabled={isSubmitting} label={t("status.visible")} />
        </AppFormItem>

        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">
          <AppButton
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("common:actions.cancel")}
          </AppButton>
          <AppButton className="flex-1" loading={isSubmitting} onClick={() => form.submit()}>
            {isEdit ? t("common:actions.save") : t("common:actions.add")}
          </AppButton>
        </div>
      </Form>
    </Drawer>
  );
}
