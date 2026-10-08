import React, { useState } from 'react';
import { 
  Share2, 
  Bookmark, 
  Printer, 
  Check, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sliders,
  ChevronRight,
  BookOpen
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
    <header className="mb-8 pb-6 border-b border-white/10 space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto whitespace-nowrap">
        <span className="hover:text-slate-200 transition-colors">Engineering Documentation</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-slate-400">{article.category || 'Analysis'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-blue-400 font-semibold truncate">{article.title.replace(/:\s*.*$/, '')}</span>
      </nav>

      {/* Main Title & Action Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-snug">
            {article.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            {article.summary}
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopyLink}
            title="Copy deep link"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleBookmark(article.id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            title="Print documentation"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata Pill Strip & Technical Depth Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Difficulty Badge */}
          <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
            article.difficulty === 'Advanced' 
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
              : article.difficulty === 'Intermediate'
              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          }`}>
            {article.difficulty || 'Intermediate'}
          </span>

          {/* Reading Time */}
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            {article.readingTime || '15 min read'}
          </span>

          {/* Software Version */}
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5 font-mono text-[11px]">
            {article.version || article.softwareVersion || 'Nova v2.4.0'}
          </span>

          {/* Standard References */}
          {standards.map((std, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[11px]">
              <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
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
