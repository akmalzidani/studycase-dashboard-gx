import { api } from "@/services/api.service";
import type {
  ProductMarketingApiResponse,
  ProductMarketingFilters,
} from "@/types/product-marketing.types";

const PRODUCT_MARKETING_ENDPOINT = "/businesses/products/variants/marketings";

export const productMarketingService = {
  getAll(
    filters: ProductMarketingFilters,
    page: number,
    limit: number,
    signal?: AbortSignal,
  ): Promise<ProductMarketingApiResponse> {
    return api.get<ProductMarketingApiResponse>(PRODUCT_MARKETING_ENDPOINT, {
      params: {
        search: filters.search,
        productIds: filters.productIds.join(","),
        billingCycleIds: filters.billingCycleIds.join(","),
        publish: filters.publish ?? "",
        all: true,
        page,
        limit,
      },
      signal,
    });
  },
};
