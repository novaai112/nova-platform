import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Sliders, 
  Calculator, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ArrowUp,
  Shield,
  HelpCircle,
  Hash,
  Download
} from 'lucide-react';

// Help Center Data Imports
import { 
  DOC_CATEGORIES, 
  getArticleById, 
  getAdjacentArticles
} from './data/docArticles.js';

// Component Imports
import DocSidebar from './components/DocSidebar.jsx';
import DocHeader from './components/DocHeader.jsx';
import ArticleDeepContent, { ArticleText } from './components/ArticleDeepContent.jsx';
import ArticlePhoto from './components/ArticlePhoto.jsx';
import HtmlParameterReference from './components/HtmlParameterReference.jsx';
import DocTOC from './components/DocTOC.jsx';
import CalloutBox from './components/CalloutBox.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import InteractiveStressStrainGraph from './components/InteractiveStressStrainGraph.jsx';
import './nova-docs.css';

export default function NovaDocumentationCenter({ initialTopicId, onBackToDashboard, onMobileSwipeToCommunity, onMobileSwipeToProfile }) {
  // Navigation & Article State
  const [currentArticleId, setCurrentArticleId] = useState(initialTopicId || 'getting-started');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileCategoryId, setMobileCategoryId] = useState(() => (
    DOC_CATEGORIES.find(category => category.articleIds.includes(initialTopicId))?.id || DOC_CATEGORIES[0].id
  ));
  const [showMobileScrollTop, setShowMobileScrollTop] = useState(false);
  const mobileArticleSwipeStartRef = useRef(null);

  // Update current article if initialTopicId changes externally
  useEffect(() => {
    if (initialTopicId) {
      setCurrentArticleId(initialTopicId);
    }
  }, [initialTopicId]);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentArticleId]);

  const article = getArticleById(currentArticleId);
  const activeMobileCategory = DOC_CATEGORIES.find(category => category.id === mobileCategoryId) || DOC_CATEGORIES[0];
  const { prev: prevArticle, next: nextArticle } = getAdjacentArticles(currentArticleId);

  const handleArticleTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, textarea, select, summary, [contenteditable="true"], .overflow-x-auto')) return;
    mobileArticleSwipeStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const handleArticleTouchEnd = (event) => {
    const start = mobileArticleSwipeStartRef.current;
    mobileArticleSwipeStartRef.current = null;
    if (!start || event.changedTouches.length !== 1 || window.innerWidth >= 768) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 85 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    if (dx < 0) {
      if (nextArticle) setCurrentArticleId(nextArticle.id);
      else onMobileSwipeToProfile?.();
    } else if (prevArticle) {
      setCurrentArticleId(prevArticle.id);
    } else {
      onMobileSwipeToCommunity?.();
    }
  };

  useEffect(() => {
    const activeCategory = DOC_CATEGORIES.find(category => category.articleIds.includes(article.id));
    if (activeCategory) setMobileCategoryId(activeCategory.id);
  }, [article.id]);

  useEffect(() => {
    const updateScrollTopVisibility = () => {
      setShowMobileScrollTop(window.scrollY > Math.max(400, window.innerHeight * 0.65));
    };
    updateScrollTopVisibility();
    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollTopVisibility);
  }, []);

  return (
    <div 
      className="nova-docs min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900"
    >
      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex items-start">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed bottom-5 left-5 z-30 lg:hidden p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Left Sticky Sidebar */}
        <DocSidebar
          currentArticleId={article.id}
          onSelectArticle={(id) => setCurrentArticleId(id)}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onBackToDashboard={onBackToDashboard}
        />

        {/* Center Main Documentation Body */}
        <main
          key={article.id}
          className="nova-article-enter flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto"
          onTouchStart={handleArticleTouchStart}
          onTouchEnd={handleArticleTouchEnd}
        >
          <nav className="nova-mobile-category-filter" aria-label="Documentation categories">
            <div className="nova-mobile-category-row">
              {DOC_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setMobileCategoryId(category.id)}
                  className={`nova-mobile-category-chip ${mobileCategoryId === category.id ? 'is-active' : ''}`}
                  aria-pressed={mobileCategoryId === category.id}
                >
                  <span>{category.title}</span>
                  <span className="nova-mobile-category-count">{category.articleIds.length}</span>
                </button>
              ))}
            </div>
            <div className="nova-mobile-article-row" aria-label={`${activeMobileCategory.title} articles`}>
              {activeMobileCategory.articleIds.map(articleId => {
                const categoryArticle = getArticleById(articleId);
                if (!categoryArticle) return null;
                const shortTitle = categoryArticle.title.replace(/:\s*.*$/, '');
                return (
                  <button
                    key={categoryArticle.id}
                    type="button"
                    onClick={() => setCurrentArticleId(categoryArticle.id)}
                    className={`nova-mobile-article-chip ${article.id === categoryArticle.id ? 'is-active' : ''}`}
                    aria-current={article.id === categoryArticle.id ? 'page' : undefined}
                    title={categoryArticle.title}
                  >
                    {shortTitle}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Article Header */}
          <DocHeader article={article} />

          {article.id !== 'analysis-input-guide' && <ArticlePhoto articleId={article.id} />}
          {article.id === 'analysis-input-guide' && <HtmlParameterReference />}

          {/* Special Interactive Tools Embedded in Context */}
          {article.id === 'stress-strain' && (
            <InteractiveStressStrainGraph />
          )}

          {article.id === 'units-conventions' && (
            <UnitConverter />
          )}

          {/* Article Structured Sections */}
          <div className="space-y-8 my-8 text-slate-700">
            {article.overview && (
              <section id="overview" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">1.</span> Overview & Purpose
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 space-y-3">
                  <ArticleText text={article.overview} />
                  {article.purpose && (
                    <CalloutBox type="info" title="Primary Engineering Objective">
                      <ArticleText text={article.purpose} />
                    </CalloutBox>
                  )}
                </div>
              </section>
            )}

            {article.whyRequired && (
              <section id="why-required" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">2.</span> Why This Analysis Is Required
                </h2>
                <div className="text-sm leading-relaxed text-slate-700">
                  <ArticleText text={article.whyRequired} />
                </div>
              </section>
            )}

            {/* When to Use vs When Not to Use */}
            {(article.whenToUse || article.whenNotToUse) && (
              <section id="application-scope" className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">3.</span> Application Scope & Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.whenToUse && (
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended Applications
                      </div>
                      {Array.isArray(article.whenToUse) ? (
                        <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-slate-700">
                          {article.whenToUse.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      ) : <ArticleText text={article.whenToUse} />}
                    </div>
                  )}
                  {article.whenNotToUse && (
                    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> Prohibited / Beyond Scope
                      </div>
                      {Array.isArray(article.whenNotToUse) ? (
                        <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-slate-700">
                          {article.whenNotToUse.map(item => <li key={item}>{item}</li>)}
                        </ul>
                      ) : <ArticleText text={article.whenNotToUse} />}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* General Content Sections Array */}
            {article.sections && article.sections.map(sec => (
              <section key={sec.id} id={sec.id} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {sec.title.replace(/^[0-9]+\.\s*/, '')}
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line space-y-3">
                  <ArticleText text={sec.content} />
                </div>
              </section>
            ))}

            <ArticleDeepContent article={article} />

            {/* Input fields are sourced from the actual public analysis HTML forms. */}
            {article.parameters && article.parameters.length > 0 && (
              <section id="parameters" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" /> Input parameters used by this analysis
                </h2>
                <p className="text-xs text-slate-500">
                  Field names, labels, units, and configuration choices below are loaded from the module’s HTML form:
                </p>
                <HtmlParameterReference moduleId={article.id} />
              </section>
            )}

            {/* Common Mistakes */}
            {article.commonMistakes && article.commonMistakes.length > 0 && (
              <section id="common-mistakes" className="space-y-3">
                <CalloutBox type="warning" title="Common Engineering Pitfalls & Oversight">
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700">
                    {article.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </CalloutBox>
              </section>
            )}

            {/* Module FAQs */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faqs" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600" /> Frequently Asked Questions
                </h2>
                <div className="space-y-2.5">
                  {article.faqs.map((faq, idx) => (
                    <details 
                      key={idx} 
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 group open:bg-white open:border-slate-300 transition-colors shadow-2xs"
                    >
                      <summary className="font-semibold text-xs text-slate-900 cursor-pointer list-none flex items-center justify-between">
                        <span>{faq.q}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-2.5 border-t border-slate-200 pt-2.5 text-xs leading-relaxed text-slate-700">
                        <ArticleText text={faq.a} />
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Standards & References */}
            {article.references && article.references.length > 0 && (
              <section id="references" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-700" /> Authoritative Standards & Code References
                </h2>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {article.references.map((ref, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-cyan-800 mr-2">[{ref.source}]</span>
                        <span className="text-slate-800 font-medium">{ref.title}</span>
                        {ref.edition && (
                          <span className="ml-2 font-mono text-[10px] text-slate-500">({ref.edition})</span>
                        )}
                      </div>
                      {ref.link && ref.link !== '#' && (
                        <a 
                          href={ref.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-600 p-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sequential Reading Navigation Footer */}
          <nav aria-label="Adjacent documentation" className="nova-article-navigation my-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
            {prevArticle ? (
              <button
                onClick={() => setCurrentArticleId(prevArticle.id)}
                className="nova-article-nav-button group flex min-h-20 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="nova-article-nav-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:border-blue-200 group-hover:bg-white group-hover:text-blue-700">
                  <ChevronLeft className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="nova-article-nav-label text-[10px] font-semibold uppercase tracking-wider text-slate-500">Previous</div>
                  <div className="nova-article-nav-title mt-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                    {prevArticle.title.replace(/:\s*.*$/, '')}
                  </div>
                </div>
              </button>
            ) : <div />}

            {nextArticle && (
              <button
                onClick={() => setCurrentArticleId(nextArticle.id)}
                className="nova-article-nav-button group flex min-h-20 w-full items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-right"
              >
                <div className="min-w-0 flex-1 sm:order-1">
                  <div className="nova-article-nav-label text-[10px] font-semibold uppercase tracking-wider text-blue-700">Next</div>
                  <div className="nova-article-nav-title mt-1 truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                    {nextArticle.title.replace(/:\s*.*$/, '')}
                  </div>
                </div>
                <div className="nova-article-nav-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700 transition-transform group-hover:translate-x-1 sm:order-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            )}
          </nav>

        </main>

        {/* Right Sticky Table of Contents (Desktop) */}
        <div className="hidden xl:block w-64 shrink-0 sticky top-20 p-6 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
          <DocTOC
            sections={article.sections || [
              { id: 'overview', title: '1. Overview' },
              { id: 'why-required', title: '2. Why Required' },
              { id: 'parameters', title: '3. Parameters' },
              { id: 'workflow', title: '4. Workflow' },
              { id: 'example', title: '5. Example' },
              { id: 'faqs', title: '6. FAQs' },
              { id: 'references', title: '7. References' }
            ]}
          />
        </div>
      </div>

      <button
        type="button"
        className={`nova-mobile-scroll-top ${showMobileScrollTop ? 'is-visible' : ''}`}
        aria-label="Go to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        tabIndex={showMobileScrollTop ? 0 : -1}
      >
        <ArrowUp aria-hidden="true" />
        <span>Top</span>
      </button>
    </div>
  );
}
