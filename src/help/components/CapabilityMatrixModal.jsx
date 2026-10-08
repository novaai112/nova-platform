import React from 'react';
import { X, CheckCircle2, Layers, ExternalLink } from 'lucide-react';
import { CAPABILITY_MATRIX } from '../data/capabilityMatrixData.js';

export default function CapabilityMatrixModal({ isOpen, onClose, onSelectArticle }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      style={{ fontFamily: "Calibri, 'Segoe UI', Candara, Optima, sans-serif" }}
    >
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Nova Module Capability & Implementation Matrix
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table Container */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10 text-slate-700 font-bold uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {CAPABILITY_MATRIX.map(row => (
                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Module */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{row.module}</div>
                    <div className="text-[11px] text-slate-500">{row.problem}</div>
                  </td>

                  {/* Standard */}
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700 font-semibold">
                    {row.standard}
                  </td>

                  {/* DBR */}
                  <td className="py-3 px-2 text-center">
                    {row.dbr ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* FEA */}
                  <td className="py-3 px-2 text-center">
                    {row.fea ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* CAD */}
                  <td className="py-3 px-2 text-center">
                    {row.cad ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Report */}
                  <td className="py-3 px-2 text-center">
                    {row.report ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
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
                        className="text-blue-600 hover:text-blue-800 font-bold text-[11px] flex items-center gap-1 hover:underline"
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
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>All 10 Core Modules Verified Against ASME VIII-1/2, EJMA 11th, and WRC</span>
          <span>Version 2.4.0</span>
        </div>
      </div>
    </div>
  );
}
