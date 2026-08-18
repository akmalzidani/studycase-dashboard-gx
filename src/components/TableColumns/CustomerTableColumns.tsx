import { createClientTableColumns } from "./ClientTableColumns";
import type { Customer } from "@/types";

export const customerTableColumns = createClientTableColumns<Customer>({
  getStatusVariant: (status) =>
    status === "Active" ? "success" : "danger",
});
