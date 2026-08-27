import { ChartCanvas } from "./ChartCanvas";
import { getDoughnutChartOptions } from "./chart.config";
import { useThemeStore } from "@/stores/useThemeStore";
import type { ChartData } from "chart.js";

interface CustomerStatusChartProps {
  activeCustomerCount: number;
  blockedCustomerCount: number;
}

export function CustomerStatusChart({
  activeCustomerCount,
  blockedCustomerCount,
}: CustomerStatusChartProps) {
  const isDark = useThemeStore((store) => store.__isDarkMode);
  const data: ChartData<"doughnut"> = {
    labels: ["Active", "Blocked"],
    datasets: [
      {
        data: [activeCustomerCount, blockedCustomerCount],
        backgroundColor: ["#198754", "#dc3545"],
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
