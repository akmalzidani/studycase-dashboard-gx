import { ChartCanvas } from "./ChartCanvas";
import { getDoughnutChartOptions } from "./chart.config";
import { useThemeStore } from "@/stores/useThemeStore";
import type { ChartData } from "chart.js";

interface ProspectFunnelChartProps {
  pendingProspectCount: number;
  completedProspectCount: number;
}

export function ProspectFunnelChart({
  pendingProspectCount,
  completedProspectCount,
}: ProspectFunnelChartProps) {
  const isDark = useThemeStore((store) => store.__isDarkMode);
  const data: ChartData<"doughnut"> = {
    labels: ["Pending follow-up", "Completed"],
    datasets: [
      {
        data: [pendingProspectCount, completedProspectCount],
        backgroundColor: ["#0dcaf0", "#198754"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <ChartCanvas
      type="doughnut"
      data={data}
      options={getDoughnutChartOptions(isDark)}
    />
  );
}
