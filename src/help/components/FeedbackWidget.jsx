import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function FeedbackWidget({ articleId }) {
  const [voted, setVoted] = useState(null); // 'yes', 'no'
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
    <div className="my-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center space-y-4 shadow-lg backdrop-blur-sm">
      {!voted ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200">
            Was this engineering documentation helpful?
          </h4>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleVote('yes')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30 border border-white/10 text-xs font-semibold text-slate-300 transition-all"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span>Yes, it was clear</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-white/10 text-xs font-semibold text-slate-300 transition-all"
            >
              <ThumbsDown className="w-4 h-4 text-rose-400" />
              <span>Could be improved</span>
            </button>
          </div>
        </div>
      ) : submitted ? (
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold py-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Thank you! Your engineering feedback has been received.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="max-w-md mx-auto space-y-3 animate-fadeIn">
          <div className="text-xs text-slate-300 flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>How can we improve this article? (Formulas, parameters, diagrams...)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your technical suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-white/15 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
