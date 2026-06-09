import { useEffect, useMemo, useState } from "react";
import { Drawer, Form } from "antd";
import { AppButton, notifySuccess } from "@/components/shared";
import { X } from "lucide-react";
import {
  AppFormItem,
  AppInput,
  AppTextArea,
  AppCheckbox,
  zodValidator,
} from "@/components/shared/Form";
import type { PermissionKeysRecord, RoleDrawerProps, RoleFormValues } from "@/types";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { roleDrawerSchemas } from "@/schemas";
import { useAdmin } from "@/hooks";
import type { ApiPermission } from "@/api";
import { apiModuleSortIndex } from "@/constants/permissions";

interface PermissionModule {
  module: string;
  label: string;
  permissions: ApiPermission[];
}

/** Group flat permissions into modules, sorted by displayOrder. */
function groupByModule(permissions: ApiPermission[]): PermissionModule[] {
  const map = new Map<string, ApiPermission[]>();
  for (const p of permissions) {
    const list = map.get(p.module) ?? [];
    list.push(p);
    map.set(p.module, list);
  }

  return [...map.entries()]
    .map(([module, perms]) => ({
      module,
      label: module.charAt(0).toUpperCase() + module.slice(1),
      permissions: perms.sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .sort((a, b) => apiModuleSortIndex(a.module) - apiModuleSortIndex(b.module));
}

/** Build a default record with all permission keys set to false. */
function buildDefaults(permissions: ApiPermission[]): PermissionKeysRecord {
  return Object.fromEntries(permissions.map((p) => [p.key, false]));
}

/** Convert the role's assigned permissions to a checked record. */
function roleToRecord(rolePerms: ApiPermission[], allPerms: ApiPermission[]): PermissionKeysRecord {
  const record = buildDefaults(allPerms);
  for (const p of rolePerms) {
    if (p.key in record) record[p.key] = true;
  }
  return record;
}

/** Convert the checked record to the API payload shape. */
function recordToPayload(record: PermissionKeysRecord) {
  const byModule = new Map<string, string[]>();

  for (const [key, checked] of Object.entries(record)) {
    if (!checked) continue;
    const parts = key.split(".");
    const module = parts[0] ?? key;
    const list = byModule.get(module) ?? [];
    list.push(key);
    byModule.set(module, list);
  }

  return [...byModule.entries()].map(([module, permissions]) => ({
    module,
    permissions,
  }));
}

/** Human-readable label for a permission action (the part after the dot). */
function useActionLabel() {
  const { t } = useTranslation(Namespace.Admin);
  return (key: string): string => {
    const action = key.split(".").pop() ?? key;
    return t(`roleDrawer.actions.${action}`, action.charAt(0).toUpperCase() + action.slice(1));
  };
}

export function RoleDrawer({ open, editingRole, onClose, onSubmit }: RoleDrawerProps) {
  const [form] = Form.useForm<RoleFormValues>();
  const isEdit = !!editingRole;
  const { t } = useTranslation([Namespace.Admin, Namespace.Common]);
  const actionLabel = useActionLabel();

  const schemas = roleDrawerSchemas({
    nameRequired: t("roleDrawer.fields.name.required"),
    descriptionRequired: t("roleDrawer.fields.description.required"),
  });

  const roleId = editingRole ? Number(editingRole.id) : 0;
  const {
    permissions: allPermissions = [],
    rolePermissions,
    createRole,
    updateRole,
    updateRolePermissions: updatePermissions,
  } = useAdmin({
    roleId,
    rolesEnabled: false,
    summaryEnabled: false,
    permissionsEnabled: true,
  });

  const modules = useMemo(() => groupByModule(allPermissions), [allPermissions]);

  const defaults = useMemo(() => buildDefaults(allPermissions), [allPermissions]);

  useEffect(() => {
    if (!open) return;
    if (editingRole) {
      form.setFieldsValue({
        name: editingRole.displayName,
        description: editingRole.description,
        permissions: rolePermissions ? roleToRecord(rolePermissions, allPermissions) : defaults,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ permissions: defaults });
    }
  }, [open, editingRole, form, defaults, rolePermissions, allPermissions]);

  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: RoleFormValues) => {
    setSubmitting(true);
    try {
      const permRecord = values.permissions ?? {};

      if (editingRole) {
        const nameOrDescriptionChanged =
          values.name !== editingRole.displayName || values.description !== editingRole.description;
        if (nameOrDescriptionChanged) {
          await updateRole.mutateAsync({
            id: Number(editingRole.id),
            payload: { name: values.name, description: values.description },
          });
        }
        await updatePermissions.mutateAsync({
          roleId: Number(editingRole.id),
          payload: { permissions: recordToPayload(permRecord) },
        });
      } else {
        await createRole.mutateAsync({
          name: values.name,
          description: values.description,
          permissions: recordToPayload(permRecord),
        });
      }

      await onSubmit({
        id: editingRole?.id,
        name: editingRole?.name ?? values.name,
        displayName: values.name,
        description: values.description,
        memberCount: editingRole?.memberCount ?? 0,
      });
      notifySuccess(
        editingRole
          ? t("messages.roleUpdated", "Role updated successfully")
          : t("messages.roleCreated", "Role created successfully"),
      );
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} closeIcon={false} onClose={onClose}>
      <div className="flex justify-between border-b border-gray-200 p-5 items-center font-semibold text-[20px]">
        <span>{isEdit ? t("roleDrawer.title.edit") : t("roleDrawer.title.create")}</span>
        <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
          <X size={20} className="cursor-pointer" />
        </button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="py-5 px-6"
        onValuesChange={(changed) => {
          const perms = changed?.permissions;
          if (!perms) return;
          for (const [key, checked] of Object.entries(perms)) {
            const module = key.split(".")[0];

            if (key.endsWith(".view") && !checked) {
              // Unchecking view → uncheck all other permissions in the same module
              const allPerms = form.getFieldValue("permissions") ?? {};
              for (const k of Object.keys(allPerms)) {
                if (k.startsWith(`${module}.`) && k !== key) {
                  form.setFieldValue(["permissions", k], false);
                }
              }
            } else if (!key.endsWith(".view") && checked) {
              // Checking any non-view → auto-check view
              const viewKey = `${module}.view`;
              if (!form.getFieldValue(["permissions", viewKey])) {
                form.setFieldValue(["permissions", viewKey], true);
              }
            }
          }
        }}
      >
        <AppFormItem
          label={t("roleDrawer.fields.name.label")}
          name="name"
          required
          rules={[zodValidator(schemas.name)]}
        >
          <AppInput placeholder={t("roleDrawer.fields.name.placeholder")} />
        </AppFormItem>

        <AppFormItem
          label={t("roleDrawer.fields.description.label")}
          name="description"
          required
          rules={[zodValidator(schemas.description)]}
        >
          <AppTextArea placeholder={t("roleDrawer.fields.description.placeholder")} />
        </AppFormItem>

        <div className="mb-4">
          <p className="text-body font-medium text-gray-700 mb-3">
            {t("roleDrawer.permissionSettings")}
          </p>
          <div className="flex flex-col gap-2">
            {modules.map((mod) => (
              <div key={mod.module} className="border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-[13px] font-medium text-gray-800 mb-2">
                  {t(`roleDrawer.modules.${mod.module}`, mod.label)}
                </p>
                <div className="flex items-center gap-x-6 gap-y-3 flex-wrap">
                  {mod.permissions.map((perm) => (
                    <Form.Item
                      key={perm.key}
                      name={["permissions", perm.key]}
                      valuePropName="checked"
                      className="mb-0!"
                      noStyle
                    >
                      <AppCheckbox>
                        <span className="text-[13px] text-gray-600">{actionLabel(perm.key)}</span>
                      </AppCheckbox>
                    </Form.Item>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-3 pt-5 border-t border-gray-200">
          <AppButton variant="secondary" className="flex-1" onClick={onClose}>
            {t("common:actions.cancel")}
          </AppButton>
          <AppButton
            className="flex-1"
            onClick={() => form.submit()}
            disabled={submitting}
            loading={submitting}
          >
            {isEdit ? t("common:actions.save") : t("roleDrawer.title.create")}
          </AppButton>
        </div>
      </Form>
    </Drawer>
  );
}
