import React, { useState } from "react";
import axios from "axios";

export default function ChangePassword({ userId }) {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}/.test(newPassword)) {
      return setMessage("Password must be 8–16 chars, 1 uppercase, 1 special char.");
    }

    try {
      await axios.post("http://localhost:5000/api/users/change-password", {
        user_id: userId,
        newPassword,
      });
      setMessage("Password updated successfully.");
      setNewPassword("");
    } catch {
      setMessage("Error updating password.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Update Password
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
