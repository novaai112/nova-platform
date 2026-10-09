import React, { useState, useMemo } from 'react';
import { Search, X, Sliders, ArrowRight } from 'lucide-react';
import { PARAMETERS_CATALOG } from '../data/parametersCatalog.js';

export default function ParameterExplorerModal({ isOpen, onClose, onSelectArticle }) {
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');

  const allModules = useMemo(() => {
    const set = new Set();
    PARAMETERS_CATALOG.forEach(p => {
      p.modules.forEach(m => set.add(m));
    });
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredParams = useMemo(() => {
    return PARAMETERS_CATALOG.filter(p => {
      if (selectedModule !== 'All' && !p.modules.includes(selectedModule)) {
        return false;
      }
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.symbol.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q)
      );
    });
  }, [query, selectedModule]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Cross-Module Parameter Explorer
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Module Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cross-module parameters (e.g., pressure, thickness, diameter, moment)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-600 font-semibold shrink-0">Filter Module:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none font-mono cursor-pointer w-full sm:w-48 font-semibold shadow-2xs"
            >
              {allModules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredParams.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No parameters found matching "{query}"
            </div>
          ) : (
            filteredParams.map(param => (
              <div
                key={param.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {param.name}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      {param.symbol}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      {param.unit}
                    </span>
                    {param.typicalRange && (
                      <span className="text-[10px] text-slate-500 font-mono font-medium">
                        Range: {param.typicalRange}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {param.description}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Present in:</span>
                    {param.modules.map(mod => (
                      <span
                        key={mod}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {param.relatedSlug && (
                  <button
                    onClick={() => {
                      onSelectArticle(param.relatedSlug);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-50 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors shrink-0 self-start sm:self-center shadow-2xs"
                  >
                    <span>View Docs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
          <span>Showing {filteredParams.length} Indexed Engineering Parameters</span>
          <span>Unified Nova Dictionary</span>
        </div>
      </div>
    </div>
  );
}
