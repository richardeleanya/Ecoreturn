import { useEffect, useState } from "react";
import Header from "../components/Header";
import { returns, wallet } from "sdk";

export default function Dashboard() {
  const [returnsCount, setReturnsCount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    returns.history().then((data) => setReturnsCount(data.length));
    wallet.balance().then((data) => setBalance(data.balancePence / 100));
  }, []);

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Partner Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Returns Count</div>
            <div className="text-2xl font-bold">{returnsCount}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">Balance (£)</div>
            <div className="text-2xl font-bold">{balance.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-gray-500">ROI</div>
            <div className="text-2xl font-bold">N/A</div>
          </div>
        </div>
      </div>
    </>
  );
}