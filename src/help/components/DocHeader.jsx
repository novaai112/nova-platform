import React, { useState } from 'react';
import { 
  Share2, 
  Bookmark, 
  Printer, 
  Check, 
  Clock, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import TechnicalDepthToggle from './TechnicalDepthToggle.jsx';

export default function DocHeader({
  article,
  depth,
  onDepthChange,
  isBookmarked,
  onToggleBookmark
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/help/${article.slug || article.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const standards = article.applicableStandards || (article.standard ? [article.standard] : []);

  return (
    <header 
      className="mb-8 pb-6 border-b border-slate-200 space-y-4"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap font-medium">
        <span className="hover:text-slate-800 transition-colors">Engineering Documentation</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-600">{article.category || 'Analysis'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-blue-700 font-bold truncate">{article.title.replace(/:\s*.*$/, '')}</span>
      </nav>

      {/* Main Title & Action Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {article.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {article.summary}
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            title="Copy deep link"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleBookmark(article.id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            className={`p-2 rounded-xl border transition-colors shadow-2xs ${
              isBookmarked
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            title="Print documentation"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata Pill Strip & Technical Depth Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Difficulty Badge */}
          <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
            article.difficulty === 'Advanced' 
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : article.difficulty === 'Intermediate'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {article.difficulty || 'Intermediate'}
          </span>

          {/* Reading Time */}
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px] font-medium">
            <Clock className="w-3 h-3 text-slate-500" />
            {article.readingTime || '15 min read'}
          </span>

          {/* Software Version */}
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px] font-medium">
            {article.version || article.softwareVersion || 'Nova v2.4.0'}
          </span>

          {/* Standard References */}
          {standards.map((std, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 font-mono text-[11px] font-medium">
              <ShieldCheck className="w-3 h-3 text-cyan-600 shrink-0" />
              <span className="truncate max-w-[200px]">{std}</span>
            </span>
          ))}
        </div>

        {/* Technical Depth Selector */}
        <div className="w-full sm:w-auto">
          <TechnicalDepthToggle depth={depth} onChange={onDepthChange} />
        </div>
      </div>
    </header>
  );
}
