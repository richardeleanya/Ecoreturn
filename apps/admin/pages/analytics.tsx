import { useEffect, useState } from "react";
import Header from "../components/Header";
import { analytics } from "sdk";
import { Charts } from "../components/Charts";

export default function AnalyticsPage() {
  const [totals, setTotals] = useState<{ users: number; brands: number; products: number; locations: number; returnsCount: number; spendPence: number }>({ users: 0, brands: 0, products: 0, locations: 0, returnsCount: 0, spendPence: 0 });
  const [timeseries, setTimeseries] = useState<{ date: string; returnsCount: number; spendPence: number }[]>([]);

  useEffect(() => {
    analytics.admin().then((data) => {
      setTotals(data.totals);
      setTimeseries(data.timeseries);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Platform Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded shadow p-3">Users<div className="font-bold text-xl">{totals.users}</div></div>
          <div className="bg-white rounded shadow p-3">Brands<div className="font-bold text-xl">{totals.brands}</div></div>
          <div className="bg-white rounded shadow p-3">Products<div className="font-bold text-xl">{totals.products}</div></div>
          <div className="bg-white rounded shadow p-3">Locations<div className="font-bold text-xl">{totals.locations}</div></div>
          <div className="bg-white rounded shadow p-3">Returns<div className="font-bold text-xl">{totals.returnsCount}</div></div>
          <div className="bg-white rounded shadow p-3">Spend (£)<div className="font-bold text-xl">{(totals.spendPence / 100).toFixed(2)}</div></div>
        </div>
        <Charts timeseries={timeseries} />
      </div>
    </>
  );
}