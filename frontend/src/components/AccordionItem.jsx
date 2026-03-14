import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AccordionItem({ question, onPinToggle }) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const handleExplain = async () => {
    if (explanation) return;

    setLoadingExplain(true);
    try {
      const res = await axiosInstance.post("/questions/explain", {
        concept: question.question,
      });

      setExplanation(res.data.explanation);
    } catch {
      setExplanation("Failed to get explanation.");
    } finally {
      setLoadingExplain(false);
    }
  };

  const handlePin = async () => {
    try {
      const res = await axiosInstance.patch(
        `/questions/${question._id}/pin`
      );
      onPinToggle(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden mb-4">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="text-slate-100 font-medium text-sm leading-relaxed pr-4">
          {question.question}
        </span>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePin();
            }}
            className={`text-lg transition ${
              question.isPinned
                ? "text-yellow-400"
                : "text-slate-500 hover:text-yellow-400"
            }`}
            title={question.isPinned ? "Unpin" : "Pin"}
          >
            📌
          </button>

          <span
            className={`text-slate-400 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-700 px-5 py-4 bg-slate-900">
          <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {question.answer}
          </p>

          {!explanation ? (
            <button
              onClick={handleExplain}
              disabled={loadingExplain}
              className="text-xs bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              {loadingExplain
                ? "Getting AI Explanation..."
                : "✨ Get AI Explanation"}
            </button>
          ) : (
            <div className="mt-3 bg-indigo-950 border border-indigo-700 rounded-lg p-4">
              <p className="text-indigo-300 text-xs font-semibold mb-2">
                ✨ AI Explanation
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}