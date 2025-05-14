import React from "react";
import { useNavigate } from "react-router-dom";
import StoreList from "./StoreList";
import AdminDashboard from "./AdminDashboard";
import OwnerDashboard from "./OwnerDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.name} <span className="text-sm text-gray-600">({user.role})</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {user.role === "user" && <StoreList />}
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "owner" && <OwnerDashboard />}
      </div>
    </div>
  );
}
