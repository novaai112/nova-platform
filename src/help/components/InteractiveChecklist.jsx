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
    <div className="my-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            {title || 'Engineering Verification & Sign-Off Checklist'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkAll}
            className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Check All
          </button>
          <button
            onClick={resetAll}
            className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={() => window.print()}
            className="px-2.5 py-1 text-xs rounded bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1"
          >
            <Printer className="w-3 h-3" /> Print
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between gap-4">
        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">
          {completed}/{total} Verified ({percent}%)
        </span>
      </div>

      {/* Checklist Items */}
      <div className="p-4 divide-y divide-white/5 space-y-2">
        {items.map((item, idx) => {
          const isChecked = !!checkedState[idx];
          const text = typeof item === 'string' ? item : item.text;
          const standard = typeof item === 'object' ? item.standard : null;

          return (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className="pt-2 first:pt-0 flex items-start gap-3 cursor-pointer group select-none"
            >
              <div className="mt-0.5 shrink-0 text-slate-400 group-hover:text-emerald-400 transition-colors">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <span className={`transition-colors ${isChecked ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-slate-100'}`}>
                  {text}
                </span>
                {standard && (
                  <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
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
