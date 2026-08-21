export const MODAL_TARGETS = {
  CONFIRMATION: "confirmation-dialog",
  CUSTOMER_FORM: "customer-form-modal",
  PROSPECT_FORM: "prospect-form-modal",
  SUBSCRIPTION_FORM: "subscription-form-modal",
  PROFILE_FORM: "profile-form-modal",
  CHANGE_PASSWORD: "change-password-modal",
  USER_FORM: "user-form-modal",
  ROLE_FORM: "role-form-modal",
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
