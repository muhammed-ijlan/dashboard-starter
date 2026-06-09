export interface ApiResponse<T> {
  code: number | string;
  message: string;
  messageZh?: string;
  data: T;
  requestId: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export class ApiError extends Error {
  readonly code: number;
  readonly statusCode?: number;
  readonly errorCode?: string;
  readonly data?: unknown;

  constructor(
    code: number,
    message: string,
    statusCode?: number,
    errorCode?: string,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
  }
}
