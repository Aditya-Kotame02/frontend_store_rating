import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // ✅ Moved inside component

  useEffect(() => {
    fetchStoreAndRatings();
  }, []);

  const fetchStoreAndRatings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stores");
      const ownerStore = res.data.find((s) => s.owner_id === user.id);

      if (ownerStore) {
        setStore(ownerStore);
        const ratingsRes = await axios.get(`http://localhost:5000/api/ratings/store/${ownerStore.id}`);
        setRatings(ratingsRes.data);
      }
    } catch (err) {
      console.error("Failed to load store or ratings");
    }
  };

  const averageRating = ratings.length
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : "N/A";

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Owner Dashboard</h2>

      {store ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Store: {store.name}</h3>
            <p className="text-gray-600"><strong>Address:</strong> {store.address}</p>
            <p className="text-gray-600"><strong>Average Rating:</strong> {averageRating}</p>
          </div>

          <h4 className="text-lg font-semibold text-gray-700 mb-2">User Ratings</h4>
          {ratings.length > 0 ? (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">User Name</th>
                    <th className="px-4 py-2 border">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r, i) => (
                    <tr key={i} className="text-center">
                      <td className="px-4 py-2 border">{r.name}</td>
                      <td className="px-4 py-2 border">{r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No ratings yet</p>
          )}
        </>
      ) : (
        <p className="text-gray-600 mb-6">You don't have a store assigned yet.</p>
      )}

      {/* ✅ Change Password Button */}
      <div className="mt-4">
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
