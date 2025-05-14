import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
    </Routes>
  );
}

export default App;
