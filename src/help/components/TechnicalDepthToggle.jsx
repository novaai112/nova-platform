import React from 'react';
import { Sparkles, Wrench, GraduationCap } from 'lucide-react';

export default function TechnicalDepthToggle({ depth = 'engineer', onChange }) {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Concept & Analogy', icon: Sparkles },
    { id: 'engineer', label: 'Engineer', desc: 'Code Formulas & Procedures', icon: Wrench },
    { id: 'expert', label: 'Expert', desc: 'Continuum & Nonlinear FEA', icon: GraduationCap }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
      {levels.map(lvl => {
        const IconComp = lvl.icon;
        const isActive = depth === lvl.id;

        return (
          <button
            key={lvl.id}
            onClick={() => onChange(lvl.id)}
            title={lvl.desc}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <IconComp className="w-3.5 h-3.5" />
            <span>{lvl.label}</span>
          </button>
        );
      })}
    </div>
  );
}
