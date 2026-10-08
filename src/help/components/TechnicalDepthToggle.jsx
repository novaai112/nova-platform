import React from 'react';
import { Sparkles, Wrench, GraduationCap } from 'lucide-react';

export default function TechnicalDepthToggle({ depth = 'engineer', onChange }) {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Concept & Analogy', icon: Sparkles },
    { id: 'engineer', label: 'Engineer', desc: 'Code Formulas & Procedures', icon: Wrench },
    { id: 'expert', label: 'Expert', desc: 'Continuum & Nonlinear FEA', icon: GraduationCap }
  ];

  return (
    <div 
      className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {levels.map(lvl => {
        const IconComp = lvl.icon;
        const isActive = depth === lvl.id;

        return (
          <button
            key={lvl.id}
            onClick={() => onChange(lvl.id)}
            title={lvl.desc}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>{lvl.label}</span>
          </button>
        );
      })}
    </div>
  );
}
