import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function FeedbackWidget({ articleId }) {
  const [voted, setVoted] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (type) => {
    setVoted(type);
    try {
      localStorage.setItem(`nova_feedback_${articleId}`, type);
    } catch (e) {}
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitted(true);
    try {
      localStorage.setItem(`nova_comment_${articleId}`, comment);
    } catch (e) {}
  };

  return (
    <div 
      className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center space-y-4 shadow-2xs"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {!voted ? (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800">
            Was this engineering documentation helpful?
          </h4>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleVote('yes')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-2xs"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>Yes, it was clear</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-2xs"
            >
              <ThumbsDown className="w-4 h-4 text-rose-600" />
              <span>Could be improved</span>
            </button>
          </div>
        </div>
      ) : submitted ? (
        <div className="flex items-center justify-center gap-2 text-emerald-700 text-xs font-bold py-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Thank you! Your engineering feedback has been received.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="max-w-md mx-auto space-y-3 animate-fadeIn">
          <div className="text-xs text-slate-700 font-medium flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>How can we improve this article? (Formulas, parameters, diagrams...)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your technical suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
