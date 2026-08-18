import type { Subscription } from "./subscription.types";

export interface BaseClient {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  subscription: Subscription;
}
