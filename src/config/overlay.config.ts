export const OVERLAY_TARGETS = {
  CONFIRMATION: "confirmation-dialog",
  CUSTOMER_FORM: "customer-form-overlay",
  CUSTOMER_DETAIL: "customer-detail-overlay",
  PROSPECT_FORM: "prospect-form-overlay",
  PROSPECT_DETAIL: "prospect-detail-overlay",
  SUBSCRIPTION_FORM: "subscription-form-overlay",
  PROFILE_FORM: "profile-form-overlay",
  CHANGE_PASSWORD: "change-password-overlay",
  USER_FORM: "user-form-overlay",
  ROLE_FORM: "role-form-overlay",
  PRODUCT_MARKETING_FILTER: "product-marketing-filter-overlay",
} as const;

export const FORM_IDS = {
  CHANGE_PASSWORD: "change-password-form",
  CUSTOMER: "customer-form",
  PROSPECT: "prospect-form",
  SUBSCRIPTION: "subscription-form",
  PROFILE: "profile-form",
  USER: "user-form",
  ROLE: "role-form",
} as const;

export type OverlayTarget =
  (typeof OVERLAY_TARGETS)[keyof typeof OVERLAY_TARGETS];

export type OffcanvasTarget = Exclude<
  OverlayTarget,
  (typeof OVERLAY_TARGETS)["CONFIRMATION"]
>;
