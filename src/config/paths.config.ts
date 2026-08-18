import {
  createBasePaths,
  createCRUDPaths,
  createUpdatePaths,
} from "@/config/path.helpers";

const SETTINGS_BASE = "settings";

export const APP_PATHS = {
  DASHBOARD: createBasePaths(""),
  PROSPECT: createCRUDPaths("prospect"),
  CUSTOMERS: createCRUDPaths("customers"),
  ANALYTICS: createBasePaths("analytics"),
  SETTINGS: {
    ROOT: SETTINGS_BASE,
    USERS: createCRUDPaths(`${SETTINGS_BASE}/users`, "userId"),
    PROFILE: createUpdatePaths(`${SETTINGS_BASE}/profile`),
    SUBSCRIPTION: createCRUDPaths(`${SETTINGS_BASE}/subscription`),
  },
} as const;
