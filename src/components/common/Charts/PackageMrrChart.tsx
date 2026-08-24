import { getBarChartOptions, getBarChartScales } from "./chart.config";
import { useThemeStore } from "@/stores/useThemeStore";
import type { PackageSummary } from "@/helpers/analytics.helpers";
import { formatCurrency } from "@/helpers/formatters.helpers";
import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

interface PackageMrrChartProps {
  packageSummaries: PackageSummary[];
}

export function PackageMrrChart({ packageSummaries }: PackageMrrChartProps) {
  const isDark = useThemeStore((store) => store.theme === "dark");
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
  const scales = getBarChartScales(isDark);
  const options: ChartOptions<"bar"> = {
    ...getBarChartOptions(isDark),
    scales: {
      y: {
        ...scales.y,
        beginAtZero: true,
        ticks: {
          ...scales.y.ticks,
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
      x: { ...scales.x, grid: { display: false } },
    },
  };

  return <Bar data={data} options={options} />;
}
