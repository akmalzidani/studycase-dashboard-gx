import { barChartOptions } from "./chart.config";
import type { PackageSummary } from "@/helpers/analytics.helpers";
import { formatCurrency } from "@/helpers/formatters.helpers";
import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

interface PackageMrrChartProps {
  packageSummaries: PackageSummary[];
}

export function PackageMrrChart({ packageSummaries }: PackageMrrChartProps) {
  const data: ChartData<"bar"> = {
    labels: packageSummaries.map((item) => item.name),
    datasets: [
      {
        label: "Estimated MRR",
        data: packageSummaries.map((item) => item.estimatedMrr),
        backgroundColor: "#0d6efd",
        borderRadius: 6,
        maxBarThickness: 44,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    ...barChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
      x: { grid: { display: false } },
    },
  };

  return <Bar data={data} options={options} />;
}
