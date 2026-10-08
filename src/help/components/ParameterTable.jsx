import React, { useState, useMemo } from 'react';
import { Search, Filter, Copy, Check, Info, AlertTriangle } from 'lucide-react';

export default function ParameterTable({ parameters = [], moduleName = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'required', 'optional'
  const [copiedSymbol, setCopiedSymbol] = useState(null);

  const filteredParams = useMemo(() => {
    return parameters.filter(param => {
      // Filter type
      if (filterType === 'required' && !param.required) return false;
      if (filterType === 'optional' && param.required) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const name = (param.name || '').toLowerCase();
      const symbol = (param.symbol || '').toLowerCase();
      const meaning = (param.meaning || '').toLowerCase();
      const unit = (param.unit || '').toLowerCase();

      return name.includes(query) || symbol.includes(query) || meaning.includes(query) || unit.includes(query);
    });
  }, [parameters, searchQuery, filterType]);

  const handleCopy = (symbol) => {
    navigator.clipboard.writeText(symbol);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  if (!parameters || parameters.length === 0) {
    return (
      <div className="p-6 text-center rounded-xl border border-white/5 bg-white/5 text-slate-400 text-sm">
        No parameter schema registered for this module.
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-lg">
      {/* Controls Header */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search parameter or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({parameters.length})
          </button>
          <button
            onClick={() => setFilterType('required')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              filterType === 'required'
                ? 'bg-amber-600/80 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            Required
          </button>
          <button
            onClick={() => setFilterType('optional')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              filterType === 'optional'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            Optional
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-950/90 backdrop-blur border-b border-white/10 z-10 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4 w-40">Parameter & Symbol</th>
              <th className="py-3 px-3 w-28">Unit</th>
              <th className="py-3 px-3 w-24">Required?</th>
              <th className="py-3 px-4">Engineering Meaning</th>
              <th className="py-3 px-4 w-56">Validation Rules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredParams.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No parameters matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredParams.map((param, index) => (
                <tr 
                  key={index}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Parameter & Symbol */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {param.name}
                    </div>
                    {param.symbol && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {param.symbol}
                        </span>
                        <button
                          onClick={() => handleCopy(param.symbol)}
                          title="Copy symbol"
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition-opacity p-0.5"
                        >
                          {copiedSymbol === param.symbol ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Unit */}
                  <td className="py-3 px-3 align-top">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-amber-400/20">
                      {param.unit || '—'}
                    </span>
                  </td>

                  {/* Required Badge */}
                  <td className="py-3 px-3 align-top">
                    {param.required ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-white/5">
                        Optional
                      </span>
                    )}
                  </td>

                  {/* Meaning & Context */}
                  <td className="py-3 px-4 align-top leading-relaxed text-slate-300">
                    <div>{param.meaning}</div>
                    {param.commonMistake && (
                      <div className="mt-1.5 text-[11px] text-rose-300/90 flex items-start gap-1 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-rose-400" />
                        <span><strong>Watch out:</strong> {param.commonMistake}</span>
                      </div>
                    )}
                  </td>

                  {/* Validation Rules */}
                  <td className="py-3 px-4 align-top text-slate-400 font-mono text-[11px]">
                    <div className="bg-black/30 p-2 rounded border border-white/5 text-slate-300 leading-normal">
                      {param.validation || 'Must be a positive engineering quantity'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-2.5 px-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Showing {filteredParams.length} of {parameters.length} parameters for {moduleName || 'module'}
        </span>
        <span className="hidden sm:inline">
          Click symbol to copy to clipboard
        </span>
      </div>
    </div>
  );
}
