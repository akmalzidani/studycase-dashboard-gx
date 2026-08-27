import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Colors,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Colors,
  Legend,
  LinearScale,
  Tooltip,
);

const getChartColors = (isDark: boolean) => ({
  text: isDark ? "#dee2e6" : "#495057",
  grid: isDark ? "rgba(222, 226, 230, 0.18)" : "rgba(33, 37, 41, 0.12)",
  tooltipBackground: isDark ? "#212529" : "#ffffff",
  tooltipBorder: isDark ? "#495057" : "#dee2e6",
});

const getSharedOptions = (isDark: boolean) => {
  const colors = getChartColors(isDark);

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: colors.text, padding: 16 },
      },
      tooltip: {
        padding: 12,
        displayColors: true,
        backgroundColor: colors.tooltipBackground,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
      },
    },
  };
};

export const getDoughnutChartOptions = (
  isDark: boolean,
): ChartOptions<"doughnut"> => getSharedOptions(isDark);

export const getBarChartScales = (isDark: boolean) => {
  const colors = getChartColors(isDark);

  return {
    x: {
      ticks: { color: colors.text },
      grid: { color: colors.grid },
      border: { color: colors.grid },
    },
    y: {
      ticks: { color: colors.text },
      grid: { color: colors.grid },
      border: { color: colors.grid },
    },
  };
};

export const getBarChartOptions = (isDark: boolean): ChartOptions<"bar"> => ({
  ...getSharedOptions(isDark),
  scales: getBarChartScales(isDark),
});
