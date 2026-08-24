import { getBarChartOptions, getBarChartScales } from "./chart.config";
import { useThemeStore } from "@/stores/useThemeStore";
import type { PackageSummary } from "@/helpers/analytics.helpers";
import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

interface PackageInterestChartProps {
  packageSummaries: PackageSummary[];
}

export function PackageInterestChart({
  packageSummaries,
}: PackageInterestChartProps) {
  const isDark = useThemeStore((store) => store.theme === "dark");
  const data: ChartData<"bar"> = {
    labels: packageSummaries.map((item) => item.name),
    datasets: [
      {
        label: "Pending",
        data: packageSummaries.map((item) => item.pendingProspects),
        backgroundColor: "#0dcaf0",
        borderRadius: 4,
      },
      {
        label: "Completed",
        data: packageSummaries.map((item) => item.completedProspects),
        backgroundColor: "#198754",
        borderRadius: 4,
      },
    ],
  };
  const scales = getBarChartScales(isDark);
  const options: ChartOptions<"bar"> = {
    ...getBarChartOptions(isDark),
    scales: {
      x: { ...scales.x, stacked: true, grid: { display: false } },
      y: {
        ...scales.y,
        stacked: true,
        beginAtZero: true,
        ticks: { ...scales.y.ticks, precision: 0 },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
