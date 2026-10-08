import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  ArrowLeft, 
  Sliders, 
  Calculator, 
  Layers, 
  Image as ImageIcon, 
  LifeBuoy, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  ArrowRight,
  Shield,
  HelpCircle,
  Hash,
  Download
} from 'lucide-react';

// Help Center Data Imports
import { 
  DOC_ARTICLES, 
  DOC_CATEGORIES, 
  getArticleById, 
  getAdjacentArticles, 
  getRelatedArticles 
} from './data/docArticles.js';
import { UNITS_DATA } from './data/unitsData.js';
import { GLOSSARY_TERMS } from './data/glossaryData.js';
import { ERROR_CODES } from './data/troubleshootingData.js';
import { CAPABILITY_MATRIX } from './data/capabilityMatrixData.js';
import { PARAMETERS_CATALOG } from './data/parametersCatalog.js';

// Component Imports
import DocSidebar from './components/DocSidebar.jsx';
import DocHeader from './components/DocHeader.jsx';
import DocTOC from './components/DocTOC.jsx';
import CalloutBox from './components/CalloutBox.jsx';
import ParameterTable from './components/ParameterTable.jsx';
import EngineeringDiagram from './components/EngineeringDiagram.jsx';
import UnitConverter from './components/UnitConverter.jsx';
import InteractiveStressStrainGraph from './components/InteractiveStressStrainGraph.jsx';
import InteractiveChecklist from './components/InteractiveChecklist.jsx';
import SearchModal from './components/SearchModal.jsx';
import ImageSearchModal from './components/ImageSearchModal.jsx';
import ParameterExplorerModal from './components/ParameterExplorerModal.jsx';
import CapabilityMatrixModal from './components/CapabilityMatrixModal.jsx';
import ContactSupportModal from './components/ContactSupportModal.jsx';
import FeedbackWidget from './components/FeedbackWidget.jsx';

