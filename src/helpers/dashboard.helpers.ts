import type { Customer, Prospect } from "@/types";

export interface DashboardMetrics {
  activeCustomerCount: number;
  blockedCustomerCount: number;
  pendingProspectCount: number;
  completedProspectCount: number;
  estimatedMrr: number;
}

export const calculateDashboardMetrics = (
  customers: Customer[],
  prospects: Prospect[],
): DashboardMetrics => {
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  );

  return {
    activeCustomerCount: activeCustomers.length,
    blockedCustomerCount: customers.filter(
      (customer) => customer.status === "Blocked",
    ).length,
    pendingProspectCount: prospects.filter(
      (prospect) => prospect.status === "Pending",
    ).length,
    completedProspectCount: prospects.filter(
      (prospect) => prospect.status === "Completed",
    ).length,
    estimatedMrr: activeCustomers.reduce(
      (total, customer) => total + customer.subscription.monthlyFee,
      0,
    ),
  };
};
