import React from "react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";

export default function ChangePasswordPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Change Password
        </h2>
        <ChangePassword userId={user.id} />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
