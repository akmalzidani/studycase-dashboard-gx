import { AnalyticsContent } from "@/components/Analytics/AnalyticsContent";
import { Spinner } from "@/components/common/Spinner";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCustomers } from "@/hooks/useCustomers";
import { useProspects } from "@/hooks/useProspects";
import { calculateAnalyticsMetrics } from "@/helpers/analytics.helpers";
import { useAuthStore } from "@/stores/useAuthStore";

function AnalyticsPage() {
  const permissions = useAuthStore((store) => store.__permissions);
  const canReadCustomers = hasPermission(
    permissions,
    PERMISSION_KEYS.CUSTOMERS.READ,
  );
  const canReadProspects = hasPermission(
    permissions,
    PERMISSION_KEYS.PROSPECT.READ,
  );
  const { __customers: customers, __isLoading: isLoadingCustomers } =
    useCustomers();
  const { __prospects: prospects, __isLoading: isLoadingProspects } =
    useProspects();

  const metrics = calculateAnalyticsMetrics(customers, prospects);
  const isLoading = isLoadingCustomers || isLoadingProspects;

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner className="text-primary" label="Loading analytics..." />
        </div>
      ) : (
        <AnalyticsContent
          canReadCustomers={canReadCustomers}
          canReadProspects={canReadProspects}
          {...metrics}
        />
      )}
    </>
  );
}

export default AnalyticsPage;
