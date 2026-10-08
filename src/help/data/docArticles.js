/**
 * NOVA ENGINEERING DOCUMENTATION - MASTER ARTICLES REGISTRY
 * 
 * Aggregates all documentation chapters:
 * 1. Getting Started & Platform Foundation (Getting Started, Overview, Dashboard, Navigation, Units Conventions, Comparison)
 * 2. 10 Core Analysis Modules (Nozzle, Bellows, Flange, Local PWHT, Saddle, Hot Box, Stiffener, Tubesheet, Lug, Trunnion)
 * 3. Software Systems (Nova Website, Ansys ACT Wizard, CAD AI)
 * 4. Materials Engineering (ASME Section II-D Database, Stress-Strain Curve Generator Annex 3-D)
 * 5. Reference & Quality (Results & Reports, Engineering Validation, Standards Directory, Release Notes, Contact Support)
 */

import { GETTING_STARTED_ARTICLES } from './articles/gettingStartedArticles.js';
import { ANALYSIS_ARTICLES } from './articles/analysisArticles.js';
import { SOFTWARE_ARTICLES } from './articles/softwareArticles.js';
import { MATERIALS_ARTICLES } from './articles/materialsArticles.js';
import { REFERENCE_ARTICLES } from './articles/referenceArticles.js';

export const DOC_ARTICLES = [
  ...GETTING_STARTED_ARTICLES,
  ...ANALYSIS_ARTICLES,
  ...SOFTWARE_ARTICLES,
  ...MATERIALS_ARTICLES,
  ...REFERENCE_ARTICLES
];

/**
 * Standard Category Taxonomy with Icon Identifiers and Sort Orders
 */
export const DOC_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Compass',
    description: 'Platform overview, 10-step engineering workflow, dashboard navigation, and units conventions',
    articleIds: [
      'getting-started',
      'website-overview',
      'dashboard-guide',
      'navigation-guide',
      'units-conventions',
      'analysis-comparison'
    ]
  },
  {
    id: 'analyses',
    title: 'Analysis Modules',
    icon: 'Layers',
    description: 'Deep technical documentation for all 10 verified pressure equipment analysis modules',
    articleIds: [
      'nozzle-analysis',
      'bellows-analysis',
      'flange-analysis',
      'local-pwht',
      'saddle-analysis',
      'hot-box-analysis',
      'stiffener-analysis',
      'tubesheet-analysis',
      'lug-analysis',
      'trunnion-analysis'
    ]
  },
  {
    id: 'software',
    title: 'Software & Automation',
    icon: 'Cpu',
    description: 'Nova web features, Ansys ACT Wizard (.WBEX), and parametric CAD AI workflows',
    articleIds: [
      'nova-website',
      'ansys-act-wizard',
      'cad-ai'
    ]
  },
  {
    id: 'materials',
    title: 'Materials & Plasticity',
    icon: 'Activity',
    description: 'ASME Section II-D database, temperature derating, and Annex 3-D stress-strain curves',
    articleIds: [
      'asme-materials',
      'stress-strain'
    ]
  },
  {
    id: 'reference',
    title: 'Reference & Standards',
    icon: 'FileText',
    description: 'Stress classification, engineering verification & validation, standards directory, and release notes',
    articleIds: [
      'results-reports',
      'engineering-validation',
      'standards-references',
      'release-notes',
      'contact-support'
    ]
  }
];

/**
 * Fast lookup map by ID and Slug
 */
const articlesByIdMap = new Map();
const articlesBySlugMap = new Map();

DOC_ARTICLES.forEach(art => {
  articlesByIdMap.set(art.id, art);
  if (art.slug) {
    articlesBySlugMap.set(art.slug, art);
  }
});

/**
 * Retrieve article by either ID or Slug
 */
export function getArticleById(idOrSlug) {
  if (!idOrSlug) return DOC_ARTICLES[0];
  return articlesByIdMap.get(idOrSlug) || articlesBySlugMap.get(idOrSlug) || DOC_ARTICLES[0];
}

/**
 * Get next and previous articles for sequential reading
 */
export function getAdjacentArticles(currentArticleId) {
  const currentIndex = DOC_ARTICLES.findIndex(art => art.id === currentArticleId || art.slug === currentArticleId);
  if (currentIndex === -1) {
    return { prev: null, next: DOC_ARTICLES[1] || null };
  }
  return {
    prev: currentIndex > 0 ? DOC_ARTICLES[currentIndex - 1] : null,
    next: currentIndex < DOC_ARTICLES.length - 1 ? DOC_ARTICLES[currentIndex + 1] : null
  };
}

/**
 * Get contextually related articles based on discipline, tags, or category
 */
export function getRelatedArticles(currentArticleId, limit = 4) {
  const current = getArticleById(currentArticleId);
  if (!current) return DOC_ARTICLES.slice(0, limit);

  return DOC_ARTICLES
    .filter(art => art.id !== current.id)
    .map(art => {
      let score = 0;
      if (art.category === current.category) score += 3;
      if (art.discipline === current.discipline) score += 2;
      if (art.tags && current.tags) {
        const sharedTags = art.tags.filter(t => current.tags.includes(t));
        score += sharedTags.length * 2;
      }
      return { article: art, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

/**
 * Search articles across Title, Summary, Parameters, Tags, Standards, and Section content
 */
export function searchDocumentation(query, filters = {}) {
  if (!query && (!filters || Object.keys(filters).length === 0)) {
    return DOC_ARTICLES;
  }

  const cleanQuery = (query || '').toLowerCase().trim();
  const { category, difficulty, standard, discipline } = filters;

  return DOC_ARTICLES.filter(art => {
    // Apply categorical filters
    if (category && category !== 'All' && art.category !== category) return false;
    if (difficulty && difficulty !== 'All' && art.difficulty !== difficulty) return false;
    if (discipline && discipline !== 'All' && art.discipline !== discipline) return false;
    if (standard && standard !== 'All') {
      const matchStandard = (art.standard && art.standard.includes(standard)) ||
        (art.applicableStandards && art.applicableStandards.some(s => s.includes(standard)));
      if (!matchStandard) return false;
    }

    if (!cleanQuery) return true;

    // Search text matches
    const titleMatch = art.title && art.title.toLowerCase().includes(cleanQuery);
    const summaryMatch = art.summary && art.summary.toLowerCase().includes(cleanQuery);
    const tagMatch = art.tags && art.tags.some(t => t.toLowerCase().includes(cleanQuery));
    const standardMatch = (art.standard && art.standard.toLowerCase().includes(cleanQuery)) ||
      (art.applicableStandards && art.applicableStandards.some(s => s.toLowerCase().includes(cleanQuery)));
    
    // Check parameters
    const paramMatch = art.parameters && art.parameters.some(p => 
      (p.name && p.name.toLowerCase().includes(cleanQuery)) ||
      (p.symbol && p.symbol.toLowerCase().includes(cleanQuery)) ||
      (p.meaning && p.meaning.toLowerCase().includes(cleanQuery))
    );

    // Check FAQs
    const faqMatch = art.faqs && art.faqs.some(f => 
      (f.q && f.q.toLowerCase().includes(cleanQuery)) ||
      (f.a && f.a.toLowerCase().includes(cleanQuery))
    );

    return titleMatch || summaryMatch || tagMatch || standardMatch || paramMatch || faqMatch;
  });
}
