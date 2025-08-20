import { useEffect, useState } from "react";
import Header from "../components/Header";
import { admin } from "sdk";

const PACKAGE_TYPES = ["ALUMINUM", "PLASTIC", "GLASS", "CARDBOARD", "COMPOSITE"];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ brandId: "", name: "", barcode: "", sku: "", packageType: "PLASTIC" });
  const [editing, setEditing] = useState<string | null>(null);

  function reload() {
    admin.products.list().then(setProducts);
  }

  useEffect(() => { reload(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await admin.products.update(editing, form);
    } else {
      await admin.products.create(form);
    }
    setForm({ brandId: "", name: "", barcode: "", sku: "", packageType: "PLASTIC" });
    setEditing(null);
    reload();
  }

  async function handleDelete(id: string) {
    await admin.products.remove(id);
    reload();
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input name="brandId" placeholder="Brand ID" value={form.brandId} onChange={handleChange} className="border p-2 rounded w-40" required />
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded w-40" required />
          <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} className="border p-2 rounded w-40" required />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} className="border p-2 rounded w-32" />
          <select name="packageType" value={form.packageType} onChange={handleChange} className="border p-2 rounded w-32">
            {PACKAGE_TYPES.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">{editing ? "Update" : "Create"}</button>
        </form>
        <table className="w-full border">
          <thead><tr><th>Name</th><th>Barcode</th><th>SKU</th><th>Package</th><th>Brand</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.barcode}</td>
                <td>{p.sku}</td>
                <td>{p.packageType}</td>
                <td>{p.brandId}</td>
                <td>
                  <button className="mr-2 text-blue-600" onClick={() => { setEditing(p.id); setForm(p); }}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}