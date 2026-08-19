import type { Subscription } from "@/types";

const SUBSCRIPTION_SEEDS = [
  ["sub-lite", "Lite", 100, 300000],
  ["sub-signature", "Signature", 100, 600000],
  ["sub-dedicated", "Dedicated Link", 100, 1000000],
] as const;

export const MOCK_SUBSCRIPTIONS: Subscription[] = SUBSCRIPTION_SEEDS.map(
  ([id, packageName, speed, monthlyFee]) => ({
    id,
    packageName,
    speed,
    monthlyFee,
  }),
);
