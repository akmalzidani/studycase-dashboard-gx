import type { BaseClient, Customer, Prospect } from "@/types";
import { MOCK_SUBSCRIPTIONS } from "./subscription.mock";

const CLIENT_SEEDS = [
  ["Budi Santoso", "budi.santoso@gmail.com", "081234567890", 0],
  ["Siti Aminah", "siti.aminah@yahoo.com", "081298765432", 1],
  ["PT Maju Mundur", "contact@majumundur.co.id", "0219876543", 2],
  ["Andi Wijaya", "andi.wijaya@outlook.com", "085612345678", 0],
  ["Dewi Lestari", "dewi.lestari@gmail.com", "081377889900", 1],
  ["Rizky Pratama", "rizky.pratama@proton.me", "089512345678", 0],
  ["CV Sinar Abadi", "info@sinarabadi.co.id", "0227312456", 1],
  ["Nadia Putri", "nadia.putri@icloud.com", "082112345678", 2],
  ["Fajar Ramadhan", "fajar.ramadhan@gmail.com", "087812345678", 0],
  ["PT Nusantara Logistik", "it@nusantaralogistik.co.id", "0215557288", 2],
  ["Maya Kurniawati", "maya.kurniawati@yahoo.com", "085722334455", 1],
  ["Hendra Gunawan", "hendra.gunawan@outlook.com", "081299887766", 0],
  ["Klinik Sehat Sentosa", "admin@sehat-sentosa.id", "0317894561", 2],
  ["Citra Permata", "citra.permata@gmail.com", "088123456789", 1],
  ["Yusuf Maulana", "yusuf.maulana@fastmail.com", "081365432198", 0],
  ["PT Kreasi Digital Indonesia", "support@kreasidigital.id", "02180678901", 2],
  ["Lina Marlina", "lina.marlina@gmail.com", "085156789012", 1],
  ["Arif Setiawan", "arif.setiawan@outlook.com", "082245678901", 0],
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
