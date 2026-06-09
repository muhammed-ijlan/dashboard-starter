export interface ModulePermission {
  module: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface AuthUser {
  id: number;
  account: string;
  email: string;
  role: string;
}

export type PermissionKeysRecord = Record<string, boolean>;

export interface LoginForm {
  account: string;
  password: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
