import type { DraftEntry } from "./common";
import type { ModulePermission, PermissionKeysRecord } from "./auth";

export type AdminState = "Normal" | "Disabled";
export type AdminStatus = "active" | "disabled";
export type Admin2FA = "Bound" | "Unbound";

export interface AdminEntry {
  id: string;
  name: string;
  account: string;
  email: string;
  role: string;
  state: AdminState;
  google2FA: Admin2FA;
  createdAt: string;
  lastLogin: string;
  createdBy: string;
}

export interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  memberCount: number;
  permissionScopes?: string[];
  permissions?: ModulePermission[];
}

export type AdminFormValues = {
  account: string;
  name: string;
  email: string;
  role: string;
  password: string;
  confirm: string;
};

export interface AdminModalProps {
  open: boolean;
  editingEntry: AdminEntry | null;
  onClose: () => void;
  onSubmit: (
    entry: DraftEntry<AdminEntry>,
    password?: string,
    confirmPassword?: string,
  ) => Promise<void>;
}

export type RoleFormValues = {
  name: string;
  description: string;
  permissions: PermissionKeysRecord;
};

export interface RoleDrawerProps {
  open: boolean;
  editingRole: AdminRole | null;
  onClose: () => void;
  onSubmit: (role: DraftEntry<AdminRole>) => Promise<void>;
}

export interface RoleCardProps {
  role: AdminRole;
  readOnly?: boolean;
  onEdit: (role: AdminRole) => void;
  onDelete?: (role: AdminRole) => void;
}

export interface ModulePermissionDisplay {
  module: string;
  label: string;
  actions: { key: string; name: string; granted: boolean }[];
}
