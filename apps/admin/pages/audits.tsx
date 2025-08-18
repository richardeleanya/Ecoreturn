import { useEffect, useState } from "react";
import Header from "../components/Header";
import { audits } from "sdk";

type Audit = {
  id: string;
  actorUserId: string;
  action: string;
  meta: any;
  createdAt: string;
};

export default function AuditsPage() {
  const [items, setItems] = useState<Audit[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<{ actorId?: string; action?: string; start?: string; end?: string }>({});

  function reload() {
    audits
      .list({ ...filters, page })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      });
  }

  useEffect(() => { reload(); }, [page, filters]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({ ...filters, action: e.target.value });
    setPage(1);
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
        <div className="mb-2 flex space-x-2">
          <input name="actorId" placeholder="Actor ID" value={filters.actorId || ""} onChange={handleChange} className="border p-1 rounded" />
          <input name="start" placeholder="Start Date (YYYY-MM-DD)" value={filters.start || ""} onChange={handleChange} className="border p-1 rounded" />
          <input name="end" placeholder="End Date (YYYY-MM-DD)" value={filters.end || ""} onChange={handleChange} className="border p-1 rounded" />
          <select name="action" value={filters.action || ""} onChange={handleSelectChange} className="border p-1 rounded">
            <option value="">All Actions</option>
            <option value="USER_ROLE_UPDATE">USER_ROLE_UPDATE</option>
            <option value="USER_STATUS_UPDATE">USER_STATUS_UPDATE</option>
          </select>
        </div>
        <table className="w-full border">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Action</th>
              <th>Meta</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id}>
                <td>{a.actorUserId}</td>
                <td>{a.action}</td>
                <td>
                  <pre className="text-xs">{JSON.stringify(a.meta, null, 2).slice(0, 160)}{JSON.stringify(a.meta, null, 2).length > 160 ? '...' : ''}</pre>
                </td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex gap-2 items-center">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">Prev</button>
          <span>Page {page}</span>
          <button disabled={(page * 20) >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </>
  );
}