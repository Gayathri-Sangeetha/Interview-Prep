import React, { useState } from "react";//importing react
import { Link, useNavigate } from "react-router-dom";//link and useNavigate-for fats loading page and switching between pages
import axiosInstance from "../utils/axiosInstance"//for speaking with backend server
import { useAuth } from "../context/AuthContext.jsx";//state management-contextApi-globally sate variable
//below is a component
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
//from return is what the thing the thing the user sees
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-slate-400 text-center text-sm mb-8">
          Login to continue your interview prep
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-950 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}