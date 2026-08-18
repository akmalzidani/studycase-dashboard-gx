import { matchesSearchKeyword } from "@/components/common/DataTable";
import type { ClientTableItem } from "./ClientTableColumns";

export const searchClientTableItem = (
  client: ClientTableItem,
  keyword: string,
) =>
  matchesSearchKeyword(
    [
      client.id,
      client.name,
      client.email,
      client.phoneNumber,
      client.status,
      client.subscription.packageName,
      client.subscription.speed,
    ],
    keyword,
  );
