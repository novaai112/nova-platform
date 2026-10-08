import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  Flame, 
  ShieldAlert,
  Zap
} from 'lucide-react';

/**
 * Premium Engineering Callout Box Component
 * Types: info, warning, note, important, caution, standard, example, pass, fail
 */
export default function CalloutBox({ type = 'info', title, children, standardRef }) {
  const configs = {
    info: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      text: 'text-blue-400',
      titleDefault: 'Engineering Information',
      icon: Info
    },
    note: {
      border: 'border-slate-500/30',
      bg: 'bg-slate-500/5',
      text: 'text-slate-300',
      titleDefault: 'Technical Note',
      icon: BookOpen
    },
    tip: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-400',
      titleDefault: 'Engineering Tip & Best Practice',
      icon: Zap
    },
    important: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-400',
      titleDefault: 'Important Code Requirement',
      icon: AlertTriangle
    },
    warning: {
      border: 'border-orange-500/40',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      titleDefault: 'Design Warning',
      icon: AlertTriangle
    },
    caution: {
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      titleDefault: 'Safety Critical Precaution',
      icon: ShieldAlert
    },
    standard: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      text: 'text-cyan-400',
      titleDefault: 'Applicable Standard Reference',
      icon: BookOpen
    },
    example: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      text: 'text-purple-400',
      titleDefault: 'Worked Numerical Example',
      icon: HelpCircle
    },
    pass: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      titleDefault: 'Code Compliance Verified (Pass)',
      icon: CheckCircle2
    },
    fail: {
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      titleDefault: 'Non-Compliance Detected (Exceeds Allowable)',
      icon: AlertCircle
    }
  };

  const current = configs[type] || configs.info;
  const IconComponent = current.icon;

  return (
    <div className={`my-5 rounded-xl border ${current.border} ${current.bg} p-4.5 backdrop-blur-sm transition-all duration-200 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${current.text}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <h4 className={`text-sm font-semibold tracking-wide uppercase ${current.text}`}>
              {title || current.titleDefault}
            </h4>
            {standardRef && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/20 text-slate-300 border border-white/10">
                {standardRef}
              </span>
            )}
          </div>
          <div className="text-sm leading-relaxed text-slate-300 font-normal space-y-2 prose-invert">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
