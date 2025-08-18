import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Timeseries = Array<{ date: string; returnsCount: number; spendPence: number }>;
type CampaignPerf = Array<{ name: string; spendPence: number }>;

export function Charts({
  timeseries,
  campaignPerformance,
}: {
  timeseries: Timeseries;
  campaignPerformance: CampaignPerf;
}) {
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

  const topCampaigns = campaignPerformance.slice(0, 10);
  const barData = {
    labels: topCampaigns.map((c) => c.name),
    datasets: [
      {
        label: "Spend (£)",
        data: topCampaigns.map((c) => c.spendPence / 100),
        backgroundColor: "#2563eb"
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-2">Returns & Spend Over Time</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Campaign Spend</h3>
        <Bar data={barData} />
      </div>
    </div>
  );
}