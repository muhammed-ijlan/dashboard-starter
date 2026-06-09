import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Drawer, type InputRef } from "antd";
import { confirmAction } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { X, Save, FolderTree, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Namespace } from "@/i18n/namespaces";

import { AppButton, AppScrollArea, notifySuccess, notifyError } from "@/components/shared";
import { AppInput, AppCheckbox } from "@/components/shared/Form";
import { useDappCategories } from "@/hooks";
import { dappsApi, queryKeys } from "@/api";
import type { DappCategory } from "@/api";
import { SortableCategoryRow, type CategoryItem } from "./SortableCategoryRow";
import { getCategoryDisplayName } from "./category";

const toCategoryItem = (c: DappCategory): CategoryItem => ({
  id: String(c.id),
  nameEn: c.nameEn ?? "",
  nameZhCn: c.nameZhCn ?? "",
  nameZhHk: c.nameZhHk ?? "",
  sort: c.sort,
  enabled: c.isActive,
  dappCount: c.dappCount,
});

const nextSortFor = (items: CategoryItem[]) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map((c) => c.sort)) + 1;
};

interface CategoryManagementDrawerProps {
  open: boolean;
  onClose: () => void;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

const DRAWER_SHADOW = "0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)";

export function CategoryManagementDrawer({
  open,
  onClose,
  canCreate = true,
  canEdit = true,
  canDelete = true,
}: CategoryManagementDrawerProps) {
  const { t, i18n } = useTranslation([Namespace.Dapps, Namespace.Common]);
  const displayNameFor = (cat: CategoryItem) => getCategoryDisplayName(cat, i18n.language);

  const {
    categories: fetchedCategories,
    isLoading,
    isError,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useDappCategories({ enabled: open });

  const queryClient = useQueryClient();

  const [categories, _setCategories] = useState<CategoryItem[]>([]);
  const categoriesRef = useRef<CategoryItem[]>([]);
  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);
  const setCategories = (next: CategoryItem[]) => {
    categoriesRef.current = next;
    _setCategories(next);
  };
  const [hydrated, setHydrated] = useState(false);
  const [openTracker, setOpenTracker] = useState(open);
  const [nameEn, setNameEn] = useState("");
  const [nameZhCn, setNameZhCn] = useState("");
  const [nameZhHk, setNameZhHk] = useState("");
  const [sort, setSort] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const nameInputRef = useRef<InputRef>(null);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  if (openTracker !== open) {
    setOpenTracker(open);
    if (!open) setHydrated(false);
  }

  if (open && fetchedCategories && !hydrated) {
    setHydrated(true);
    const items = fetchedCategories.map(toCategoryItem);
    _setCategories(items);
    setSort(nextSortFor(items));
  }

  const [sortPersisting, setSortPersisting] = useState(false);

  const persistSortChanges = (prev: CategoryItem[], next: CategoryItem[]) => {
    const prevSortMap = new Map(prev.map((c) => [c.id, c.sort]));
    const changed = next.filter((c) => {
      const numericId = Number(c.id);
      return Number.isFinite(numericId) && prevSortMap.get(c.id) !== c.sort;
    });
    if (changed.length === 0) return;

    setSortPersisting(true);
    Promise.all(
      changed.map((c) =>
        dappsApi.updateCategory(Number(c.id), {
          nameEn: c.nameEn,
          nameZhCn: c.nameZhCn,
          nameZhHk: c.nameZhHk ?? "",
          sort: c.sort,
          isActive: c.enabled,
        }),
      ),
    )
      .then(() => {
        void queryClient.invalidateQueries({
          queryKey: [...queryKeys.dapps.all, "categories"],
        });
      })
      .catch((err) => {
        setCategories(prev);
        notifyError(err);
      })
      .finally(() => {
        setSortPersisting(false);
      });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (sortPersisting) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const prev = categoriesRef.current;
    const ordered = [...prev].sort((a, b) => a.sort - b.sort);
    const oldIdx = ordered.findIndex((c) => c.id === active.id);
    const newIdx = ordered.findIndex((c) => c.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove(ordered, oldIdx, newIdx);
    const sortMap = new Map(reordered.map((c, i) => [c.id, i + 1]));
    const next = prev.map((c) => ({ ...c, sort: sortMap.get(c.id) ?? c.sort }));
    setCategories(next);
    persistSortChanges(prev, next);
    if (editingId) {
      const updated = next.find((c) => c.id === editingId);
      if (updated) setSort(updated.sort);
    }
  };

  const rowNodeMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const pendingFlipRef = useRef<Map<string, number> | null>(null);

  const registerNode = (id: string, node: HTMLDivElement | null) => {
    if (node) rowNodeMap.current.set(id, node);
    else rowNodeMap.current.delete(id);
  };

  useLayoutEffect(() => {
    const oldPositions = pendingFlipRef.current;
    if (!oldPositions) return;
    pendingFlipRef.current = null;
    rowNodeMap.current.forEach((node, id) => {
      const oldTop = oldPositions.get(id);
      if (oldTop === undefined) return;
      const newTop = node.getBoundingClientRect().top;
      const delta = oldTop - newTop;
      if (!delta) return;
      node.getAnimations().forEach((a) => a.cancel());
      node.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }], {
        duration: 280,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "none",
      });
    });
  });

  const isEditing = editingId !== null;
  const sortedCategories = [...categories].sort((a, b) => a.sort - b.sort);

  const resetForm = (items: CategoryItem[] = categories) => {
    setNameEn("");
    setNameZhCn("");
    setNameZhHk("");
    setSort(nextSortFor(items));
    setEnabled(true);
    setEditingId(null);
  };

  const isSortInUse = categories.some((c) => c.sort === sort && c.id !== editingId);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    const trimmedEn = nameEn.trim();
    const trimmedZhCn = nameZhCn.trim();
    const trimmedZhHk = nameZhHk.trim();
    if (!trimmedEn || !trimmedZhCn) return;
    if (isSortInUse) {
      notifyError(
        new Error(
          t("category.messages.sortInUse", "Sort number is already in use by another category"),
        ),
      );
      return;
    }
    const fallbackZhHk = trimmedZhHk || trimmedEn;
    const payload = {
      nameEn: trimmedEn,
      nameZhCn: trimmedZhCn,
      nameZhHk: fallbackZhHk,
      sort,
      isActive: enabled,
    };
    if (editingId) {
      const numericId = Number(editingId);
      if (!Number.isFinite(numericId)) return;
      setIsSaving(true);
      updateCategory.mutate(
        { id: numericId, payload },
        {
          onSuccess: () => {
            if (!openRef.current) return;
            const next = categoriesRef.current.map((c) =>
              c.id === editingId
                ? {
                    ...c,
                    name: trimmedEn,
                    nameEn: trimmedEn,
                    nameZhCn: trimmedZhCn,
                    nameZhHk: fallbackZhHk,
                    sort,
                    enabled,
                  }
                : c,
            );
            setCategories(next);
            notifySuccess(t("category.messages.updateSuccess", "Category updated successfully"));
            resetForm(next);
          },
          onSettled: () => setIsSaving(false),
        },
      );
      return;
    }
    setIsSaving(true);
    createCategory.mutate(payload, {
      onSuccess: (created) => {
        if (!openRef.current) return;
        const next = [
          ...categoriesRef.current,
          {
            id: String(created.id),
            nameEn: trimmedEn,
            nameZhCn: trimmedZhCn,
            nameZhHk: fallbackZhHk,
            sort,
            enabled,
            dappCount: 0,
          } satisfies CategoryItem,
        ];
        setCategories(next);
        notifySuccess(t("category.messages.createSuccess", "Category created successfully"));
        resetForm(next);
      },
      onSettled: () => setIsSaving(false),
    });
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setNameEn(cat.nameEn);
    setNameZhCn(cat.nameZhCn);
    setNameZhHk(cat.nameZhHk ?? "");
    setSort(cat.sort);
    setEnabled(cat.enabled);
    setTimeout(() => nameInputRef.current?.focus({ cursor: "end" }), 0);
  };

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const handleToggle = (cat: CategoryItem) => {
    if (togglingIds.has(cat.id)) return;
    const numericId = Number(cat.id);
    if (!Number.isFinite(numericId)) return;
    const nextEnabled = !cat.enabled;

    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.add(cat.id);
      return next;
    });

    dappsApi
      .updateCategory(numericId, {
        nameEn: cat.nameEn,
        nameZhCn: cat.nameZhCn,
        nameZhHk: cat.nameZhHk ?? "",
        sort: cat.sort,
        isActive: nextEnabled,
      })
      .then(() => {
        if (!openRef.current) return;
        setCategories(
          categoriesRef.current.map((c) => (c.id === cat.id ? { ...c, enabled: nextEnabled } : c)),
        );
        void queryClient.invalidateQueries({
          queryKey: [...queryKeys.dapps.all, "categories"],
        });
      })
      .catch((err) => {
        if (openRef.current) notifyError(err);
      })
      .finally(() => {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(cat.id);
          return next;
        });
      });
  };

  const handleDelete = (cat: CategoryItem) => {
    if (cat.dappCount > 0) return;
    const numericId = Number(cat.id);
    if (!Number.isFinite(numericId)) return;
    confirmAction({
      title: t("common:actions.confirm"),
      content: `${t("category.messages.confirmDelete", "Are you sure you want to delete")} "${displayNameFor(cat)}"?`,
      okText: t("common:actions.confirm"),
      cancelText: t("common:actions.cancel"),
      onOk: () =>
        new Promise<void>((resolve, reject) => {
          deleteCategory.mutate(numericId, {
            onSuccess: () => {
              if (!openRef.current) {
                resolve();
                return;
              }
              const remaining = categoriesRef.current.filter((c) => c.id !== cat.id);
              const recompacted = [...remaining]
                .sort((a, b) => a.sort - b.sort)
                .map((c, i) => ({ ...c, sort: i + 1 }));
              setCategories(recompacted);
              persistSortChanges(remaining, recompacted);
              if (editingId === cat.id) {
                resetForm(recompacted);
              } else if (editingId) {
                const updatedEditing = recompacted.find((c) => c.id === editingId);
                if (updatedEditing) setSort(updatedEditing.sort);
              } else {
                setSort(nextSortFor(recompacted));
              }
              notifySuccess(t("category.messages.deleteSuccess", "Category deleted successfully"));
              resolve();
            },
            onError: (err) => reject(err),
          });
        }),
    });
  };

  const handleMove = (cat: CategoryItem, dir: "up" | "down") => {
    if (sortPersisting) return;
    const prev = categoriesRef.current;
    const sorted = [...prev].sort((a, b) => a.sort - b.sort);
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    const other = sorted[swapIdx];
    if (!other) return;

    const positions = new Map<string, number>();
    rowNodeMap.current.forEach((node, id) => {
      positions.set(id, node.getBoundingClientRect().top);
    });
    pendingFlipRef.current = positions;

    const next = prev.map((c) => {
      if (c.id === cat.id) return { ...c, sort: other.sort };
      if (c.id === other.id) return { ...c, sort: cat.sort };
      return c;
    });
    setCategories(next);
    persistSortChanges(prev, next);
    if (editingId) {
      const updated = next.find((c) => c.id === editingId);
      if (updated) setSort(updated.sort);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      closeIcon={false}
      width={672}
      styles={{
        body: { padding: 0, background: "#FFFFFF" },
        content: { boxShadow: DRAWER_SHADOW },
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <h2
            className="text-[18px] font-semibold text-primary"
            style={{ lineHeight: "28px", letterSpacing: "-0.31px" }}
          >
            {isEditing ? t("category.editTitle") : t("category.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-[#4A5565]" />
          </button>
        </div>

        <div className="flex-1 min-h-0 px-6 py-6 flex flex-col gap-6">
          {(canCreate || (canEdit && isEditing)) && (
            <section className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6.25 flex flex-col gap-4 shrink-0">
              <h3
                className="text-[16px] font-semibold text-primary"
                style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
              >
                {isEditing ? t("category.infoTitle") : t("category.createTitle")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[13px] font-medium text-[#364153]"
                    style={{ lineHeight: "20px" }}
                  >
                    {t("category.fields.nameEn.label")} <span className="text-[#E7000B]">*</span>
                  </label>
                  <AppInput
                    ref={nameInputRef}
                    placeholder={t("category.fields.nameEn.placeholder")}
                    value={nameEn}
                    maxLength={50}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[13px] font-medium text-[#364153]"
                    style={{ lineHeight: "20px" }}
                  >
                    {t("category.fields.nameZhCn.label")} <span className="text-[#E7000B]">*</span>
                  </label>
                  <AppInput
                    placeholder={t("category.fields.nameZhCn.placeholder")}
                    value={nameZhCn}
                    maxLength={50}
                    onChange={(e) => setNameZhCn(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[13px] font-medium text-[#364153]"
                  style={{ lineHeight: "20px" }}
                >
                  {t("category.fields.nameZhHk.label")}
                </label>
                <AppInput
                  placeholder={t("category.fields.nameZhHk.placeholder")}
                  value={nameZhHk}
                  maxLength={50}
                  onChange={(e) => setNameZhHk(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[13px] font-medium text-[#364153]"
                  style={{ lineHeight: "20px" }}
                >
                  {t("category.fields.sort.label")}
                </label>
                <AppInput disabled={true} inputMode="numeric" value={sort} />
              </div>

              <AppCheckbox
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                label={
                  <span
                    className="text-[13px] font-medium text-[#364153]"
                    style={{ lineHeight: "20px" }}
                  >
                    {t("category.fields.enable.label")}
                  </span>
                }
              />

              <div className="flex gap-3 mt-1">
                <AppButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => resetForm()}
                  disabled={!isEditing}
                >
                  {t("category.return")}
                </AppButton>
                <AppButton
                  className="flex-1 inline-flex items-center justify-center gap-2"
                  onClick={handleSave}
                  disabled={!nameEn.trim() || !nameZhCn.trim() || isSaving}
                  loading={isSaving}
                >
                  <Save size={16} strokeWidth={2} />
                  {t("common:actions.save")}
                </AppButton>
              </div>
            </section>
          )}

          {/* Category list card */}
          <section className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex flex-col min-h-0 overflow-hidden">
            <h3
              className="text-[16px] font-semibold text-primary px-6 pt-3 pb-4 border-b border-[#E5E7EB] shrink-0"
              style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
            >
              {t("category.listTitle")}
            </h3>

            {isLoading && categories.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-12 text-secondary">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-caption">{t("common:loading", "Loading...")}</span>
              </div>
            ) : isError && categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
                <AlertCircle size={32} className="text-[#E7000B]" strokeWidth={1.5} />
                <p className="text-[14px] font-medium text-primary" style={{ lineHeight: "20px" }}>
                  {t("category.error.title", "Could not load categories")}
                </p>
                <p
                  className="text-[13px] font-normal text-secondary"
                  style={{ lineHeight: "18px" }}
                >
                  {t("category.error.description", "Something went wrong. Please try again.")}
                </p>
                <AppButton variant="secondary" onClick={() => void refetch()}>
                  {t("category.error.retry", "Retry")}
                </AppButton>
              </div>
            ) : sortedCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
                <FolderTree size={32} className="text-[#D1D5DC]" strokeWidth={1.5} />
                <p className="text-[14px] font-medium text-primary" style={{ lineHeight: "20px" }}>
                  {t("category.empty.title")}
                </p>
                <p
                  className="text-[13px] font-normal text-secondary"
                  style={{ lineHeight: "18px" }}
                >
                  {t("category.empty.description")}
                </p>
              </div>
            ) : (
              <AppScrollArea className="flex-1 min-h-0">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  autoScroll={{
                    canScroll: (el) => {
                      const style = window.getComputedStyle(el);
                      const overflowY = style.overflowY;
                      if (overflowY !== "auto" && overflowY !== "scroll") return false;
                      return el.scrollHeight - el.clientHeight > 1;
                    },
                  }}
                >
                  <SortableContext
                    items={sortedCategories.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col">
                      {sortedCategories.map((cat, idx) => (
                        <SortableCategoryRow
                          key={cat.id}
                          cat={cat}
                          displayName={displayNameFor(cat)}
                          isFirst={idx === 0}
                          isLast={idx === sortedCategories.length - 1}
                          canEdit={canEdit}
                          canDelete={canDelete}
                          sortPending={sortPersisting}
                          togglePending={togglingIds.has(cat.id)}
                          registerNode={registerNode}
                          onMoveUp={() => handleMove(cat, "up")}
                          onMoveDown={() => handleMove(cat, "down")}
                          onEdit={() => handleEdit(cat)}
                          onToggle={() => handleToggle(cat)}
                          onDelete={() => handleDelete(cat)}
                          labelEnabled={t("category.status.enabled")}
                          labelDisabled={t("category.status.disabled")}
                          labelEdit={t("common:actions.edit")}
                          labelDelete={t("common:actions.delete")}
                          labelToggle={
                            cat.enabled ? t("category.row.hide") : t("category.row.show")
                          }
                          summary={t("category.row.summary", {
                            sort: cat.sort,
                            count: cat.dappCount,
                          })}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </AppScrollArea>
            )}
          </section>
        </div>
      </div>
    </Drawer>
  );
}