export default function NovaDocumentationCenter({ initialTopicId, onNavigateBack }) {
  // Navigation & Article State
  const [currentArticleId, setCurrentArticleId] = useState(initialTopicId || 'getting-started');
  const [technicalDepth, setTechnicalDepth] = useState('engineer'); // 'beginner', 'engineer', 'expert'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [paramExplorerOpen, setParamExplorerOpen] = useState(false);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_doc_bookmarks');
      return saved ? JSON.parse(saved) : ['nozzle-analysis', 'asme-materials', 'units-conventions'];
    } catch (e) {
      return ['nozzle-analysis', 'asme-materials'];
    }
  });

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      try {
        localStorage.setItem('nova_doc_bookmarks', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const article = getArticleById(currentArticleId);
  const { prev: prevArticle, next: nextArticle } = getAdjacentArticles(currentArticleId);
  const relatedArticles = getRelatedArticles(currentArticleId, 3);

  // Map module to diagram type if applicable
  const getDiagramType = (id) => {
    if (id.includes('nozzle')) return 'nozzle';
    if (id.includes('bellow')) return 'bellows';
    if (id.includes('flange')) return 'flange';
    if (id.includes('saddle')) return 'saddle';
    return null;
  };

  const diagramType = getDiagramType(article.id);

  return (
    <div 
      className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      {/* Top Professional Engineering Header Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back to Application Button */}
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </button>
          )}

          {/* Logo & Platform Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="font-mono font-black text-white text-sm">N</span>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>NOVA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  DOCS
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
                Engineering Knowledge & Verification Center
              </div>
            </div>
          </div>
        </div>

        {/* Global Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 text-xs text-slate-600 hover:text-slate-900 hover:border-blue-400 transition-all shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden sm:inline px-1 py-0.5 rounded bg-slate-200/80 font-mono text-[9px] text-slate-600 border border-slate-300">
              Ctrl+K
            </kbd>
          </button>

          {/* Parameter Explorer Trigger */}
          <button
            onClick={() => setParamExplorerOpen(true)}
            title="Parameter Explorer"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-amber-700 transition-colors hidden sm:flex items-center gap-1 text-xs"
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span className="hidden xl:inline">Parameters</span>
          </button>

          {/* Capability Matrix Trigger */}
          <button
            onClick={() => setMatrixModalOpen(true)}
            title="Module Capability Matrix"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-700 transition-colors hidden sm:flex items-center gap-1 text-xs"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline">Matrix</span>
          </button>

          {/* Schematics Explorer Trigger */}
          <button
            onClick={() => setImageModalOpen(true)}
            title="Engineering Schematics & Images"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-purple-700 transition-colors hidden sm:flex items-center gap-1 text-xs"
          >
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span className="hidden xl:inline">Schematics</span>
          </button>

          {/* Contact Support Trigger */}
          <button
            onClick={() => setSupportModalOpen(true)}
            title="Technical Support & Inquiry"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex items-start">
        {/* Left Sticky Sidebar */}
        <DocSidebar
          currentArticleId={article.id}
          onSelectArticle={(id) => setCurrentArticleId(id)}
          onOpenSearch={() => setSearchModalOpen(true)}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Center Main Documentation Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto">
          {/* Article Header */}
          <DocHeader
            article={article}
            depth={technicalDepth}
            onDepthChange={setTechnicalDepth}
            isBookmarked={bookmarks.includes(article.id)}
            onToggleBookmark={toggleBookmark}
          />

          {/* Technical Depth Dynamic Callout Banner */}
          {article.depthContent && (
            <div className="my-6 p-4 rounded-xl border border-blue-200 bg-blue-50/70">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                <span>Active Reading View: {technicalDepth.toUpperCase()} PERSPECTIVE</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {article.depthContent[technicalDepth]}
              </p>
            </div>
          )}

          {/* Primary Engineering Diagram (if applicable) */}
          {diagramType && (
            <EngineeringDiagram 
              type={diagramType} 
              caption={`Dimensional schematic and load conventions for ${article.title.replace(/:\s*.*$/, '')}.`}
            />
          )}

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
                  <p>{article.overview}</p>
                  {article.purpose && (
                    <CalloutBox type="info" title="Primary Engineering Objective">
                      {article.purpose}
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
                  <p>{article.whyRequired}</p>
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
                      <p className="text-xs text-slate-700 leading-relaxed">{article.whenToUse}</p>
                    </div>
                  )}
                  {article.whenNotToUse && (
                    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> Prohibited / Beyond Scope
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{article.whenNotToUse}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* General Content Sections Array */}
            {article.sections && article.sections.map((sec, idx) => (
              <section key={sec.id} id={sec.id} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">{idx + 4}.</span> {sec.title.replace(/^[0-9]+\.\s*/, '')}
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line space-y-3">
                  {sec.content}
                </div>
              </section>
            ))}

            {/* Parameter-by-Parameter Interactive Table */}
            {article.parameters && article.parameters.length > 0 && (
              <section id="parameters" className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" /> Parameter-by-Parameter Reference
                </h2>
                <p className="text-xs text-slate-500">
                  Search, filter, and inspect input definitions, units, symbols, and validation bounds:
                </p>
                <ParameterTable parameters={article.parameters} moduleName={article.title} />
              </section>
            )}

            {/* Step-by-Step Engineering Workflow */}
            {article.workflow && article.workflow.length > 0 && (
              <section id="workflow" className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">Step-by-Step</span> Recommended Engineering Procedure
                </h2>
                <div className="space-y-2.5">
                  {article.workflow.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs leading-relaxed"
                    >
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 text-slate-800">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Worked Numerical Example */}
            {article.example && (
              <section id="example" className="space-y-3">
                <CalloutBox type="example" title={`Worked Verification Benchmark: ${article.title.replace(/:\s*.*$/, '')}`}>
                  <div className="space-y-2 text-xs">
                    <div><strong>Design Condition:</strong> {article.example.problem}</div>
                    <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 font-mono text-[11px] text-blue-900">
                      {article.example.inputs}
                    </div>
                    <div className="text-slate-800"><strong>Calculated Result:</strong> {article.example.result}</div>
                    <div className="text-emerald-700 font-medium"><strong>Governing Verification:</strong> {article.example.interpretation}</div>
                  </div>
                </CalloutBox>
              </section>
            )}

            {/* Verification Checklist */}
            {article.checklist && article.checklist.length > 0 && (
              <section id="checklist" className="space-y-3">
                <InteractiveChecklist 
                  checklistId={article.id} 
                  title={`${article.title.replace(/:\s*.*$/, '')} Quality Sign-Off Checklist`}
                  items={article.checklist}
                />
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
                      <p className="mt-2.5 text-xs text-slate-700 leading-relaxed border-t border-slate-200 pt-2.5">
                        {faq.a}
                      </p>
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
          <div className="my-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevArticle ? (
              <button
                onClick={() => setCurrentArticleId(prevArticle.id)}
                className="w-full sm:w-auto p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-blue-600">
                  ←
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500">Previous Chapter</div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate max-w-[200px]">
                    {prevArticle.title.replace(/:\s*.*$/, '')}
                  </div>
                </div>
              </button>
            ) : <div />}

            {nextArticle && (
              <button
                onClick={() => setCurrentArticleId(nextArticle.id)}
                className="w-full sm:w-auto p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-right transition-all flex items-center justify-end gap-3 group"
              >
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500">Next Chapter</div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate max-w-[200px]">
                    {nextArticle.title.replace(/:\s*.*$/, '')}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-blue-600">
                  →
                </div>
              </button>
            )}
          </div>

          {/* Related Articles Strip */}
          {relatedArticles.length > 0 && (
            <div className="my-8 p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Related Engineering Chapters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setCurrentArticleId(rel.id)}
                    className="p-3 rounded-xl bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 mb-1">
                      {rel.title.replace(/:\s*.*$/, '')}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {rel.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Feedback Widget */}
          <FeedbackWidget articleId={article.id} />

          {/* Bottom Still Need Help Banner */}
          <div className="p-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Need specific calculation verification?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Our pressure equipment specialists are available to consult on complex non-standard geometries.
              </p>
            </div>
            <button
              onClick={() => setSupportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shadow-xs"
            >
              Contact Support
            </button>
          </div>
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

      {/* Global Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectArticle={(id) => setCurrentArticleId(id)}
      />

      <ImageSearchModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />

      <ParameterExplorerModal
        isOpen={paramExplorerOpen}
        onClose={() => setParamExplorerOpen(false)}
        onSelectArticle={(id) => setCurrentArticleId(id)}
      />

      <CapabilityMatrixModal
        isOpen={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        onSelectArticle={(id) => setCurrentArticleId(id)}
      />

      <ContactSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        currentArticle={article}
      />
    </div>
  );
}
