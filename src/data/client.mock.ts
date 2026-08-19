import type { BaseClient, Customer, Prospect } from "@/types";
import { MOCK_SUBSCRIPTIONS } from "./subscription.mock";

const CLIENT_SEEDS = [
  ["Budi Santoso", "budi.santoso@gmail.com", "081234567890", 0],
  ["Siti Aminah", "siti.aminah@yahoo.com", "081298765432", 1],
  ["PT. Maju Mundur", "contact@majumundur.co.id", "0219876543", 2],
  ["Andi Wijaya", "andi.wijaya@outlook.com", "085612345678", 0],
] as const;

const generateBaseClients = (): BaseClient[] =>
  CLIENT_SEEDS.map(([name, email, phoneNumber, subscriptionIndex]) => ({
    name,
    email,
    phoneNumber,
    subscription: MOCK_SUBSCRIPTIONS[subscriptionIndex]!,
  }));

export const MOCK_CUSTOMERS: Customer[] = generateBaseClients().map(
  (client, index) => ({
    ...client,
    id: `CUST-00${index + 1}`,
    status: index % 3 === 0 ? "Blocked" : "Active",
  }),
);

export const MOCK_PROSPECTS: Prospect[] = generateBaseClients().map(
  (client, index) => ({
    ...client,
    id: `PROS-00${index + 1}`,
    status: index % 2 === 0 ? "Pending" : "Completed",
  }),
);
