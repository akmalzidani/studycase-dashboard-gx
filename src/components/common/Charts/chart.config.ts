import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Colors,
  Legend,
  LinearScale,
  Tooltip,
);

export const doughnutChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      padding: 12,
      displayColors: true,
    },
  },
};

export const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      padding: 12,
      displayColors: true,
    },
  },
};
