import { matchesSearchKeyword } from "@/components/common/DataTable";
import { formatSpeed } from "@/helpers/formatters.helpers";
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
      formatSpeed(client.subscription.speed),
    ],
    keyword,
  );
