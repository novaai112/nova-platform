import React, { useMemo } from 'react';
import NovaDocumentationCenter from './help/NovaDocumentationCenter.jsx';

/**
 * Nova Help Center Wrapper
 * Connects the App routing and state to the NovaDocumentationCenter platform.
 */
export default function NovaHelpContent({ onBackToDashboard, onMobileSwipeToCommunity, onMobileSwipeToProfile }) {
  // Extract and normalize initial topic from current URL path or search query
  const initialTopicId = useMemo(() => {
    try {
      const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (rawPath.startsWith('/help/')) {
        const id = rawPath.replace('/help/', '').split('/')[0];
        if (id) {
          // Normalize legacy topic identifiers to modern slugs
          const legacyMap = {
            'div1_vs_div2': 'getting-started',
            'wrc_537_107': 'nozzle-analysis',
            'nozzle_crotch': 'nozzle-analysis',
            'bellows_ejma': 'bellows-analysis',
            'flange_leakage': 'flange-analysis',
            'pwht_metallurgy': 'local-pwht',
            'fea_convergence': 'engineering-validation',
            'saddle_zick': 'saddle-analysis',
            'hotbox_gradient': 'hot-box-analysis',
            'stiffener_buckling': 'stiffener-analysis',
            'tubesheet_ligament': 'tubesheet-analysis',
            'lug_tearout': 'lug-analysis',
            'trunnion_bending': 'trunnion-analysis'
          };
          return legacyMap[id] || id;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const qTopic = params.get('topic');
      if (qTopic) return qTopic;
    } catch (e) {
      console.error('Error parsing help topic route:', e);
    }
    return 'getting-started';
  }, []);

  return (
    <div className="w-full min-h-screen">
      <NovaDocumentationCenter
        initialTopicId={initialTopicId}
        onBackToDashboard={onBackToDashboard}
        onMobileSwipeToCommunity={onMobileSwipeToCommunity}
        onMobileSwipeToProfile={onMobileSwipeToProfile}
      />
    </div>
  );
}
