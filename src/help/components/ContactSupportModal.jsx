import React, { useState } from 'react';
import { X, Send, LifeBuoy, CheckCircle2 } from 'lucide-react';

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Submit Engineering Inquiry or Technical Ticket
            </h3>
          </div>
          <button 
            onClick={handleReset}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicket ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Inquiry Logged Successfully</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your ticket has been routed to our pressure equipment specialist team.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-blue-700 font-bold">
              Ticket ID: <strong>{submittedTicket}</strong>
            </div>
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Context Badge */}
            {currentArticle && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between">
                <span>Article Context: <strong>{currentArticle.title}</strong></span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">Nova v2.4.0</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Inquiry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
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
                <label className="block text-slate-700 mb-1 font-bold">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nozzle WRC 537 shear stress"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Error Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ERR_NOZZLE_LIMIT_02"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Technical Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your design parameters, observed calculation behavior, or technical question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Confidentiality Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] text-slate-600">
              <input
                type="checkbox"
                required
                checked={anonymized}
                onChange={(e) => setAnonymized(e.target.checked)}
                className="mt-0.5 rounded accent-blue-600"
              />
              <span>
                I confirm that no proprietary plant CAD models or confidential client specifications are disclosed in this submission.
              </span>
            </label>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!anonymized || !description.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
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
