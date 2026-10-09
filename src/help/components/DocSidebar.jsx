import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  X,
  LayoutDashboard,
  Compass,
  Cpu,
  Activity,
  FileText,
  Target,
  Waves,
  CircleDot,
  Thermometer,
  Cylinder,
  Flame,
  Layers3,
  Disc,
  Anchor,
  Box
} from 'lucide-react';
import { DOC_CATEGORIES, getArticleById } from '../data/docArticles.js';

const ICON_MAP = {
  Compass,
  Layers,
  Cpu,
  Activity,
  FileText
};

const ARTICLE_ICON_MAP = {
  'nozzle-analysis': Target,
  'bellows-analysis': Waves,
  'flange-analysis': CircleDot,
  'local-pwht': Thermometer,
  'saddle-analysis': Cylinder,
  'hot-box-analysis': Flame,
  'stiffener-analysis': Layers3,
  'tubesheet-analysis': Disc,
  'lug-analysis': Anchor,
  'trunnion-analysis': Box
};

const SHORT_ARTICLE_TITLES = {
  'getting-started': 'Start here',
  'website-overview': 'Platform overview',
  'dashboard-guide': 'Dashboard',
  'navigation-guide': 'Navigation',
  'units-conventions': 'Units & conventions',
  'analysis-comparison': 'Analysis matrix',
  'nozzle-analysis': 'Nozzle',
  'bellows-analysis': 'Bellows',
  'flange-analysis': 'Flange',
  'local-pwht': 'PWHT',
  'saddle-analysis': 'Saddle',
  'hot-box-analysis': 'Hot box',
  'stiffener-analysis': 'Stiffener',
  'tubesheet-analysis': 'Tubesheet',
  'lug-analysis': 'Lifting lug',
  'trunnion-analysis': 'Trunnion',
  'nova-website': 'Nova website',
  'ansys-act-wizard': 'Ansys ACT',
  'cad-ai': 'CAD generator',
  'asme-materials': 'ASME materials',
  'stress-strain': 'Stress-strain',
  'results-reports': 'Reports',
  'engineering-validation': 'Validation',
  'standards-references': 'Standards',
  'release-notes': 'Release notes',
  'contact-support': 'Contact',
  'analysis-input-guide': 'Input guide'
};

export default function DocSidebar({
  currentArticleId,
  onSelectArticle,
  isMobileOpen,
  onCloseMobile,
  onBackToDashboard
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
      className={`fixed lg:sticky top-0 z-40 lg:z-10 h-screen w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 shadow-xs ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Mobile Bar */}
      <div className="lg:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Nova Documentation
        </span>
        <button onClick={onCloseMobile} className="p-1 rounded text-slate-500 hover:text-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Tree */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
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
                    const ArticleIcon = ARTICLE_ICON_MAP[article.id] || FileText;

                    return (
                      <button
                        key={article.id}
                        onClick={() => {
                          onSelectArticle(article.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        title={article.title}
                        className={`w-full text-left py-2 px-2.5 rounded-lg text-xs transition-all duration-200 flex items-center justify-between group ${
                          isActive
                            ? 'nova-nav-active bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <ArticleIcon className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? 'nova-nav-icon-active text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`} />
                          <span className="truncate">{SHORT_ARTICLE_TITLES[article.id] || article.title.replace(/:\s*.*$/, '')}</span>
                        </span>
                        {isActive && (
                          <span className="nova-nav-indicator w-2 h-2 rounded-full bg-blue-600 shrink-0" />
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

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="nova-dashboard-link flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0 text-blue-700" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </aside>
  );
}
