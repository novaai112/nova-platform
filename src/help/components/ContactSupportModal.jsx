import React, { useState } from 'react';
import { X, Send, LifeBuoy, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

export default function ContactSupportModal({ isOpen, onClose, currentArticle }) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Calculation Anomaly');
  const [errorCode, setErrorCode] = useState('');
  const [description, setDescription] = useState('');
  const [anonymized, setAnonymized] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !anonymized) return;

    const ticketId = `TICK-NOV-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setSubject('');
    setErrorCode('');
    setDescription('');
    setAnonymized(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Submit Engineering Inquiry or Technical Ticket
            </h3>
          </div>
          <button 
            onClick={handleReset}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicket ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Inquiry Logged Successfully</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your ticket has been routed to our pressure equipment specialist team.
              </p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-blue-300">
              Ticket ID: <strong>{submittedTicket}</strong>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Context Badge */}
            {currentArticle && (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center justify-between">
                <span>Article Context: <strong>{currentArticle.title}</strong></span>
                <span className="font-mono text-[10px] text-slate-400">Nova v2.4.0</span>
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Inquiry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Calculation Anomaly">Calculation Anomaly / Code Formula Inquiry</option>
                <option value="Software Bug">Software Exception / UI Bug</option>
                <option value="Missing Material">Missing ASME Material Request</option>
                <option value="ANSYS ACT Extension">ANSYS ACT Extension Loading Issue</option>
                <option value="Feature Request">New Module or Feature Request</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nozzle WRC 537 shear stress"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Error Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ERR_NOZZLE_LIMIT_02"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Technical Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your design parameters, observed calculation behavior, or technical question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Confidentiality Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-slate-400">
              <input
                type="checkbox"
                required
                checked={anonymized}
                onChange={(e) => setAnonymized(e.target.checked)}
                className="mt-0.5 rounded accent-blue-500"
              />
              <span>
                I confirm that no proprietary plant CAD models or confidential client specifications are disclosed in this submission.
              </span>
            </label>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!anonymized || !description.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
