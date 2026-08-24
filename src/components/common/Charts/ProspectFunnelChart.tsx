import { getDoughnutChartOptions } from "./chart.config";
import { useThemeStore } from "@/stores/useThemeStore";
import type { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface ProspectFunnelChartProps {
  pendingProspectCount: number;
  completedProspectCount: number;
}

export function ProspectFunnelChart({
  pendingProspectCount,
  completedProspectCount,
}: ProspectFunnelChartProps) {
  const isDark = useThemeStore((store) => store.theme === "dark");
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

  return <Doughnut data={data} options={getDoughnutChartOptions(isDark)} />;
}
