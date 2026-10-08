import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator, Copy, Check, Info, ShieldCheck } from 'lucide-react';
import { UNITS_DATA, convertUnit, CONSISTENT_UNIT_SYSTEMS } from '../data/unitsData.js';

export default function UnitConverter() {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('pressure');
  const [inputValue, setInputValue] = useState(100);
  const [fromUnit, setFromUnit] = useState('psi');
  const [toUnit, setToUnit] = useState('MPa');
  const [copied, setCopied] = useState(false);

  const category = UNITS_DATA[selectedCategoryKey] || UNITS_DATA.pressure;

  // Handle category change
  const handleCategoryChange = (key) => {
    setSelectedCategoryKey(key);
    const cat = UNITS_DATA[key];
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].symbol);
      setToUnit(cat.units[1].symbol);
    }
  };

  // Compute conversion
  const convertedResult = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0.00';
    return convertUnit(val, fromUnit, toUnit, selectedCategoryKey);
  }, [inputValue, fromUnit, toUnit, selectedCategoryKey]);

  const handleCopyResult = () => {
    navigator.clipboard.writeText(`${convertedResult} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Interactive Engineering Units Center & Converter
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Verified NIST & ASME Constants
        </span>
      </div>

      {/* Category Pills */}
      <div className="p-3 bg-black/40 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-xs">
        {Object.entries(UNITS_DATA).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategoryKey === key
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Converter Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {/* Input Value & Source Unit */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-xs text-slate-400 font-medium">Input Value & Source Unit</label>
          <div className="flex rounded-xl border border-white/10 bg-slate-950/80 overflow-hidden focus-within:border-amber-500/50">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-transparent text-slate-100 focus:outline-none font-mono"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs px-3 border-l border-white/10 focus:outline-none font-mono cursor-pointer"
            >
              {category.units.map(u => (
                <option key={u.symbol} value={u.symbol}>
                  {u.symbol} ({u.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center py-1">
          <button
            onClick={handleSwap}
            title="Swap units"
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors hover:rotate-180 duration-300"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Converted Output & Target Unit */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-xs text-slate-400 font-medium">Converted Result & Target Unit</label>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 overflow-hidden px-3.5 py-2">
            <div className="font-mono text-base font-semibold text-amber-400 select-all truncate mr-2">
              {convertedResult}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs px-2.5 py-1 rounded border border-white/10 focus:outline-none font-mono cursor-pointer"
              >
                {category.units.map(u => (
                  <option key={u.symbol} value={u.symbol}>
                    {u.symbol} ({u.name})
                  </option>
                ))}
              </select>
              <button
                onClick={handleCopyResult}
                title="Copy result"
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consistent System Quick Cards */}
      <div className="p-4 bg-white/[0.02] border-t border-white/10">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          Consistent Engineering Unit Systems in FEA & ASME Calculations:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          {CONSISTENT_UNIT_SYSTEMS.map(sys => (
            <div key={sys.name} className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <div className="font-semibold text-blue-300">{sys.name}</div>
              <div className="text-slate-400">Length: <span className="text-slate-200 font-mono">{sys.length}</span> | Force: <span className="text-slate-200 font-mono">{sys.force}</span></div>
              <div className="text-slate-400">Stress: <span className="text-slate-200 font-mono">{sys.stress}</span> | Mass: <span className="text-slate-200 font-mono">{sys.mass}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
