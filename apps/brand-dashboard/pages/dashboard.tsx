import { useEffect, useState } from "react";
import Header from "../components/Header";
import { analytics } from "sdk";
import { Charts } from "../components/Charts";

export default function Dashboard() {
  const [kpi, setKpi] = useState<{ returnsCount: number; spendPence: number; avgRewardPence: number; totalBudgetRemainingPence: number }>({ returnsCount: 0, spendPence: 0, avgRewardPence: 0, totalBudgetRemainingPence: 0 });
  const [timeseries, setTimeseries] = useState<{ date: string; returnsCount: number; spendPence: number }[]>([]);
  const [campaignPerformance, setCampaignPerformance] = useState<{ name: string; spendPence: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; returnsCount: number; spendPence: number }[]>([]);
  const [topLocations, setTopLocations] = useState<{ name: string; returnsCount: number; spendPence: number }[]>([]);

  useEffect(() => {
    analytics.brand().then((data) => {
      setKpi(data.kpi);
      setTimeseries(data.timeseries);
      setCampaignPerformance(data.campaignPerformance);
      setTopProducts(data.topProducts);
      setTopLocations(data.topLocations);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Brand Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Returns Count</div>
            <div className="text-2xl font-bold">{kpi.returnsCount}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Spend (£)</div>
            <div className="text-2xl font-bold">{(kpi.spendPence / 100).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Avg Reward (£)</div>
            <div className="text-2xl font-bold">{(kpi.avgRewardPence / 100).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Budget Remaining (£)</div>
            <div className="text-2xl font-bold">{(kpi.totalBudgetRemainingPence / 100).toFixed(2)}</div>
          </div>
        </div>
        <Charts
          timeseries={timeseries}
          campaignPerformance={campaignPerformance}
          topProducts={topProducts}
          topLocations={topLocations}
        />
      </div>
    </>
  );
}