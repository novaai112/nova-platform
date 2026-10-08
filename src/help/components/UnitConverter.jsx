import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator, Copy, Check, ShieldCheck } from 'lucide-react';
import { UNITS_DATA, convertUnit, CONSISTENT_UNIT_SYSTEMS } from '../data/unitsData.js';

export default function UnitConverter() {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('pressure');
  const [inputValue, setInputValue] = useState(100);
  const [fromUnit, setFromUnit] = useState('psi');
  const [toUnit, setToUnit] = useState('MPa');
  const [copied, setCopied] = useState(false);

  const category = UNITS_DATA[selectedCategoryKey] || UNITS_DATA.pressure;

  const handleCategoryChange = (key) => {
    setSelectedCategoryKey(key);
    const cat = UNITS_DATA[key];
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].symbol);
      setToUnit(cat.units[1].symbol);
    }
  };

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
    <div 
      className="my-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Interactive Engineering Units Center & Converter
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-medium">
          Verified NIST & ASME Constants
        </span>
      </div>

      {/* Category Pills */}
      <div className="p-3 bg-slate-100/50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
        {Object.entries(UNITS_DATA).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all font-semibold ${
              selectedCategoryKey === key
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
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
          <label className="text-xs text-slate-600 font-bold">Input Value & Source Unit</label>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-blue-500 focus-within:bg-white transition-all shadow-2xs">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-transparent text-slate-900 focus:outline-none font-mono font-medium"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-slate-100 text-slate-800 text-xs px-3 border-l border-slate-200 focus:outline-none font-mono cursor-pointer font-semibold"
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
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors hover:rotate-180 duration-300 shadow-2xs"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Converted Output & Target Unit */}
        <div className="md:col-span-3 space-y-2">
          <label className="text-xs text-slate-600 font-bold">Converted Result & Target Unit</label>
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden px-3.5 py-2 shadow-2xs">
            <div className="font-mono text-base font-bold text-amber-950 select-all truncate mr-2">
              {convertedResult}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-white text-slate-800 text-xs px-2.5 py-1 rounded border border-slate-200 focus:outline-none font-mono cursor-pointer font-semibold shadow-2xs"
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
                className="p-1.5 rounded hover:bg-amber-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consistent System Quick Cards */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Consistent Engineering Unit Systems in FEA & ASME Calculations:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
          {CONSISTENT_UNIT_SYSTEMS.map(sys => (
            <div key={sys.name} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
              <div className="font-bold text-blue-800">{sys.name}</div>
              <div className="text-slate-600">Length: <span className="text-slate-900 font-mono font-semibold">{sys.length}</span> | Force: <span className="text-slate-900 font-mono font-semibold">{sys.force}</span></div>
              <div className="text-slate-600">Stress: <span className="text-slate-900 font-mono font-semibold">{sys.stress}</span> | Mass: <span className="text-slate-900 font-mono font-semibold">{sys.mass}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
