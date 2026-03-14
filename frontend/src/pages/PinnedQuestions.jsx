import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import AccordionItem from "../components/AccordionItem";
import SpinnerLoader from "../components/SpinnerLoader";

export default function PinnedQuestions() {
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinned = async () => {
      try {
        const res = await axiosInstance.get("/questions/pinned");
        setPinned(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPinned();
  }, []);

  const handlePinToggle = (updatedQuestion) => {
    setPinned((prev) =>
      updatedQuestion.isPinned
        ? prev.map((q) =>
            q._id === updatedQuestion._id ? updatedQuestion : q
          )
        : prev.filter((q) => q._id !== updatedQuestion._id)
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          📌 Pinned Questions
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Your saved important questions for quick review
        </p>
      </div>

      {loading ? (
        <SpinnerLoader text="Loading pinned questions..." />
      ) : pinned.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-4">📌</p>
          <p className="text-lg font-medium">
            No pinned questions
          </p>
          <p className="text-sm">
            Pin questions from your sessions for quick access
          </p>
        </div>
      ) : (
        <div>
          {pinned.map((q) => (
            <div key={q._id}>
              {q.session && (
                <p className="text-xs text-slate-500 mb-1 ml-1">
                  From: {q.session.role} · {q.session.experience}yr
                </p>
              )}
              <AccordionItem
                question={q}
                onPinToggle={handlePinToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}