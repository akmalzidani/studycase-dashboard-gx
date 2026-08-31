export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;

  post<T, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    config?: RequestConfig,
  ): Promise<T>;

  put<T, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    config?: RequestConfig,
  ): Promise<T>;

  patch<T, TBody = unknown>(
    endpoint: string,
    data?: TBody,
    config?: RequestConfig,
  ): Promise<T>;

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
}
