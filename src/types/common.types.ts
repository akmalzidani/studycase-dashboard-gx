import type { Subscription } from "./subscription.types";

export interface BaseClient {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  subscription: Subscription;
}

export interface ApiStatus {
  code: number;
  message: string;
  internalMsg: string;
  attributes: unknown | null;
}

export interface ApiPagination {
  count: number;
  currentPage: number;
  links: {
    next: number;
    previous: number;
  };
  perPage: number;
  total: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  result: T;
  pagination?: ApiPagination;
}
