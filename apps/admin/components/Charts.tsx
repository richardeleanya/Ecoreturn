import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Timeseries = Array<{ date: string; returnsCount: number; spendPence: number }>;
export function Charts({ timeseries }: { timeseries: Timeseries }) {
  const lineData = {
    labels: timeseries.map((d) => d.date),
    datasets: [
      {
        label: "Returns",
        data: timeseries.map((d) => d.returnsCount),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        yAxisID: "y"
      },
      {
        label: "Spend (£)",
        data: timeseries.map((d) => d.spendPence / 100),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        yAxisID: "y1"
      }
    ]
  };
  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: { type: "linear", position: "left", title: { display: true, text: "Returns" } },
      y1: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Spend (£)" },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Returns & Spend Over Time</h3>
      <Line data={lineData} options={lineOptions} />
    </div>
  );
}