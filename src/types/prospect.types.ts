import type { BaseClient } from "./common.types";

export type ProspectStatus = "Pending" | "Completed";

export interface Prospect extends BaseClient {
  status: ProspectStatus;
}
