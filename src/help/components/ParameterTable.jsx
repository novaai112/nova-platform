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
      <div 
        className="p-6 text-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
        style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
      >
        No parameter schema registered for this module.
      </div>
    );
  }

  return (
    <div 
      className="my-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/70">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search parameter or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({parameters.length})
          </button>
          <button
            onClick={() => setFilterType('required')}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
              filterType === 'required'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Required
          </button>
          <button
            onClick={() => setFilterType('optional')}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
              filterType === 'optional'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Optional
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10 text-slate-700 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3 px-4 w-44">Parameter & Symbol</th>
              <th className="py-3 px-3 w-28">Unit</th>
              <th className="py-3 px-3 w-24">Required?</th>
              <th className="py-3 px-4">Engineering Meaning</th>
              <th className="py-3 px-4 w-56">Validation Rules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredParams.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  No parameters matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredParams.map((param, index) => (
                <tr 
                  key={index}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* Parameter & Symbol */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {param.name}
                    </div>
                    {param.symbol && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          {param.symbol}
                        </span>
                        <button
                          onClick={() => handleCopy(param.symbol)}
                          title="Copy symbol"
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-opacity p-0.5"
                        >
                          {copiedSymbol === param.symbol ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Unit */}
                  <td className="py-3 px-3 align-top">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      {param.unit || '—'}
                    </span>
                  </td>

                  {/* Required Badge */}
                  <td className="py-3 px-3 align-top">
                    {param.required ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Optional
                      </span>
                    )}
                  </td>

                  {/* Meaning & Context */}
                  <td className="py-3 px-4 align-top leading-relaxed text-slate-700">
                    <div>{param.meaning}</div>
                    {param.commonMistake && (
                      <div className="mt-1.5 text-[11px] text-rose-800 flex items-start gap-1 bg-rose-50 p-1.5 rounded border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                        <span><strong>Watch out:</strong> {param.commonMistake}</span>
                      </div>
                    )}
                  </td>

                  {/* Validation Rules */}
                  <td className="py-3 px-4 align-top font-mono text-[11px]">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 leading-normal">
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
      <div className="p-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          Showing {filteredParams.length} of {parameters.length} parameters for {moduleName || 'module'}
        </span>
        <span className="hidden sm:inline text-slate-400">
          Click symbol to copy to clipboard
        </span>
      </div>
    </div>
  );
}
