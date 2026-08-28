import type { ApiPagination, ApiResponse } from "./common.types";

export interface ProductMarketingBranch {
  id: number;
  code: string;
  name: string;
  assigned: boolean;
}

export interface ProductMarketingBillingCycle {
  id: number;
  name: string;
  billEveryNMonth: number;
}

export interface ProductMarketingAddOn {
  id: number;
  addOnId: number;
  name: string;
  description: string;
  additionalDiscount: number;
  discountType: {
    id: number;
    name: string;
  };
  fromDate: string | null;
  toDate: string | null;
  valid: boolean;
}

export interface ProductMarketingInformation {
  id: number;
  name: string;
  description: string;
  contentType: string;
  attachments: unknown[] | null;
}

export interface ProductMarketingAttachment {
  file: string;
  mimeType: string;
  type: {
    id: number;
    name: string;
  };
}

export interface ProductMarketingProduct {
  id: number;
  uuid: string;
  name: string;
  number: string;
  description: string;
  active: boolean;
  publish: boolean;
  score: number;
  monthlyFee: number;
  countProductVariant: number;
  createdAt: string;
  createdBy: string;
  category: {
    id: number;
    name: string;
  };
  group: {
    id: number;
    name: string;
  };
  attachments: ProductMarketingAttachment[] | null;
  informations: ProductMarketingInformation[] | null;
  termsConditions: {
    file: string;
    mimeType: string;
  } | null;
}

export interface ProductMarketing {
  id: number;
  alias: string;
  number: string;
  description: string;
  active: boolean;
  publish: boolean;
  popular: boolean;
  finalBaseFee: number;
  finalDiscountedFee: number;
  recurringFee: number;
  setupFee: number;
  additionalDiscount: number;
  includeTax: boolean;
  includeTax23: boolean;
  markup: number;
  taxFee: number;
  techvisitFree: number;
  uuid: string;
  billNDate: number;
  billingCycle?: ProductMarketingBillingCycle | null;
  networkSetting?: {
    id: number;
    name: string;
  } | null;
  branches: ProductMarketingBranch[] | null;
  addOns: ProductMarketingAddOn[] | null;
  informations: ProductMarketingInformation[] | null;
  product: ProductMarketingProduct;
}

export interface ProductMarketingFilters {
  search: string;
  productIds: number[];
  billingCycleIds: number[];
  publish?: boolean;
}

export type ProductMarketingApiResponse = ApiResponse<ProductMarketing[]> & {
  pagination: ApiPagination;
};
