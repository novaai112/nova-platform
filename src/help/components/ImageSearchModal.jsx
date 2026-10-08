import React, { useState, useMemo } from 'react';
import { Search, Image, X, ShieldCheck, ZoomIn, Copy, Check } from 'lucide-react';

const ENGINEERING_IMAGE_LIBRARY = [
  {
    id: 'img-nozzle-crotch',
    title: 'Pressure Vessel Nozzle Crotch Stress FEA Contour',
    category: 'FEA Stress Plot',
    module: 'Nozzle Analysis',
    source: 'Nova Engineering / WRC 537 Validation Suite',
    license: 'Educational & Engineering Verification License',
    tags: ['nozzle', 'crotch', 'scl', 'fea', 'von-mises'],
    aspectRatio: '16:9',
    description: '3D finite element stress concentration contour at cylinder-cylinder intersection displaying linearized membrane and bending stress gradient across nozzle crotch corner.',
    previewSvg: 'nozzle'
  },
  {
    id: 'img-bellows-convolutions',
    title: 'EJMA Multi-Ply Bellows Convolution Geometry & Pitch',
    category: 'Technical Schematic',
    module: 'Bellows Analysis',
    source: 'EJMA Standards 11th Edition Reference Models',
    license: 'Technical Fair Use / Reference Model',
    tags: ['bellows', 'convolution', 'pitch', 'expansion-joint', 'ejma'],
    aspectRatio: '16:9',
    description: 'Cross-sectional vector geometry of U-shaped metallic bellows convolutions illustrating pitch (q), convolution depth (w), and tangent collars.',
    previewSvg: 'bellows'
  },
  {
    id: 'img-flange-gasket',
    title: 'ASME Section VIII Div 1 Appendix 2 Flange & Gasket Seating',
    category: 'Technical Schematic',
    module: 'Flange Analysis',
    source: 'ASME BPVC Section VIII-1 / ASME B16.5',
    license: 'Technical Reference Diagram',
    tags: ['flange', 'gasket', 'bolt-circle', 'preload', 'raised-face'],
    aspectRatio: '16:9',
    description: 'Integral hub flange bolt circle diameter (C), gasket contact reaction diameter (G), and bolt moment arms (h_D, h_T, h_G).',
    previewSvg: 'flange'
  },
  {
    id: 'img-saddle-zick',
    title: 'Horizontal Vessel Twin Saddle Support Zick Stress Model',
    category: 'Technical Schematic',
    module: 'Saddle Analysis',
    source: 'L.P. Zick (1951) / BS 5500 Annex G',
    license: 'Public Domain Engineering Formulation',
    tags: ['saddle', 'zick', 'horn-bending', 'span', 'circumferential'],
    aspectRatio: '16:9',
    description: 'Zick analytical model detailing saddle horn bending zone, contact angle theta, overhang distance a, and saddle span L.',
    previewSvg: 'saddle'
  },
  {
    id: 'img-hotbox-skirt',
    title: 'High-Temperature Vertical Skirt Hot Box Thermal Insulation Shelf',
    category: '3D CAD / Thermal',
    module: 'Hot Box Analysis',
    source: 'Nova Platform Skirt-Head Junction Library',
    license: 'Nova Verified Design Schema',
    tags: ['hot-box', 'skirt', 'crotch-fatigue', 'refractory', 'thermal'],
    aspectRatio: '16:9',
    description: 'Thermal insulation chamber relieving cyclic thermal expansion gradients between hot bottom head and cool support skirt foundation.',
    previewSvg: 'hotbox'
  },
  {
    id: 'img-tubesheet-pitch',
    title: 'TEMA Tubular Exchanger Tubesheet Pitch & Ligament Width',
    category: 'Line Drawing',
    module: 'Tubesheet Analysis',
    source: 'TEMA 10th Edition / ASME VIII-1 Part UHX',
    license: 'Technical Engineering Diagram',
    tags: ['tubesheet', 'ligament', 'pitch', 'tema', 'triangular'],
    aspectRatio: '16:9',
    description: 'Triangular and square tube pitch patterns defining ligament efficiency (eta) and effective tubesheet bending rigidity (E*).',
    previewSvg: 'tubesheet'
  }
];

export default function ImageSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredImages = useMemo(() => {
    return ENGINEERING_IMAGE_LIBRARY.filter(img => {
      if (selectedFilter !== 'All' && img.category !== selectedFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        img.title.toLowerCase().includes(q) ||
        img.module.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q) ||
        img.tags.some(t => t.includes(q))
      );
    });
  }, [query, selectedFilter]);

  const handleCopyCitation = (img) => {
    const citation = `[Diagram] "${img.title}", Source: ${img.source}. License: ${img.license}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Engineering Schematic & Diagram Explorer
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search engineering drawings, FEA plots, schematics... (e.g. Zick, crotch, gasket, pitch)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            {['All', 'Technical Schematic', 'FEA Stress Plot', 'Line Drawing', '3D CAD'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all font-semibold ${
                  selectedFilter === f
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredImages.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-slate-400 text-xs">
              No technical schematics matching "{query}"
            </div>
          ) : (
            filteredImages.map(img => (
              <div
                key={img.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col group hover:border-blue-400 transition-all shadow-2xs"
              >
                {/* Visual Thumbnail */}
                <div 
                  onClick={() => setSelectedImage(img)}
                  className="h-44 bg-slate-50 flex items-center justify-center p-3 relative cursor-pointer border-b border-slate-100 group-hover:bg-blue-50/20 transition-colors"
                >
                  <div className="text-center font-mono text-slate-600 text-xs space-y-1">
                    <div className="text-blue-700 font-bold">{img.module}</div>
                    <div className="text-[11px] text-slate-500">Vector Technical Schematic</div>
                    <div className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 inline-block text-slate-700 font-semibold shadow-2xs">
                      {img.category}
                    </div>
                  </div>
                  <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {img.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {img.description}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate mr-2 font-mono font-medium" title={img.source}>
                      Source: {img.source}
                    </span>
                    <button
                      onClick={() => handleCopyCitation(img)}
                      title="Copy citation reference"
                      className="flex items-center gap-1 text-slate-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-slate-100 shrink-0 font-semibold"
                    >
                      {copiedId === img.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Cite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Engineering Media Architecture
          </span>
          <span>Showing {filteredImages.length} Technical Schematics</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedImage.title}
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono text-slate-700 text-xs">
              <div className="text-blue-700 text-base font-bold mb-2">{selectedImage.module}</div>
              <p className="text-slate-600 max-w-lg mx-auto text-xs leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="mt-4 inline-block px-3 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                {selectedImage.source} • {selectedImage.license}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
