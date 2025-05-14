import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Added
// import ChangePassword from "./ChangePassword"; // ❌ Removed inline use

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [filter, setFilter] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // ✅ Hook to navigate to password page

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  const fetchStores = async () => {
    const res = await axios.get("http://localhost:5000/api/stores");
    setStores(res.data);
  };

  const fetchUserRatings = async () => {
    const res = await axios.get(`http://localhost:5000/api/ratings/user/${user.id}`);
    const ratingsMap = {};
    res.data.forEach((r) => {
      ratingsMap[r.store_id] = r.rating;
    });
    setUserRatings(ratingsMap);
  };

  const handleRating = async (store_id, rating) => {
    await axios.post("http://localhost:5000/api/ratings", {
      user_id: user.id,
      store_id,
      rating,
    });
    fetchUserRatings(); // Refresh rating
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(filter.toLowerCase()) ||
      store.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Store List</h2>

      <input
        type="text"
        placeholder="Search by name or address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Store Name</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Average Rating</th>
              <th className="px-4 py-2 border">Your Rating</th>
              <th className="px-4 py-2 border">Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id} className="text-center">
                <td className="border px-4 py-2">{store.name}</td>
                <td className="border px-4 py-2">{store.address}</td>
                <td className="border px-4 py-2">
                  {store.average_rating
                    ? parseFloat(store.average_rating).toFixed(1)
                    : "No ratings yet"}
                </td>
                <td className="border px-4 py-2">
                  {userRatings[store.id] || "Not rated"}
                </td>
                <td className="border px-4 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(store.id, star)}
                      className={`mx-1 px-2 py-1 border rounded ${
                        userRatings[store.id] === star
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-blue-100"
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Change Password Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/change-password")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
