import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_PROSPECTS } from "@/data/client.mock";
import { createLocalStorageCrudService } from "@/services/base-crud.service";
import type { Prospect } from "@/types";

export type ProspectPayload = Omit<Prospect, "id">;

export const prospectService = createLocalStorageCrudService<Prospect>({
  storageKey: STORAGE_KEYS.PROSPECTS,
  initialData: MOCK_PROSPECTS,
  idPrefix: "PROS",
  entityName: "Prospect",
  normalizePayload: (payload) => ({
    ...payload,
    email: payload.email.trim().toLowerCase(),
  }),
  getConflictMessage: (prospects, payload, excludedId) =>
    prospects.some(
      (prospect) =>
        prospect.id !== excludedId && prospect.email === payload.email,
    )
      ? "Email sudah digunakan oleh prospect lain."
      : undefined,
});
