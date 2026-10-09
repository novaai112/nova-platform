import React from 'react';
import { 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert,
  Zap
} from 'lucide-react';

/**
 * Clean White Engineering Callout Box Component
 * Types: info, warning, note, important, caution, standard, example, pass, fail
 */
export default function CalloutBox({ type = 'info', title, children, standardRef }) {
  const configs = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50/60',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
      titleDefault: 'Engineering Information',
      icon: Info
    },
    note: {
      border: 'border-slate-200',
      bg: 'bg-slate-50',
      text: 'text-slate-800',
      iconColor: 'text-slate-600',
      titleDefault: 'Technical Note',
      icon: BookOpen
    },
    tip: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/60',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-600',
      titleDefault: 'Engineering Tip & Best Practice',
      icon: Zap
    },
    important: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/60',
      text: 'text-amber-800',
      iconColor: 'text-amber-600',
      titleDefault: 'Important Code Requirement',
      icon: AlertTriangle
    },
    warning: {
      border: 'border-orange-200',
      bg: 'bg-orange-50/60',
      text: 'text-orange-900',
      iconColor: 'text-orange-600',
      titleDefault: 'Design Warning',
      icon: AlertTriangle
    },
    caution: {
      border: 'border-rose-200',
      bg: 'bg-rose-50/60',
      text: 'text-rose-900',
      iconColor: 'text-rose-600',
      titleDefault: 'Safety Critical Precaution',
      icon: ShieldAlert
    },
    standard: {
      border: 'border-cyan-200',
      bg: 'bg-cyan-50/60',
      text: 'text-cyan-900',
      iconColor: 'text-cyan-600',
      titleDefault: 'Applicable Standard Reference',
      icon: BookOpen
    },
    example: {
      border: 'border-purple-200',
      bg: 'bg-purple-50/60',
      text: 'text-purple-900',
      iconColor: 'text-purple-600',
      titleDefault: 'Worked Numerical Example',
      icon: HelpCircle
    },
    pass: {
      border: 'border-emerald-300',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      iconColor: 'text-emerald-600',
      titleDefault: 'Code Compliance Verified (Pass)',
      icon: CheckCircle2
    },
    fail: {
      border: 'border-rose-300',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      iconColor: 'text-rose-600',
      titleDefault: 'Non-Compliance Detected (Exceeds Allowable)',
      icon: AlertCircle
    }
  };

  const current = configs[type] || configs.info;
  const IconComponent = current.icon;

  return (
    <div 
      className={`my-5 rounded-xl border ${current.border} ${current.bg} p-4.5 transition-all duration-200 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${current.iconColor}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <h4 className={`text-sm font-bold tracking-wide uppercase ${current.text}`}>
              {title || current.titleDefault}
            </h4>
            {standardRef && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                {standardRef}
              </span>
            )}
          </div>
          <div className="text-sm leading-relaxed text-slate-700 font-normal space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
