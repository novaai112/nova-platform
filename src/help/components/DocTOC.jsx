import React, { useEffect, useState } from 'react';
import { ArrowUp, List } from 'lucide-react';

export default function DocTOC({ sections = [], activeSectionId, onSelectSection }) {
  const [activeId, setActiveId] = useState(activeSectionId || (sections[0]?.id || ''));

  useEffect(() => {
    if (activeSectionId) {
      setActiveId(activeSectionId);
    }
  }, [activeSectionId]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (id) => {
    setActiveId(id);
    if (onSelectSection) {
      onSelectSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div 
      className="space-y-4 text-xs font-sans"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase tracking-wider text-[11px] px-1">
        <List className="w-3.5 h-3.5 text-blue-600" />
        <span>On This Page</span>
      </div>

      <nav className="space-y-1 relative border-l border-slate-200 pl-3">
        {sections.map(section => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className={`block text-left w-full py-1.5 px-2.5 rounded-lg transition-all text-xs truncate ${
                isActive
                  ? 'text-blue-700 font-bold bg-blue-50 border-l-2 border-blue-600 -ml-[13px] pl-3.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
              }`}
            >
              {section.title.replace(/^[0-9]+\.\s*/, '')}
            </button>
          );
        })}
      </nav>

      <button
        onClick={scrollToTop}
        className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors pt-2 px-1 font-semibold"
      >
        <ArrowUp className="w-3 h-3 text-slate-400" />
        <span>Back to top</span>
      </button>
    </div>
  );
}
