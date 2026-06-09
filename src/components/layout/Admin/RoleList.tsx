import { useMemo } from "react";
import { AppButton, AppCardLayout } from "@/components/shared";
import { Shield, Users, Settings, Trash2 } from "lucide-react";
import { adminRoleColorConfig } from "@/constants/const";
import type { AdminRole, RoleCardProps } from "@/types";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useAdmin } from "@/hooks";
import { confirmAction } from "@/utils";
import { RoleCardSkeleton } from "./RoleCardSkeleton";

function RoleCard({ role, readOnly, onEdit, onDelete }: RoleCardProps) {
  const { t } = useTranslation([Namespace.Admin, Namespace.Common]);

  const { rolePermissions } = useAdmin({
    roleId: Number(role.id),
    rolesEnabled: false,
    summaryEnabled: false,
  });

  const permissionScopes = useMemo(() => {
    if (!rolePermissions?.length) return role.permissionScopes ?? [];
    // Dedupe by module, preserving first-seen order, and use the API's
    // moduleLabel (e.g. "Roles", "Alerts") as the pill text.
    const seen = new Set<string>();
    const scopes: string[] = [];
    for (const p of rolePermissions) {
      if (seen.has(p.module)) continue;
      seen.add(p.module);
      scopes.push(p.moduleLabel ?? p.module);
    }
    return scopes;
  }, [rolePermissions, role.permissionScopes]);

  const color = adminRoleColorConfig[role.displayName] ?? {
    background: "#F3F4F6",
    textColor: "#6B7280",
  };

  return (
    <AppCardLayout className="py-6" contentClassName="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: color.background }}
          >
            <Shield size={24} style={{ color: color.textColor }} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-primary text-[18px] leading-6.75">
              {role.displayName || t("roles.Super Admin")}
            </p>
            <div className="flex items-center gap-1 text-secondary text-body font-normal ">
              <Users size={12} />
              <span>{t("roleCard.members", { count: role.memberCount })}</span>
            </div>
          </div>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1">
            <button
              className="text-muted hover:text-gray-600 transition-colors p-1"
              onClick={() => onEdit(role)}
              aria-label={t("common:actions.edit")}
            >
              <Settings size={16} className="cursor-pointer" />
            </button>
            {onDelete && (
              <button
                className="text-muted hover:text-red-500 transition-colors p-1"
                onClick={() =>
                  confirmAction({
                    title: t("common:actions.confirm"),
                    content: `${t("actions.deleteRole")} "${role.displayName}"?`,
                    okText: t("common:actions.confirm"),
                    cancelText: t("common:actions.cancel"),
                    onOk: () => onDelete(role),
                  })
                }
                aria-label={t("common:actions.delete")}
              >
                <Trash2 size={16} className="cursor-pointer" />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-body text-muted  font-normal line-clamp-2">{role.description}</p>

      <div className="divider" />

      <div className="flex flex-col gap-2">
        <p className="text-secondary text-caption font-normal  tracking-wide">
          {t("roleCard.permissionScope")}
        </p>
        <div className="flex flex-wrap gap-1.5 max-w-[50%]">
          {permissionScopes.map((scope) => (
            <span
              key={scope}
              className="px-2 py-0.5 rounded-sm  bg-surface-muted text-[#364153] text-caption font-normal"
            >
              {t(`scopes.${scope}`, scope)}
            </span>
          ))}
        </div>
      </div>
    </AppCardLayout>
  );
}

interface RoleListProps {
  roles: AdminRole[];
  loading?: boolean;
  readOnly?: boolean;
  onEdit: (role: AdminRole) => void;
  onCreate: () => void;
  onDelete?: (role: AdminRole) => void;
}

export const RoleList = ({
  roles,
  loading,
  readOnly,
  onEdit,
  onCreate,
  onDelete,
}: RoleListProps) => {
  const { t } = useTranslation(Namespace.Admin);
  return (
    <div className="flex flex-col gap-4">
      {!readOnly && (
        <div className="flex justify-end">
          <AppButton onClick={onCreate}>
            <Shield className="w-4 h-4" />
            {t("actions.createRole")}
          </AppButton>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 ">
        {loading && roles.length === 0
          ? Array.from({ length: 3 }).map((_, i) => <RoleCardSkeleton key={i} />)
          : roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                readOnly={readOnly || role.displayName.toLowerCase() === "super admin"}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
      </div>
    </div>
  );
};
