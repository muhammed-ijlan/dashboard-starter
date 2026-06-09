import type { TableColumnsType } from "antd";
import { Pencil, Trash2, ShieldOff, ShieldCheck, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import type { TFunction } from "i18next";
import { CopyButton, TruncatedId, AppTooltip } from "@/components/shared";
import { adminStateConfig, admin2FAConfig, adminRoleColorConfig } from "@/constants/const";
import { GRADIENTS } from "@/constants/gradients";
import { confirmAction, formatDate } from "@/utils";
import type { AdminEntry } from "@/types";

interface BuildAdminColumnsArgs {
  t: TFunction<["admin", "common"], undefined>;
  onEdit: (entry: AdminEntry) => void;
  onDelete: (id: string) => void;
  onToggleState: (id: string) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

export function buildAdminColumns({
  t,
  onEdit,
  onDelete,
  onToggleState,
  canUpdate,
  canDelete,
}: BuildAdminColumnsArgs): TableColumnsType<AdminEntry> {
  return [
    {
      title: t("table.columns.admin"),
      key: "admin",
      width: 240,
      render: (_: unknown, record: AdminEntry) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-body shrink-0"
            style={{ background: GRADIENTS.adminTableAvatar }}
          >
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-[13px]">{record.name}</span>
            <span className="text-gray-400 text-caption">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: t("table.columns.account"),
      dataIndex: "account",
      key: "account",
      width: 160,
      render: (val: string) =>
        val ? (
          <TruncatedId value={val} startChars={12} endChars={6} />
        ) : (
          <span className="text-gray-400 text-[13px]">-</span>
        ),
    },
    {
      title: t("table.columns.role"),
      dataIndex: "role",
      key: "role",
      width: 130,
      render: (role: string) => {
        if (!role) return <span className="text-gray-400 text-[13px]">-</span>;
        const config = adminRoleColorConfig[role] ?? {
          background: "#F3F4F6",
          textColor: "#6B7280",
        };
        const titleCased = role.replace(/\b\w/g, (c) => c.toUpperCase());
        const label = t(`roles.${titleCased}`, { defaultValue: t(`roles.${role}`, role) });
        return (
          <AppTooltip title={label}>
            <span
              className="inline-block max-w-full px-2.5 py-1 rounded-full text-caption font-medium capitalize truncate align-middle"
              style={{ background: config.background, color: config.textColor }}
            >
              {label}
            </span>
          </AppTooltip>
        );
      },
    },
    {
      title: t("table.columns.state"),
      dataIndex: "state",
      key: "state",
      width: 110,
      render: (state: AdminEntry["state"]) => {
        if (!state) return <span className="text-gray-400 text-[13px]">-</span>;
        const config = adminStateConfig[state];
        const isActive = state !== "Disabled";
        return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption font-medium"
            style={{ background: config.background, color: config.textColor }}
          >
            {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
            {t(`state.${state}`, config.label)}
          </span>
        );
      },
    },
    {
      title: t("table.columns.google2FA"),
      dataIndex: "google2FA",
      key: "google2FA",
      width: 120,
      render: (twoFA: AdminEntry["google2FA"]) => {
        if (!twoFA) return <span className="text-gray-400 text-[13px]">-</span>;
        const config = admin2FAConfig[twoFA];
        const isBound = twoFA === "Bound";
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-medium"
            style={{ background: config.background, color: config.textColor }}
          >
            {isBound ? <Lock size={11} /> : <Unlock size={11} />}
            {t(`google2FA.${twoFA}`, config.label)}
          </span>
        );
      },
    },
    {
      title: t("table.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (val: string) => (
        <span className="text-gray-500 text-[13px]">
          {val ? formatDate(val) : <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      title: t("table.columns.lastLogin"),
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 110,
      render: (val: string) => (
        <span className="text-gray-500 text-[13px]">
          {val ? formatDate(val) : <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      title: t("table.columns.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      width: 110,
      render: (val: string) => {
        if (!val) return <span className="text-gray-400 text-[13px]">-</span>;
        const titleCased = val.replace(/\b\w/g, (c) => c.toUpperCase());
        const label = t(`createdByValues.${titleCased}`, {
          defaultValue: t(`createdByValues.${val}`, val),
        });
        return <span className="text-gray-500 text-[13px] capitalize">{label}</span>;
      },
    },
    {
      title: t("table.columns.actions"),
      key: "actions",
      width: 140,
      render: (_: unknown, record: AdminEntry) => (
        <div className="flex items-center gap-2">
          <CopyButton text={record.account} title={t("actions.copyAccount")} />
          {canUpdate && (
            <button
              className="text-gray-600 hover:text-blue-500 transition-colors p-1 cursor-pointer"
              onClick={() => onEdit(record)}
              title={t("actions.edit")}
              aria-label={t("actions.edit")}
            >
              <Pencil size={16} />
            </button>
          )}
          {canDelete && (
            <button
              className="text-red-500 hover:text-red-600 transition-colors p-1 cursor-pointer"
              onClick={() =>
                confirmAction({
                  title: t("actions.deleteTitle"),
                  content: `${t("messages.confirmDelete")} "${record.name}"?`,
                  okText: t("common:actions.delete"),
                  cancelText: t("common:actions.cancel"),
                  onOk: () => onDelete(record.id),
                })
              }
              title={t("common:actions.delete")}
              aria-label={t("common:actions.delete")}
            >
              <Trash2 size={16} />
            </button>
          )}
          {canUpdate && (
            <button
              className={`transition-colors p-1 cursor-pointer ${
                record.state === "Disabled"
                  ? "text-green-500 hover:text-green-600"
                  : "text-red-500 hover:text-red-600"
              }`}
              onClick={() => onToggleState(record.id)}
              title={record.state === "Disabled" ? t("actions.enable") : t("actions.disable")}
              aria-label={record.state === "Disabled" ? t("actions.enable") : t("actions.disable")}
            >
              {record.state === "Disabled" ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
            </button>
          )}
        </div>
      ),
    },
  ];
}
