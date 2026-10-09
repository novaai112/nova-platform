import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function DocHeader({ article }) {
  return (
    <header 
      className="mb-8 pb-6 border-b border-slate-200 space-y-4"
    >
      {/* Breadcrumb Navigation */}
      <nav className="nova-doc-breadcrumb flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap font-medium">
        <span className="hover:text-slate-800 transition-colors">Nova Documentation</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-600">{article.category || 'Analysis'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-blue-700 font-bold truncate">{article.title.replace(/:\s*.*$/, '')}</span>
      </nav>

      {/* Main Title */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {article.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {article.summary}
          </p>
        </div>
      </div>
    </header>
  );
}
