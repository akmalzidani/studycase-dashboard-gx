import { api } from "@/services/api.service";
import type {
  ProductMarketingApiResponse,
  ProductMarketingFilters,
} from "@/types/product-marketing.types";
import axios from "axios";

const PRODUCT_MARKETING_ENDPOINT = "/businesses/products/variants/marketings";

export const productMarketingService = {
  async getAll(
    filters: ProductMarketingFilters,
    page: number,
    limit: number,
    signal?: AbortSignal,
  ): Promise<ProductMarketingApiResponse> {
    try {
      const { data } = await api.get<ProductMarketingApiResponse>(
        PRODUCT_MARKETING_ENDPOINT,
        {
          params: {
            search: filters.search,
            productIds: filters.productIds.join(","),
            billingCycleIds: filters.billingCycleIds.join(","),
            ...(filters.publish === undefined
              ? {}
              : { publish: filters.publish }),
            all: true,
            page,
            limit,
          },
          signal,
        },
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }

      throw new Error("An unexpected error occurred while loading products.");
    }
  },
};
