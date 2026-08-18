import type { BaseClient, Customer, Prospect } from "@/types";
import { MOCK_SUBSCRIPTIONS } from "./subscription.mock";

const generateBaseClients = (): BaseClient[] => [
  {
    name: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    phoneNumber: "081234567890",
    subscription: MOCK_SUBSCRIPTIONS[0], // Lite
  },
  {
    name: "Siti Aminah",
    email: "siti.aminah@yahoo.com",
    phoneNumber: "081298765432",
    subscription: MOCK_SUBSCRIPTIONS[1], // Signature
  },
  {
    name: "PT. Maju Mundur",
    email: "contact@majumundur.co.id",
    phoneNumber: "0219876543",
    subscription: MOCK_SUBSCRIPTIONS[2], // Dedicated Link
  },
  {
    name: "Andi Wijaya",
    email: "andi.wijaya@outlook.com",
    phoneNumber: "085612345678",
    subscription: MOCK_SUBSCRIPTIONS[0], // Lite
  },
];

export const MOCK_CUSTOMERS: Customer[] = generateBaseClients().map(
  (client, index) => ({
    ...client,
    id: `CUST-00${index + 1}`,
    status: index % 3 === 0 ? "Blocked" : "Active", // Mix of statuses
  }),
);

export const MOCK_PROSPECTS: Prospect[] = generateBaseClients().map(
  (client, index) => ({
    ...client,
    id: `PROS-00${index + 1}`,
    status: index % 2 === 0 ? "Pending" : "Completed", // Mix of statuses
  }),
);
