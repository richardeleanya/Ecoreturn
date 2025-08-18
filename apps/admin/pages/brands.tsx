import { useEffect, useState } from "react";
import Header from "../components/Header";
import { admin } from "sdk";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ name: "", logoUrl: "", description: "", website: "" });
  const [editing, setEditing] = useState<string | null>(null);

  function reload() {
    admin.brands.list().then(setBrands);
  }

  useEffect(() => { reload(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await admin.brands.update(editing, form);
    } else {
      await admin.brands.create(form);
    }
    setForm({ name: "", logoUrl: "", description: "", website: "" });
    setEditing(null);
    reload();
  }

  async function handleDelete(id: string) {
    await admin.brands.remove(id);
    reload();
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Brands</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded w-48" required />
          <input name="logoUrl" placeholder="Logo URL" value={form.logoUrl} onChange={handleChange} className="border p-2 rounded w-48" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded w-48" />
          <input name="website" placeholder="Website" value={form.website} onChange={handleChange} className="border p-2 rounded w-48" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">{editing ? "Update" : "Create"}</button>
        </form>
        <table className="w-full border">
          <thead><tr><th>Name</th><th>Logo</th><th>Description</th><th>Website</th><th>Actions</th></tr></thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.logoUrl ? <img src={b.logoUrl} alt="logo" className="h-8" /> : ""}</td>
                <td>{b.description}</td>
                <td>{b.website}</td>
                <td>
                  <button className="mr-2 text-blue-600" onClick={() => { setEditing(b.id); setForm(b); }}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}