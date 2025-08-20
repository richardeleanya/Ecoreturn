import { useEffect, useState } from "react";
import Header from "../components/Header";
import { admin } from "sdk";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ brandId: "", name: "", address: "", city: "", postcode: "", lat: "", lng: "", contactEmail: "" });
  const [editing, setEditing] = useState<string | null>(null);

  function reload() {
    admin.locations.list().then(setLocations);
  }

  useEffect(() => { reload(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) };
    if (editing) {
      await admin.locations.update(editing, data);
    } else {
      await admin.locations.create(data);
    }
    setForm({ brandId: "", name: "", address: "", city: "", postcode: "", lat: "", lng: "", contactEmail: "" });
    setEditing(null);
    reload();
  }

  async function handleDelete(id: string) {
    await admin.locations.remove(id);
    reload();
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Locations</h1>
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <input name="brandId" placeholder="Brand ID" value={form.brandId} onChange={handleChange} className="border p-2 rounded w-40" />
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded w-40" required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded w-40" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded w-32" />
          <input name="postcode" placeholder="Postcode" value={form.postcode} onChange={handleChange} className="border p-2 rounded w-24" />
          <input name="lat" placeholder="Lat" value={form.lat} onChange={handleChange} className="border p-2 rounded w-24" required />
          <input name="lng" placeholder="Lng" value={form.lng} onChange={handleChange} className="border p-2 rounded w-24" required />
          <input name="contactEmail" placeholder="Contact Email" value={form.contactEmail} onChange={handleChange} className="border p-2 rounded w-40" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">{editing ? "Update" : "Create"}</button>
        </form>
        <table className="w-full border">
          <thead><tr><th>Name</th><th>Brand</th><th>Address</th><th>City</th><th>Lat</th><th>Lng</th><th>Actions</th></tr></thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.brandId}</td>
                <td>{l.address}</td>
                <td>{l.city}</td>
                <td>{l.lat}</td>
                <td>{l.lng}</td>
                <td>
                  <button className="mr-2 text-blue-600" onClick={() => { setEditing(l.id); setForm({ ...l, lat: l.lat + "", lng: l.lng + "" }); }}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(l.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}