import { AnalyticsContent } from "@/components/Analytics/AnalyticsContent";

import { hasPermission } from "@/config/permission.helpers";
import { PERMISSION_KEYS } from "@/config/permission.config";
import { useCustomers } from "@/hooks/useCustomers";
import { useProspects } from "@/hooks/useProspects";
import { calculateAnalyticsMetrics } from "@/helpers/analytics.helpers";
import { useAuthStore } from "@/stores/useAuthStore";

function AnalyticsPage() {
  const permissions = useAuthStore((store) => store.permissions);
  const canReadCustomers = hasPermission(
    permissions,
    PERMISSION_KEYS.CUSTOMERS.READ,
  );
  const canReadProspects = hasPermission(
    permissions,
    PERMISSION_KEYS.PROSPECT.READ,
  );
  const { customers, isLoading: isLoadingCustomers } = useCustomers();
  const { prospects, isLoading: isLoadingProspects } = useProspects();

  const metrics = calculateAnalyticsMetrics(customers, prospects);
  const isLoading = isLoadingCustomers || isLoadingProspects;

  return (
    <>

      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading analytics...</span>
          </div>
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
