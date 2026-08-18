const STORAGE_NAMESPACE = "learn-dashboard";

export const STORAGE_KEYS = {
  AUTH_SESSION: `${STORAGE_NAMESPACE}:auth-session`,
  CUSTOMERS: `${STORAGE_NAMESPACE}:customers`,
  PROSPECTS: `${STORAGE_NAMESPACE}:prospects`,
  SUBSCRIPTIONS: `${STORAGE_NAMESPACE}:subscriptions`,
  USERS: `${STORAGE_NAMESPACE}:users`,
} as const;
