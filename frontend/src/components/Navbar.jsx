import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg">
      <Link
        to="/dashboard"
        className="text-xl font-bold text-indigo-400 tracking-wide"
      >
        🎯 InterviewPrep AI
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-slate-300 hover:text-indigo-400 transition text-sm font-medium"
        >
          Dashboard
        </Link>

        <Link
          to="/pinned"
          className="text-slate-300 hover:text-yellow-400 transition text-sm font-medium"
        >
          📌 Pinned
        </Link>

        <span className="text-slate-400 text-sm">
          Hi, {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}