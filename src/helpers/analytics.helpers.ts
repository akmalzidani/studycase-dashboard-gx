import type { Customer, Prospect, Subscription } from "@/types";

export interface PackageSummary {
  name: string;
  activeCustomers: number;
  pendingProspects: number;
  completedProspects: number;
  estimatedMrr: number;
}

export interface AnalyticsMetrics {
  pendingProspectCount: number;
  completedProspectCount: number;
  completionRate: number;
  packageSummaries: PackageSummary[];
  highestMrrPackage?: PackageSummary;
}

const getSubscriptionKey = (subscription: Subscription) =>
  subscription.id ?? subscription.packageName;

export const calculateAnalyticsMetrics = (
  customers: Customer[],
  prospects: Prospect[],
): AnalyticsMetrics => {
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  );
  const pendingProspectCount = prospects.filter(
    (prospect) => prospect.status === "Pending",
  ).length;
  const completedProspectCount = prospects.filter(
    (prospect) => prospect.status === "Completed",
  ).length;
  const subscriptions = new Map<string, Subscription>();

  [...customers, ...prospects].forEach((client) => {
    subscriptions.set(getSubscriptionKey(client.subscription), client.subscription);
  });

  const packageSummaries = [...subscriptions.values()].map<PackageSummary>(
    (subscription) => {
      const subscriptionKey = getSubscriptionKey(subscription);
      const packageCustomers = activeCustomers.filter(
        (customer) => getSubscriptionKey(customer.subscription) === subscriptionKey,
      );
      const packageProspects = prospects.filter(
        (prospect) => getSubscriptionKey(prospect.subscription) === subscriptionKey,
      );

      return {
        name: subscription.packageName,
        activeCustomers: packageCustomers.length,
        pendingProspects: packageProspects.filter(
          (prospect) => prospect.status === "Pending",
        ).length,
        completedProspects: packageProspects.filter(
          (prospect) => prospect.status === "Completed",
        ).length,
        estimatedMrr: packageCustomers.length * subscription.monthlyFee,
      };
    },
  );
  const highestMrrPackage = packageSummaries.reduce<PackageSummary | undefined>(
    (highest, summary) =>
      !highest || summary.estimatedMrr > highest.estimatedMrr ? summary : highest,
    undefined,
  );

  return {
    pendingProspectCount,
    completedProspectCount,
    completionRate: prospects.length
      ? Math.round((completedProspectCount / prospects.length) * 100)
      : 0,
    packageSummaries,
    highestMrrPackage,
  };
};
