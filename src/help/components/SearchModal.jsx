import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Sliders, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  History, 
  Layers,
  FileText
} from 'lucide-react';
import { DOC_ARTICLES, searchDocumentation } from '../data/docArticles.js';
import { ERROR_CODES } from '../data/troubleshootingData.js';
import { GLOSSARY_TERMS } from '../data/glossaryData.js';

export default function SearchModal({ isOpen, onClose, onSelectArticle }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_recent_searches');
      return saved ? JSON.parse(saved) : ['nozzle loads', 'bellows squirm', 'UCS-66 MDMT', 'WRC 537'];
    } catch (e) {
      return ['nozzle loads', 'bellows squirm'];
    }
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate results across articles, errors, and glossary
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    // 1. Matched Articles
    const matchedArticles = searchDocumentation(q).slice(0, 6).map(art => ({
      type: 'article',
      id: art.id,
      title: art.title,
      subtitle: `${art.category} • ${art.discipline || 'General'}`,
      badge: art.difficulty,
      icon: BookOpen,
      data: art
    }));

    // 2. Matched Error Codes
    const matchedErrors = ERROR_CODES.filter(err => 
      err.code.toLowerCase().includes(q) || 
      err.title.toLowerCase().includes(q) || 
      err.cause.toLowerCase().includes(q)
    ).slice(0, 3).map(err => ({
      type: 'error',
      id: err.code,
      title: `${err.code}: ${err.title}`,
      subtitle: err.cause,
      badge: 'Troubleshooting',
      icon: AlertTriangle,
      data: err
    }));

    // 3. Matched Glossary Terms
    const matchedGlossary = GLOSSARY_TERMS.filter(term =>
      term.term.toLowerCase().includes(q) ||
      term.definition.toLowerCase().includes(q)
    ).slice(0, 3).map(term => ({
      type: 'glossary',
      id: term.term,
      title: term.term,
      subtitle: term.definition,
      badge: term.codeRef || 'Glossary',
      icon: FileText,
      data: term
    }));

    return [...matchedArticles, ...matchedErrors, ...matchedGlossary];
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item) => {
    // Save to recents
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem('nova_recent_searches', JSON.stringify(updated));
      } catch (err) {}
    }

    if (item.type === 'article') {
      onSelectArticle(item.id);
      onClose();
    } else if (item.type === 'error') {
      onSelectArticle('engineering-validation'); // Navigate to troubleshooting/validation
      onClose();
    } else if (item.type === 'glossary') {
      onSelectArticle('getting-started');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation, parameters, standards, error codes, formulas... (e.g. WRC 537, squirm, UCS-66)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-400 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/5">
          {query.trim() === '' ? (
            /* Recents & Quick Links */
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Recent Engineering Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Analysis Chapters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'nozzle-analysis', title: 'Nozzle Analysis', sub: 'WRC 537 & UG-37' },
                    { id: 'bellows-analysis', title: 'Bellows Analysis', sub: 'EJMA 11th Edition' },
                    { id: 'flange-analysis', title: 'Flange Analysis', sub: 'ASME B16.5 & App 2' },
                    { id: 'stress-strain', title: 'Stress-Strain Curves', sub: 'ASME VIII-2 Annex 3-D' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectArticle(item.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.sub}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No engineering documentation matching <span className="text-slate-200 font-semibold">"{query}"</span>.
              <div className="mt-1 text-[11px] text-slate-500">
                Try searching for standard codes (ASME, EJMA, WRC), parameters (pressure, thickness), or error codes.
              </div>
            </div>
          ) : (
            results.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {item.title}
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Enter</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Esc</kbd> Close</span>
          </div>
          <span className="font-mono text-[10px] text-blue-400">Nova Search v2.4</span>
        </div>
      </div>
    </div>
  );
}
