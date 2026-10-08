import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, RefreshCw, Printer, ShieldCheck } from 'lucide-react';

export default function InteractiveChecklist({ checklistId = 'default', title, items = [] }) {
  const storageKey = `nova_checklist_${checklistId}`;

  const [checkedState, setCheckedState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedState));
    } catch (e) {
      console.error(e);
    }
  }, [checkedState, storageKey]);

  const toggleItem = (idx) => {
    setCheckedState(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const checkAll = () => {
    const all = {};
    items.forEach((_, idx) => { all[idx] = true; });
    setCheckedState(all);
  };

  const resetAll = () => {
    setCheckedState({});
  };

  const total = items.length;
  const completed = items.filter((_, idx) => checkedState[idx]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div 
      className="my-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-800">
            {title || 'Engineering Verification & Sign-Off Checklist'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkAll}
            className="px-3 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs"
          >
            Check All
          </button>
          <button
            onClick={resetAll}
            className="px-3 py-1 text-xs rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold shadow-2xs"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 text-xs rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-1 font-bold shadow-2xs"
          >
            <Printer className="w-3 h-3" /> Print
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-mono text-emerald-800 font-bold shrink-0">
          {completed}/{total} Verified ({percent}%)
        </span>
      </div>

      {/* Checklist Items */}
      <div className="p-4 divide-y divide-slate-100 space-y-2">
        {items.map((item, idx) => {
          const isChecked = !!checkedState[idx];
          const text = typeof item === 'string' ? item : item.text;
          const standard = typeof item === 'object' ? item.standard : null;

          return (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className="pt-2.5 first:pt-0 flex items-start gap-3 cursor-pointer group select-none"
            >
              <div className="mt-0.5 shrink-0 text-slate-400 group-hover:text-emerald-600 transition-colors">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <span className={`transition-colors font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {text}
                </span>
                {standard && (
                  <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                    {standard}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
