import { API_CONFIG } from "@/config/api.config";
import type {
  HttpClient,
  HttpClientConfig,
  RequestConfig,
} from "@/types/http.types";
import axios from "axios";

function createHttpClient(defaultConfig: HttpClientConfig): HttpClient {
  const request = async <T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> => {
    const { data: responseData } = await axios.request<T>({
      baseURL: defaultConfig.baseURL,
      timeout: defaultConfig.timeout,
      method,
      url: endpoint,
      data,
      params: config?.params,
      signal: config?.signal,
      headers: {
        ...defaultConfig.headers,
        ...config?.headers,
      },
    });

    return responseData;
  };

  return {
    get: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>("GET", endpoint, undefined, config),

    post: <T, TBody = unknown>(
      endpoint: string,
      data?: TBody,
      config?: RequestConfig,
    ) => request<T>("POST", endpoint, data, config),

    put: <T, TBody = unknown>(
      endpoint: string,
      data?: TBody,
      config?: RequestConfig,
    ) => request<T>("PUT", endpoint, data, config),

    patch: <T, TBody = unknown>(
      endpoint: string,
      data?: TBody,
      config?: RequestConfig,
    ) => request<T>("PATCH", endpoint, data, config),

    delete: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>("DELETE", endpoint, undefined, config),
  };
}

export const api = createHttpClient(API_CONFIG);
