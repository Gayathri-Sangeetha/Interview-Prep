import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import SpinnerLoader from "../components/SpinnerLoader";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    role: "",
    experience: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/sessions", form);
      navigate(`/session/${res.data.session._id}`);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to create session"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;

    try {
      await axiosInstance.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Sessions</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Generate and review AI-powered interview Q&As
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
        >
          + New Session
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-5">
            Create Interview Session
          </h2>

          {errorMsg && (
            <div className="bg-red-950 border border-red-700 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
              ❌ {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Job Role"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Experience (years)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
              required
            />

            <textarea
              rows={3}
              placeholder="Additional Context (optional)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white text-sm resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
              >
                {creating ? "Generating..." : "Generate Questions"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <SpinnerLoader text="Loading sessions..." />
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg">No sessions yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex justify-between cursor-pointer"
              onClick={() => navigate(`/session/${session._id}`)}
            >
              <div>
                <h3 className="text-white font-semibold">
                  {session.role}
                </h3>
                <p className="text-slate-400 text-sm">
                  {session.experience} years
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(session._id);
                }}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}