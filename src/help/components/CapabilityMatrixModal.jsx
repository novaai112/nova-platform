import React from 'react';
import { X, CheckCircle2, AlertCircle, Layers, ExternalLink } from 'lucide-react';
import { CAPABILITY_MATRIX } from '../data/capabilityMatrixData.js';

export default function CapabilityMatrixModal({ isOpen, onClose, onSelectArticle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl rounded-2xl border border-white/15 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Nova Module Capability & Implementation Matrix
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-white/10 z-10 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3">Governing Standard</th>
                <th className="py-3 px-2 text-center">Design by Rule</th>
                <th className="py-3 px-2 text-center">3D FEA</th>
                <th className="py-3 px-2 text-center">3D CAD</th>
                <th className="py-3 px-2 text-center">PDF Report</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {CAPABILITY_MATRIX.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                  {/* Module */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{row.module}</div>
                    <div className="text-[11px] text-slate-400">{row.problem}</div>
                  </td>

                  {/* Standard */}
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-300">
                    {row.standard}
                  </td>

                  {/* DBR */}
                  <td className="py-3 px-2 text-center">
                    {row.dbr ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* FEA */}
                  <td className="py-3 px-2 text-center">
                    {row.fea ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* CAD */}
                  <td className="py-3 px-2 text-center">
                    {row.cad ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Report */}
                  <td className="py-3 px-2 text-center">
                    {row.report ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {row.status}
                    </span>
                  </td>

                  {/* Link */}
                  <td className="py-3 px-3">
                    {row.docSlug && (
                      <button
                        onClick={() => {
                          onSelectArticle(row.docSlug);
                          onClose();
                        }}
                        className="text-blue-400 hover:text-blue-300 font-medium text-[11px] flex items-center gap-1 hover:underline"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>All 10 Core Modules Verified Against ASME VIII-1/2, EJMA 11th, and WRC</span>
          <span>Version 2.4.0</span>
        </div>
      </div>
    </div>
  );
}
