export const MODAL_TARGETS = {
  CONFIRMATION: "confirmation-dialog",
  CUSTOMER_FORM: "customer-form-overlay",
  PROSPECT_FORM: "prospect-form-overlay",
  SUBSCRIPTION_FORM: "subscription-form-overlay",
  PROFILE_FORM: "profile-form-overlay",
  CHANGE_PASSWORD: "change-password-overlay",
  USER_FORM: "user-form-overlay",
  ROLE_FORM: "role-form-overlay",
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

export type ModalTarget = (typeof MODAL_TARGETS)[keyof typeof MODAL_TARGETS];

export type OffcanvasTarget = Exclude<
  ModalTarget,
  (typeof MODAL_TARGETS)["CONFIRMATION"]
>;
