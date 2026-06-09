import { useState } from "react";
import { Plus, FolderTree } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { useDappStats } from "@/hooks";
import { useDapps } from "@/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { DAppList, DAppDrawer, CategoryManagementDrawer } from "@/components/layout/DApp";
import { PageHeader, AppButton } from "@/components/shared";
import type { DAppEntry, CreateDappsPayload } from "@/api/dapps";
import type { DAppStatus } from "@/types";
import { usePermissions } from "@/hooks";
import { PermissionKey } from "@/constants/permissionKeys";
import { SEARCH_DEBOUNCE_MS } from "@/constants/const";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { notifySuccess } from "@/components/shared";

const DAppManagement = () => {
  const { t } = useTranslation(Namespace.Dapps);
  const { hasPermission } = usePermissions();
  const canCreateDapp = hasPermission(PermissionKey.DappsCreate);
  const canEditDapp = hasPermission(PermissionKey.DappsEdit);
  const canDeleteDapp = hasPermission(PermissionKey.DappsDelete);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DAppEntry | null>(null);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DAppStatus | "all">("all");
  const [typeIdFilter, setTypeIdFilter] = useState<number | undefined>(undefined);

  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { stats, isLoading: isStatsLoading } = useDappStats();
  const {
    dapps,
    dappsLoading: isTableLoading,
    dappsFetching: isTableFetching,
    createDapp: createDappMutation,
    updateDapp: updateDappMutation,
    deleteDapp: deleteDappMutation,
  } = useDapps({
    listParams: {
      page,
      limit: pageSize,
      search: debouncedSearch,
      status: statusFilter,
      typeId: typeIdFilter,
    },
  });

  const { mutate: createDapp, isPending: isCreating } = createDappMutation;
  const { mutate: updateDapp, isPending: isUpdating } = updateDappMutation;
  const { mutate: deleteDapp } = deleteDappMutation;

  const rawApiData = dapps?.list || [];
  const totalItems = dapps?.pagination?.total ?? 0;

  const normalizedData = rawApiData.map((item) => ({
    ...item,
    category: item.type,
    clicks: item.clickCount ?? 0,
    favorites: item.favoriteCount ?? 0,
  }));

  const openAdd = () => {
    setEditingEntry(null);
    setDrawerOpen(true);
  };

  const openEdit = (entry: DAppEntry) => {
    setEditingEntry(entry);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingEntry(null);
  };

  const handleSubmit = (payload: CreateDappsPayload & { id?: number }) => {
    const { id, ...data } = payload;

    if (id) {
      updateDapp(
        { id, payload: data },
        {
          onSuccess: () => {
            notifySuccess(t("messages.updateSuccess"));
            handleClose();
          },
        },
      );
    } else {
      createDapp(data, {
        onSuccess: () => {
          notifySuccess(t("messages.createSuccess"));
          handleClose();
          setPage(1);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteDapp(Number(id), {
      onSuccess: () => {
        notifySuccess(t("messages.deleteSuccess", "DApp deleted successfully"));
      },
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: DAppStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTypeIdFilterChange = (value: number | undefined) => {
    setTypeIdFilter(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 max-w-400 mx-auto w-full">
      <div className="flex justify-between items-center">
        <PageHeader
          title={t("header.title")}
          description={t("header.description")}
          actions={
            <div className="flex items-center gap-3">
              <AppButton variant="secondary" onClick={() => setCategoryDrawerOpen(true)}>
                <FolderTree size={16} strokeWidth={2} />
                {t("actions.categoryManagement")}
              </AppButton>
              {canCreateDapp && (
                <AppButton onClick={openAdd}>
                  <Plus />
                  {t("actions.addDapp")}
                </AppButton>
              )}
            </div>
          }
        />
      </div>

      <DAppList
        data={normalizedData}
        totalItems={totalItems}
        isTableLoading={isTableLoading}
        isTableFetching={isTableFetching}
        stats={stats}
        isStatsLoading={isStatsLoading}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeIdFilter={typeIdFilter}
        canEdit={canEditDapp}
        canDelete={canDeleteDapp}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeIdFilterChange={handleTypeIdFilterChange}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <DAppDrawer
        open={drawerOpen}
        editingEntry={editingEntry}
        isSubmitting={isCreating || isUpdating}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <CategoryManagementDrawer
        open={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        canCreate={canCreateDapp}
        canEdit={canEditDapp}
        canDelete={canDeleteDapp}
      />
    </div>
  );
};

export default DAppManagement;
