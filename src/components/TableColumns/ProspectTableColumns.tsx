import { createClientTableColumns } from "./ClientTableColumns";
import type { Prospect } from "@/types";

export const prospectTableColumns = createClientTableColumns<Prospect>({
  getStatusVariant: (status) =>
    status === "Completed" ? "success" : "warning",
});
