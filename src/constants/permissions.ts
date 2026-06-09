export const PAGE_MODULES = [{ key: "dashboard", label: "Dashboard" }] as const;

export type PageModuleKey = (typeof PAGE_MODULES)[number]["key"];

const API_TO_PAGE: Record<string, PageModuleKey> = {
  dashboard: "dashboard",
};

export function toPageModule(apiModule: string): PageModuleKey | undefined {
  return API_TO_PAGE[apiModule];
}

const _pageOrder = new Map(PAGE_MODULES.map((m, i) => [m.key, i]));

export function apiModuleSortIndex(apiModule: string): number {
  const pageKey = API_TO_PAGE[apiModule];
  return pageKey != null ? (_pageOrder.get(pageKey) ?? 999) : 999;
}

export const PAGE_TO_API: Record<PageModuleKey, string[]> = {
  dashboard: ["dashboard"],
};
