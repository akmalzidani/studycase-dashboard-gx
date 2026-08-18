export const MODAL_TARGETS = {
  CONFIRMATION: "confirmation-dialog",
  CUSTOMER_FORM: "customer-form-modal",
  PROSPECT_FORM: "prospect-form-modal",
  SUBSCRIPTION_FORM: "subscription-form-modal",
  PROFILE_FORM: "profile-form-modal",
  CHANGE_PASSWORD: "change-password-modal",
} as const;

export type ModalTarget = (typeof MODAL_TARGETS)[keyof typeof MODAL_TARGETS];
