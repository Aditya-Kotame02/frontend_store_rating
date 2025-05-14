import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", role: "user" });
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", owner_id: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [usersRes, storesRes, ratingsRes] = await Promise.all([
      axios.get("http://localhost:5000/api/users/all"),
      axios.get("http://localhost:5000/api/stores"),
      axios.get("http://localhost:5000/api/ratings"),
    ]);
    setUsers(usersRes.data);
    setStores(storesRes.data);
    setRatings(ratingsRes.data);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      u.role.toLowerCase().includes(filters.role.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey]?.toString().toLowerCase();
    const valB = b[sortKey]?.toString().toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/users/signup", form);
    setForm({ name: "", email: "", address: "", password: "", role: "user" });
    fetchAll();
  };

  const handleStoreCreate = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/stores/create", storeForm);
    setStoreForm({ name: "", email: "", address: "", owner_id: "" });
    fetchAll();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-white">
        <div className="bg-blue-600 rounded p-4 shadow-md">
          <p className="text-lg">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-green-600 rounded p-4 shadow-md">
          <p className="text-lg">Total Stores</p>
          <p className="text-2xl font-bold">{stores.length}</p>
        </div>
        <div className="bg-purple-600 rounded p-4 shadow-md">
          <p className="text-lg">Total Ratings</p>
          <p className="text-2xl font-bold">{ratings.length}</p>
        </div>
      </div>

      {/* Create User Form */}
      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleUserCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input" />
          <input name="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="input" />
          <input name="address" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required className="input" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="input" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input">
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-full w-full md:w-auto">
            Add User
          </button>
        </form>
      </div>

      {/* Create Store Form */}
      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Store</h3>
        <form onSubmit={handleStoreCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Store Name" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required className="input" />
          <input name="email" placeholder="Store Email" value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} required className="input" />
          <input name="address" placeholder="Address" value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} required className="input" />
          <input name="owner_id" placeholder="Owner ID" value={storeForm.owner_id} onChange={e => setStoreForm({ ...storeForm, owner_id: e.target.value })} required className="input" />
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 col-span-full w-full md:w-auto">
            Add Store
          </button>
        </form>
      </div>

      {/* User Table with Filters */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">All Users (Filterable)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input placeholder="Filter by name" onChange={e => setFilters({ ...filters, name: e.target.value })} className="input" />
          <input placeholder="Filter by email" onChange={e => setFilters({ ...filters, email: e.target.value })} className="input" />
          <input placeholder="Filter by address" onChange={e => setFilters({ ...filters, address: e.target.value })} className="input" />
          <input placeholder="Filter by role" onChange={e => setFilters({ ...filters, role: e.target.value })} className="input" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {["name", "email", "address", "role", "average_rating"].map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border cursor-pointer hover:bg-gray-300"
                    onClick={() => handleSort(key)}
                  >
                    {key === "average_rating" ? "Avg Rating (if Owner)" : key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortKey === key && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => (
                <tr key={u.id} className="text-center">
                  <td className="border px-4 py-2">{u.name}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">{u.address}</td>
                  <td className="border px-4 py-2 capitalize">{u.role}</td>
                  <td className="border px-4 py-2">
                    {u.role === "owner"
                      ? u.average_rating
                        ? parseFloat(u.average_rating).toFixed(1)
                        : "No ratings yet"
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
