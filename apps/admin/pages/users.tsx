import { useEffect, useState } from "react";
import Header from "../components/Header";
import { usersAdmin } from "sdk";
import type { User } from "shared";

const ROLES = ["CONSUMER", "BRAND", "PARTNER", "ADMIN"];
const STATUSES = ["ACTIVE", "SUSPENDED"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  function reload() {
    setLoading(true);
    usersAdmin.list().then(setUsers).finally(() => setLoading(false));
  }

  useEffect(() => { reload(); }, []);

  async function handleRoleChange(id: string, role: string) {
    await usersAdmin.updateRole(id, role);
    reload();
  }

  async function handleStatusChange(id: string, status: string) {
    await usersAdmin.updateStatus(id, status);
    reload();
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        {loading ? <div>Loading...</div> : (
          <table className="w-full border">
            <thead><tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="border p-1 rounded">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={u.status} onChange={e => handleStatusChange(u.id, e.target.value)} className="border p-1 rounded">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}