import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import AccordionItem from "../components/AccordionItem";
import SpinnerLoader from "../components/SpinnerLoader";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axiosInstance.get(`/sessions/${id}`);
        setSession(res.data);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handlePinToggle = (updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === updatedQuestion._id ? updatedQuestion : q
      )
    );
  };

  if (loading)
    return <SpinnerLoader text="Loading session..." />;

  if (!session)
    return (
      <div className="text-center text-slate-400 py-20">
        Session not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-slate-400 hover:text-white text-sm mb-6 transition"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {session.role}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {session.experience} years experience
            </p>
            {session.description && (
              <p className="text-slate-500 text-sm mt-1">
                {session.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
              {questions.length} Questions
            </span>
          </div>
        </div>
      </div>

      <div>
        {questions.map((q) => (
          <AccordionItem
            key={q._id}
            question={q}
            onPinToggle={handlePinToggle}
          />
        ))}
      </div>
    </div>
  );
}