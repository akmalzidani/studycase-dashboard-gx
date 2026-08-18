import type { BaseClient } from "./common.types";

export type CustomerStatus = "Active" | "Blocked";

export interface Customer extends BaseClient {
  status: CustomerStatus;
}
