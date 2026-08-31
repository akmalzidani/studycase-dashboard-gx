import type { HttpClientConfig } from "@/types/http.types";

const DEFAULT_API_BASE_URL =
  "https://dev.api.globalxtreme-gateway.net/api/public/v2";

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
} as const satisfies HttpClientConfig;
