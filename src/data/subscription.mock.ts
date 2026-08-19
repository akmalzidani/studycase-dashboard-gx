import type { Subscription } from "@/types";

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-lite",
    packageName: "Lite",
    speed: 100,
    monthlyFee: 300000,
  },
  {
    id: "sub-signature",
    packageName: "Signature",
    speed: 100,
    monthlyFee: 600000,
  },
  {
    id: "sub-dedicated",
    packageName: "Dedicated Link",
    speed: 100,
    monthlyFee: 1000000,
  },
];
