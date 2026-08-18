import { STORAGE_KEYS } from "@/config/storage.config";
import { MOCK_SUBSCRIPTIONS } from "@/data/subscription.mock";
import { createLocalStorageCrudService } from "@/services/base-crud.service";
import type { Subscription } from "@/types";

export type SubscriptionPayload = Omit<Subscription, "id">;

export const subscriptionService = createLocalStorageCrudService<Subscription>({
  storageKey: STORAGE_KEYS.SUBSCRIPTIONS,
  initialData: MOCK_SUBSCRIPTIONS,
  idPrefix: "SUB",
  entityName: "Paket subscription",
  normalizePayload: (payload) => ({
    ...payload,
    packageName: payload.packageName.trim(),
    speed: payload.speed.trim(),
    monthlyFee: Number(payload.monthlyFee),
  }),
  getConflictMessage: (subscriptions, payload, excludedId) =>
    subscriptions.some(
      (subscription) =>
        subscription.id !== excludedId &&
        subscription.packageName.toLowerCase() ===
          payload.packageName.toLowerCase(),
    )
      ? "Nama paket subscription sudah digunakan."
      : undefined,
});
