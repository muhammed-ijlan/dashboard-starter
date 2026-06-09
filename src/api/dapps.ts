import { api, buildPaginatedQueryParams } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PaginationMeta, PaginationParams } from "@/api/types";
import type { DAppStatus } from "@/types";

export interface DAppSummary {
  totalDapps: number;
  onDisplay: number;
  totalHits: number;
  totalUsers: number;
  totalFavorites: number;
}

export interface DAppListParams extends PaginationParams {
  page: number;
  limit: number;
  status?: DAppStatus | "all";
  typeId?: number;
}

export interface DAppTypeLang {
  lang: string;
  text: string;
}

export interface DAppEntry {
  id: number;
  name: string;
  description: string;
  icon: string;
  url: string;
  type: string;
  types: string[];
  types_lang?: DAppTypeLang[];
  clickCount: number;
  favoriteCount: number;
  status: string;
  statusKey: "active" | "inactive";
  statusLabel: string;
  isPopular: boolean;
  isRecommended: boolean;
  logo?: string;
}

export interface DAppListResponse {
  list: DAppEntry[];
  pagination: PaginationMeta;
}

export interface CreateDappsPayload {
  name: string;
  typeId: number;
  description?: string;
  icon?: string;
  url?: string;
  status?: string;
}

export type UpdateDappsPayload = Partial<CreateDappsPayload>;

export interface DAppType {
  id: number;
  nameEn: string;
  nameZhCn: string;
  nameZhHk?: string;
}

export interface DappCategory {
  id: number;
  nameEn: string;
  nameZhCn: string;
  nameZhHk?: string;
  sort: number;
  dappCount: number;
  isActive: boolean;
}

export interface DappCategoryListParams extends Pick<PaginationParams, "page" | "limit"> {
  status?: DAppStatus | "all";
  sort?: "sort" | "name" | "dappCount";
  order?: "asc" | "desc";
}

export interface DappCategoryListResponse {
  list: DappCategory[];
  pagination: PaginationMeta;
}

export interface CreateDappCategoryPayload {
  nameEn: string;
  nameZhCn: string;
  nameZhHk: string;
  sort: number;
  isActive: boolean;
}

export interface CreateDappCategoryResult {
  id: number;
  name: string;
}

export interface UpdateDappCategoryPayload {
  nameEn: string;
  nameZhCn: string;
  nameZhHk: string;
  sort: number;
  isActive: boolean;
}

export interface DappCategoryIdResult {
  id: number;
}

const DEFAULT_CATEGORY_PARAMS: Required<DappCategoryListParams> = {
  page: 1,
  limit: 100,
  status: "all",
  sort: "sort",
  order: "asc",
};

export const dappsApi = {
  getSummary: () => api.get<DAppSummary>(endpoints.dapps.summary),

  getList: (params: DAppListParams) => {
    const query: Record<string, string | number | boolean> = {
      ...buildPaginatedQueryParams(params),
      status: params.status ?? "all",
    };
    if (params.typeId != null) query.typeId = params.typeId;
    return api.get<DAppListResponse>(endpoints.dapps.list, query);
  },

  createDapp: (payload: CreateDappsPayload) => api.post<void>(endpoints.dapps.create, payload),

  updateDapp: (id: number, payload: UpdateDappsPayload) =>
    api.put<void>(endpoints.dapps.update(id), payload),

  deleteDapp: (id: number) => api.delete<void>(endpoints.dapps.delete(id)),

  getTypes: () => api.get<DAppType[]>(endpoints.dapps.types),

  getCategories: (params?: DappCategoryListParams) =>
    api.get<DappCategoryListResponse>(endpoints.dapps.categories, {
      ...DEFAULT_CATEGORY_PARAMS,
      ...params,
    }),

  getCategory: (id: number) => api.get<DappCategory>(endpoints.dapps.category(id)),

  createCategory: (payload: CreateDappCategoryPayload) =>
    api.post<CreateDappCategoryResult>(endpoints.dapps.categories, payload),

  updateCategory: (id: number, payload: UpdateDappCategoryPayload) =>
    api.put<DappCategoryIdResult>(endpoints.dapps.category(id), payload),

  deleteCategory: (id: number) => api.delete<DappCategoryIdResult>(endpoints.dapps.category(id)),
};
