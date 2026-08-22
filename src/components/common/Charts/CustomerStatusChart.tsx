import { doughnutChartOptions } from "./chart.config";
import type { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface CustomerStatusChartProps {
  activeCustomerCount: number;
  blockedCustomerCount: number;
}

export function CustomerStatusChart({
  activeCustomerCount,
  blockedCustomerCount,
}: CustomerStatusChartProps) {
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

  return <Doughnut data={data} options={doughnutChartOptions} />;
}
