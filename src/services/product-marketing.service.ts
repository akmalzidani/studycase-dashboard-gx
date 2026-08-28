import { api } from "@/services/api.service";
import type {
    ProductMarketingApiResponse,
    ProductMarketingFilters
} from "@/types/product-marketing.types";
import axios from "axios";

const PRODUCT_MARKETING_ENDPOINT = "/businesses/products/variants/marketings";

export const productMarketingService = {
  async getAll(
    filters: ProductMarketingFilters,
    page: number,
    limit: number,
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
            page,
            limit,
            all: true,
          },
        },
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          { status?: { message?: string } } | undefined;

        if (
          error.response?.status === 404 &&
          responseData?.status?.message?.includes("not found")
        ) {
          return {
            status: {
              code: 404,
              message: "Not found",
              internalMsg: "",
              attributes: null,
            },
            result: [],
            pagination: {
              count: 0,
              currentPage: page,
              links: { next: 0, previous: 0 },
              perPage: limit,
              total: 0,
              totalPage: 1,
            },
          };
        }
      }

      throw error;
    }
  },
};
