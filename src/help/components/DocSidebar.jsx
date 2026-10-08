import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Bookmark, 
  Layers, 
  Command,
  X,
  Compass,
  Cpu,
  Activity,
  FileText
} from 'lucide-react';
import { DOC_CATEGORIES, getArticleById } from '../data/docArticles.js';

const ICON_MAP = {
  Compass,
  Layers,
  Cpu,
  Activity,
  FileText
};

export default function DocSidebar({
  currentArticleId,
  onSelectArticle,
  onOpenSearch,
  bookmarks = [],
  onToggleBookmark,
  isMobileOpen,
  onCloseMobile
}) {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_sidebar_expanded');
      return saved ? JSON.parse(saved) : { 'getting-started': true, 'analyses': true, 'software': true, 'materials': true, 'reference': true };
    } catch (e) {
      return { 'getting-started': true, 'analyses': true };
    }
  });

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => {
      const updated = { ...prev, [catId]: !prev[catId] };
      try {
        localStorage.setItem('nova_sidebar_expanded', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 lg:top-16 z-40 lg:z-10 h-screen lg:h-[calc(100vh-4rem)] w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 shadow-xs ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Top Mobile Bar */}
      <div className="lg:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Engineering Help Center
        </span>
        <button onClick={onCloseMobile} className="p-1 rounded text-slate-500 hover:text-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Global Quick Search Trigger */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/50">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
            <span className="font-medium">Search documentation...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-500 border border-slate-200">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Main Navigation Tree */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Bookmarks Section */}
        {bookmarks.length > 0 && (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
              <span>Bookmarks ({bookmarks.length})</span>
            </div>
            <div className="space-y-0.5 pl-2">
              {bookmarks.map(id => {
                const art = getArticleById(id);
                if (!art) return null;
                const isSelected = currentArticleId === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-xs truncate transition-colors ${
                      isSelected 
                        ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    ★ {art.title.replace(/:\s*.*$/, '')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories */}
        {DOC_CATEGORIES.map(category => {
          const isExpanded = !!expandedCategories[category.id];
          const IconComp = ICON_MAP[category.icon] || Layers;

          return (
            <div key={category.id} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <span>{category.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {category.articleIds.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                )}
              </button>

              {/* Sub-Articles List */}
              {isExpanded && (
                <div className="pl-3 space-y-0.5 border-l border-slate-200 ml-3.5 my-1">
                  {category.articleIds.map(articleId => {
                    const article = getArticleById(articleId);
                    if (!article) return null;
                    const isActive = currentArticleId === article.id || currentArticleId === article.slug;

                    return (
                      <button
                        key={article.id}
                        onClick={() => {
                          onSelectArticle(article.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className="truncate pr-1">{article.title.replace(/:\s*.*$/, '')}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>v2.4.0 Online</span>
        </span>
        <span>ASME BPVC 2023</span>
      </div>
    </aside>
  );
}
