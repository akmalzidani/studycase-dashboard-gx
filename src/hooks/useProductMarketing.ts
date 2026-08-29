import axios from "axios";
import { productMarketingService } from "@/services/product-marketing.service";
import type { ApiPagination } from "@/types/common.types";
import type {
  ProductMarketing,
  ProductMarketingFilters,
} from "@/types/product-marketing.types";
import { useEffect, useState } from "react";

interface UseProductMarketingReturn {
  __products: ProductMarketing[];
  __pagination: ApiPagination | null;
  __isLoading: boolean;
  __error: string | null;
  __handleRetry: () => void;
}

export function useProductMarketing(
  filters: ProductMarketingFilters,
  page: number,
  limit: number,
): UseProductMarketingReturn {
  const [products, setProducts] = useState<ProductMarketing[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const { search, productIds, billingCycleIds, publish } = filters;
  const productIdsKey = productIds.join(",");
  const billingCycleIdsKey = billingCycleIds.join(",");

  const { getAll } = productMarketingService;

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAll(filters, page, limit, controller.signal);
        setProducts(result.result ?? []);
        setPagination(result.pagination);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Product marketing data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [
    search,
    productIdsKey,
    billingCycleIdsKey,
    publish,
    page,
    limit,
    requestVersion,
  ]);

  return {
    __products: products,
    __pagination: pagination,
    __isLoading: isLoading,
    __error: error,
    __handleRetry: () => setRequestVersion((version) => version + 1),
  };
}
