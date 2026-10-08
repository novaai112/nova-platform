import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight, 
  History, 
  FileText
} from 'lucide-react';
import { searchDocumentation } from '../data/docArticles.js';
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

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    const matchedArticles = searchDocumentation(q).slice(0, 6).map(art => ({
      type: 'article',
      id: art.id,
      title: art.title,
      subtitle: `${art.category} • ${art.discipline || 'General'}`,
      badge: art.difficulty,
      icon: BookOpen,
      data: art
    }));

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
      onSelectArticle('engineering-validation');
      onClose();
    } else if (item.type === 'glossary') {
      onSelectArticle('getting-started');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation, parameters, standards, error codes, formulas... (e.g. WRC 537, squirm, UCS-66)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-700 font-bold border border-slate-300">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {query.trim() === '' ? (
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Recent Engineering Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.sub}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No engineering documentation matching <span className="text-slate-800 font-bold">"{query}"</span>.
              <div className="mt-1 text-[11px] text-slate-400">
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
                    isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] border border-slate-200 font-bold">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] border border-slate-200 font-bold">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] border border-slate-200 font-bold">Enter</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-[10px] border border-slate-200 font-bold">Esc</kbd> Close</span>
          </div>
          <span className="font-mono text-[10px] text-blue-700 font-bold">Nova Search v2.4</span>
        </div>
      </div>
    </div>
  );
}
