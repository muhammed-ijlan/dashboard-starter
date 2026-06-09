import { useState, useMemo, useCallback } from "react";
import { UserPlus } from "lucide-react";
import { AdminList, AdminModal, RoleList, RoleDrawer } from "@/components/layout/Admin";
import { PageHeader, PillTabs, AppButton, notifySuccess } from "@/components/shared";
import { useAdmin, usePermissions } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import type { AdminEntry, AdminRole, DraftEntry, PillTabItem, RoleDrawerProps } from "@/types";

import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { PermissionKey } from "@/constants/permissionKeys";
import { SEARCH_DEBOUNCE_MS } from "@/constants/const";

const PAGE_SIZE = 10;

const Administrator = () => {
  const { hasPermission } = usePermissions();
  const canViewAdmins = hasPermission(PermissionKey.AdminsView);
  const canCreateAdmin = hasPermission(PermissionKey.AdminsCreate);
  const canUpdateAdmin = hasPermission(PermissionKey.AdminsUpdate);
  const canDeleteAdmin = hasPermission(PermissionKey.AdminsDelete);
  const canViewRoles = hasPermission(PermissionKey.RolesView);
  const canManageRoles = hasPermission(PermissionKey.RolesManage);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const {
    roles = [],
    rolesLoading,
    admins,
    adminsTotal,
    adminsLoading,
    adminSummary: summary,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    deleteRole,
    toggleAdminStatus: toggleStatus,
  } = useAdmin({
    listParams: { page, limit: PAGE_SIZE, search: debouncedSearch || undefined },
    rolesEnabled: canViewRoles,
    adminsEnabled: canViewAdmins,
    summaryEnabled: canViewAdmins,
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminEntry | null>(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  const { t } = useTranslation(Namespace.Admin);

  const openAddAdmin = () => {
    setEditingAdmin(null);
    setAdminModalOpen(true);
  };

  const openEditAdmin = useCallback((entry: AdminEntry) => {
    setEditingAdmin(entry);
    setAdminModalOpen(true);
  }, []);

  const handleAdminSubmit = async (
    values: DraftEntry<AdminEntry>,
    password?: string,
    confirmPassword?: string,
  ) => {
    if (values.id) {
      const original = admins?.find((a) => a.id === values.id);
      await updateAdmin.mutateAsync({
        id: Number(values.id),
        payload: {
          account: values.account || original?.account || "",
          name: values.name || original?.name || "",
          email: values.email || original?.email || "",
          role: values.role || original?.role || "",
        },
      });
      notifySuccess(t("messages.adminUpdated", "Admin updated successfully"));
    } else {
      await createAdmin.mutateAsync({
        account: values.account,
        name: values.name,
        email: values.email,
        role: values.role,
        password: password ?? "",
        confirmPassword: confirmPassword ?? "",
      });
      notifySuccess(t("messages.adminCreated", "Admin created successfully"));
    }
  };

  const handleDeleteAdmin = useCallback(
    (id: string) => {
      deleteAdmin.mutate(Number(id), {
        onSuccess: () => notifySuccess(t("messages.adminDeleted", "Admin deleted successfully")),
      });
    },
    [deleteAdmin, t],
  );

  const handleToggleAdminState = useCallback(
    (id: string) => {
      const admin = admins?.find((a) => a.id === id);
      if (!admin) return;
      const newStatus = admin.state === "Normal" ? "disabled" : "active";
      toggleStatus.mutate(
        { id: Number(id), status: newStatus },
        {
          onSuccess: () =>
            notifySuccess(
              newStatus === "active"
                ? t("messages.adminEnabled", "Admin enabled successfully")
                : t("messages.adminDisabled", "Admin disabled successfully"),
            ),
        },
      );
    },
    [admins, toggleStatus, t],
  );

  const openCreateRole = useCallback(() => {
    setEditingRole(null);
    setRoleModalOpen(true);
  }, []);

  const openEditRole = useCallback((role: AdminRole) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  }, []);

  const handleDeleteRole = useCallback(
    (role: AdminRole) => {
      deleteRole.mutate(Number(role.id), {
        onSuccess: () => notifySuccess(t("messages.roleDeleted", "Role deleted successfully")),
      });
    },
    [deleteRole, t],
  );

  const handleRoleSubmit: RoleDrawerProps["onSubmit"] = async () => {};

  const tabItems = useMemo<PillTabItem[]>(
    () => [
      ...(canViewAdmins
        ? [
            {
              key: "admin",
              label: t("tab.admin"),
              children: (
                <AdminList
                  data={admins ?? []}
                  loading={adminsLoading}
                  summary={summary}
                  canUpdate={canUpdateAdmin}
                  canDelete={canDeleteAdmin}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  pagination={{
                    current: page,
                    total: adminsTotal ?? 0,
                    pageSize: PAGE_SIZE,
                    onChange: setPage,
                  }}
                  onEdit={openEditAdmin}
                  onDelete={handleDeleteAdmin}
                  onToggleState={handleToggleAdminState}
                />
              ),
            },
          ]
        : []),
      ...(canViewRoles
        ? [
            {
              key: "role",
              label: t("tab.role"),
              children: (
                <RoleList
                  roles={roles}
                  loading={rolesLoading}
                  readOnly={!canManageRoles}
                  onEdit={openEditRole}
                  onCreate={openCreateRole}
                  onDelete={canManageRoles ? handleDeleteRole : undefined}
                />
              ),
            },
          ]
        : []),
    ],
    [
      t,
      canViewAdmins,
      canViewRoles,
      canUpdateAdmin,
      canDeleteAdmin,
      canManageRoles,
      admins,
      adminsLoading,
      adminsTotal,
      summary,
      page,
      roles,
      rolesLoading,
      openEditAdmin,
      handleDeleteAdmin,
      handleToggleAdminState,
      openEditRole,
      openCreateRole,
      handleDeleteRole,
      searchQuery,
      handleSearchChange,
    ],
  );

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <div className="flex justify-between items-center">
        <PageHeader
          title={t("header.title")}
          description={t("header.description")}
          actions={
            canCreateAdmin ? (
              <AppButton onClick={openAddAdmin}>
                <UserPlus size={16} />
                {t("actions.addAdmin")}
              </AppButton>
            ) : undefined
          }
        />
      </div>

      <PillTabs items={tabItems} />

      <AdminModal
        open={adminModalOpen}
        editingEntry={editingAdmin}
        onClose={() => {
          setAdminModalOpen(false);
          setEditingAdmin(null);
        }}
        onSubmit={handleAdminSubmit}
      />

      <RoleDrawer
        open={roleModalOpen}
        editingRole={editingRole}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleRoleSubmit}
      />
    </div>
  );
};

export default Administrator;
