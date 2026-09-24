import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  Shield,
  Layers,
  Cylinder,
  Disc,
  Target,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Cpu,
  FileText,
  Sliders,
  X
} from 'lucide-react';

export default function NovaHelpContent({ onNavigateBack }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('div1_vs_div2');

  const topics = [
    {
      id: 'div1_vs_div2',
      category: 'philosophy',
      title: 'ASME Section VIII Div 1 vs Div 2: Deep Comparative Analysis & Design Philosophy',
      badge: 'Core Code Philosophy',
      summary: 'Design-by-Rule (DBR) vs Design-by-Analysis (DBA), design margins, Tresca vs Von Mises criteria, and economic break-even evaluation.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase mb-3">
              <Shield className="w-4 h-4" /> Part 1: Fundamental Philosophy & Code Architectures
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Design-by-Rule (DBR) vs Design-by-Analysis (DBA)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              The American Society of Mechanical Engineers (ASME) Boiler and Pressure Vessel Code (BPVC) provides two fundamentally different methodologies for pressure equipment integrity: <strong>Section VIII, Division 1</strong> ("Rules for Construction of Pressure Vessels") and <strong>Section VIII, Division 2</strong> ("Alternative Rules"). Understanding the theoretical, metallurgical, and economic trade-offs is paramount for selecting the optimal construction code.
            </p>
          </div> <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white font-black uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-r border-slate-800">Design Parameter</th>
                  <th className="p-4 border-r border-slate-800">ASME Section VIII, Div 1</th>
                  <th className="p-4 border-r border-slate-800">ASME Section VIII, Div 2 (Class 1)</th>
                  <th className="p-4">ASME Section VIII, Div 2 (Class 2)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Design Approach</td>
                  <td className="p-4 border-r border-slate-100">Design-by-Rule (DBR). Closed-form empirical equations.</td>
                  <td className="p-4 border-r border-slate-100">Design-by-Rule + Optional DBA Part 5.</td>
                  <td className="p-4 font-bold text-indigo-700">Design-by-Analysis (DBA) mandatory for complex geometry.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Design Margin on Tensile Strength (Su)</td>
                  <td className="p-4 font-mono font-bold text-red-600 border-r border-slate-100">3.5 (Pre-1999: 4.0)</td>
                  <td className="p-4 font-mono font-bold text-amber-600 border-r border-slate-100">3.0</td>
                  <td className="p-4 font-mono font-bold text-emerald-600">2.4 (Significant weight reduction)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Design Margin on Yield Strength (Sy)</td>
                  <td className="p-4 font-mono border-r border-slate-100">1.5 (2/3 Sy)</td>
                  <td className="p-4 font-mono border-r border-slate-100">1.5 (2/3 Sy)</td>
                  <td className="p-4 font-mono">1.5 (2/3 Sy)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Failure Theory / Yield Criterion</td>
                  <td className="p-4 border-r border-slate-100">Maximum Principal Stress / Tresca (Shear Stress Theory)</td>
                  <td className="p-4 border-r border-slate-100">Tresca / Maximum Shear</td>
                  <td className="p-4 font-bold text-indigo-700">Von Mises (Distortion Energy Theory / Octahedral Shear)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Hydrostatic Test Pressure</td>
                  <td className="p-4 font-mono border-r border-slate-100">1.3 x MAWP x (Sa/Sd)</td>
                  <td className="p-4 font-mono border-r border-slate-100">1.3 x MAWP x (Sa/Sd)</td>
                  <td className="p-4 font-mono font-bold text-indigo-700">1.43 x MAWP</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Fatigue Screening & Analysis</td>
                  <td className="p-4 border-r border-slate-100">Not addressed in body rules. Cyclic service neglected.</td>
                  <td className="p-4 border-r border-slate-100">Mandatory screening per Part 5.5.2.</td>
                  <td className="p-4 font-bold text-emerald-700">Comprehensive cycle life analysis (Smooth bar & Welded joint).</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50 border-r border-slate-200">Inspection & NDE Requirements</td>
                  <td className="p-4 border-r border-slate-100">Spot RT (E=0.85) or No RT (E=0.70) permitted.</td>
                  <td className="p-4 border-r border-slate-100">Extensive volumetric NDE required.</td>
                  <td className="p-4 font-bold text-indigo-700">100% Volumetric Examination (Full RT or UT) required for all butt welds.</td>
                </tr>
              </tbody>
            </table>
          </div> <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" /> Figure 1.1: Allowable Stress Comparison (SA-516 Gr. 70 Plate)
              </h4>
              <span className="text-[11px] font-mono text-slate-500 font-bold">ASME Sec II-D Metric / Customary</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-3/5 h-56 bg-slate-950 rounded-xl p-3 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none"> <line x1="50" y1="20" x2="380" y2="20" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="50" y1="65" x2="380" y2="65" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="50" y1="110" x2="380" y2="110" stroke="#334155" strokeDasharray="3 3" />
                  <line x1="50" y1="155" x2="380" y2="155" stroke="#334155" strokeDasharray="3 3" /> <line x1="50" y1="160" x2="380" y2="160" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="50" y1="20" x2="50" y2="160" stroke="#94a3b8" strokeWidth="2" />
                  
                  <text x="25" y="25" fill="#94a3b8" fontSize="9" fontFamily="monospace">220 MPa</text>
                  <text x="25" y="70" fill="#94a3b8" fontSize="9" fontFamily="monospace">175 MPa</text>
                  <text x="25" y="115" fill="#94a3b8" fontSize="9" fontFamily="monospace">140 MPa</text>
                  <text x="25" y="160" fill="#94a3b8" fontSize="9" fontFamily="monospace">0</text>
                  
                  <text x="50" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">-20°C</text>
                  <text x="140" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">100°C</text>
                  <text x="230" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">250°C</text>
                  <text x="320" y="175" fill="#94a3b8" fontSize="9" fontFamily="monospace">400°C</text> <path d="M 50 48 Q 200 52 280 80 T 360 145" stroke="#10b981" strokeWidth="3" fill="none" />
                  <circle cx="280" cy="80" r="4" fill="#10b981" />
                  <text x="170" y="42" fill="#10b981" fontSize="10" fontWeight="bold">Div 2 Class 2 (Margin = 2.4)</text> <path d="M 50 88 Q 200 90 280 105 T 360 148" stroke="#3b82f6" strokeWidth="3" fill="none" />
                  <circle cx="280" cy="105" r="4" fill="#3b82f6" />
                  <text x="170" y="118" fill="#60a5fa" fontSize="10" fontWeight="bold">Div 1 (Margin = 3.5)</text>
                </svg>
              </div>
              <div className="flex-1 text-xs text-slate-600 space-y-2.5">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block text-xs">20% to 35% Wall Thickness Reduction</span>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    At ambient to moderate temperatures (up to 300°C), Division 2 yields allowable stresses approximately 25% higher than Division 1, enabling substantially thinner shells, lower vessel weight, faster fabrication, and reduced foundation loads.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block text-xs">Economic Break-Even Threshold:</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Div 2 carries higher upfront engineering (FEA analysis) and NDE costs (100% volumetric inspection). It becomes strictly cost-effective when shell thickness exceeds <strong>32 mm (1.25 in)</strong> or vessel diameter x pressure exceeds <strong>P x D &gt; 15,000 bar-mm</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'shell_head_formulas',
      category: 'formulas',
      title: 'Analytical Formulas & Derivations: Cylindrical Shells & Formed Heads',
      badge: 'Core Equations',
      summary: 'UG-27 hoop and longitudinal derivations, UG-32 ellipsoidal, torispherical and hemispherical head equations with stress factors.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase mb-3">
              <Cylinder className="w-4 h-4" /> Part 2: Thin & Thick Wall Pressure Shell Formulations
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ASME VIII-1 (UG-27 / UG-32) & Division 2 (Part 4.3) Formulations
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              Pressure boundary thickness determination balances membrane hoop stresses generated by fluid pressure with material design stress adjusted for joint efficiency ($E$) and corrosion allowance ($CA$).
            </p>
          </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-slate-900 text-sm">Cylindrical Shell (Circumferential / Hoop)</span>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">UG-27(c)(1)</span>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-center text-sm font-bold shadow-inner">
                t = (P · R) / (S · E - 0.6 · P)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maximum Allowable Working Pressure (MAWP) on internal radius:
              </p>
              <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs text-slate-800 text-center font-bold">
                P = (S · E · t) / (R + 0.6 · t)
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2">
                <div><strong>P</strong> = Internal design pressure (MPa or psi)</div>
                <div><strong>R</strong> = Corroded internal radius = (OD/2) - t_nom + CA</div>
                <div><strong>S</strong> = Allowable stress from ASME Section II-D (Table 1A)</div>
                <div><strong>E</strong> = Joint efficiency factor (1.0 for Full RT, 0.85 Spot, 0.70 None)</div>
                <div><strong>0.6 · P</strong> = Lamé adjustment accounting for non-uniform wall stress gradient</div>
              </div>
            </div> <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-slate-900 text-sm">Cylindrical Shell (Longitudinal Stress)</span>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">UG-27(c)(2)</span>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-center text-sm font-bold shadow-inner">
                t = (P · R) / (2 · S · E + 0.4 · P)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Circumferential joint governing pressure formula:
              </p>
              <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs text-slate-800 text-center font-bold">
                P = (2 · S · E · t) / (R - 0.4 · t)
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2">
                <div>Under pure internal pressure, longitudinal stress is exactly half the hoop stress.</div>
                <div>Circumferential seam thickness only governs when significant external bending moments (wind, seismic, piping reaction) are present.</div>
              </div>
            </div> <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-slate-900 text-sm">2:1 Ellipsoidal Head</span>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">UG-32(d)</span>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-center text-sm font-bold shadow-inner">
                t = (P · D · K) / (2 · S · E - 0.2 · P)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For standard 2:1 ratio ($D / 2h = 2$), the stress factor $K = 1.0$:
              </p>
              <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs text-slate-800 text-center font-bold">
                K = 1/6 · [ 2 + (D / 2h)² ] = 1.0
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2">
                <div><strong>D</strong> = Corroded inside diameter of the head skirt</div>
                <div><strong>h</strong> = Inside depth of the ellipsoidal head measured from tangent line</div>
                <div>Requires smooth tangent knuckle transition to eliminate bending peaks</div>
              </div>
            </div> <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-slate-900 text-sm">Torispherical (Flanged & Dished)</span>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">UG-32(e)</span>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-center text-sm font-bold shadow-inner">
                t = (P · L · M) / (2 · S · E - 0.2 · P)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stress concentration factor $M$ for knuckle transition:
              </p>
              <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs text-slate-800 text-center font-bold">
                M = 1/4 · [ 3 + √(L / r) ]
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2">
                <div><strong>L</strong> = Inside crown spherical radius (max $L \le D$)</div>
                <div><strong>r</strong> = Inside knuckle corner radius (minimum $r \ge 0.06 \cdot D$ and $r \ge 3 \cdot t$)</div>
                <div>Standard ASME F&D head: $L = D$, $r = 0.06 \cdot D$, yielding $M = 1.77$ (requires ~77% thicker plate than hemispherical head).</div>
              </div>
            </div>
          </div> <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Figure 2.1: Vessel Shell & Head Geometric Cross-Section
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <svg className="w-full h-48" viewBox="0 0 500 160" fill="none"> <rect x="150" y="40" width="200" height="80" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
                <line x1="150" y1="80" x2="350" y2="80" stroke="#94a3b8" strokeDasharray="5 5" /> <path d="M 150 40 C 90 40 90 120 150 120 Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
                <line x1="150" y1="30" x2="150" y2="130" stroke="#ef4444" strokeDasharray="3 2" />
                <text x="130" y="25" fill="#ef4444" fontSize="9" fontWeight="bold">Tangent Line (TL)</text> <path d="M 350 40 C 420 40 420 120 350 120 Z" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                <line x1="350" y1="30" x2="350" y2="130" stroke="#ef4444" strokeDasharray="3 2" /> <rect x="235" y="10" width="30" height="30" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <line x1="225" y1="10" x2="275" y2="10" stroke="#d97706" strokeWidth="4" />
                <text x="215" y="6" fill="#d97706" fontSize="9" fontWeight="bold">Nozzle Flange</text> <text x="70" y="85" fill="#2563eb" fontSize="10" fontWeight="bold">2:1 Ellipsoidal</text>
                <text x="230" y="85" fill="#334155" fontSize="11" fontWeight="black">Shell (UG-27)</text>
                <text x="365" y="85" fill="#059669" fontSize="10" fontWeight="bold">Hemispherical</text>
              </svg>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nozzle_reinforcement',
      category: 'nozzles',
      title: 'Nozzle Openings, Area Replacement & Self-Reinforcement (UG-37 & Div 2 4.5)',
      badge: 'Discontinuity Engineering',
      summary: 'Area replacement method rules, limits of reinforcement, large opening rules (Appendix 1-7), and integrally reinforced forged necks.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase mb-3">
              <Target className="w-4 h-4" /> Part 3: Branch Connection & Penetration Analysis
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              The Area Replacement Rule (ASME VIII-1 UG-37 & Division 2 Part 4.5)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              When a hole is cut into a pressure vessel to insert a nozzle pipe, the load-bearing metal is removed, producing stress concentrations up to $K_t \approx 3.0$ at the longitudinal crotch corner. The code requires that all cross-sectional area removed must be replaced by available metal within a defined boundary zone.
            </p>
          </div> <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fundamental Area Compensation Criterion:
            </h4>
            <div className="text-center py-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
                A₁ + A₂ + A₃ + A₄ + A₅ ≥ A_required
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300 border-t border-slate-800 pt-4">
              <div className="space-y-1.5">
                <div className="text-amber-400 font-bold font-sans">Required Metal Area:</div>
                <div className="bg-slate-800 p-2.5 rounded-lg text-emerald-300">
                  A_req = d · t_r · F + 2 · t_n · t_r · F · (1 - f_r1)
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  <strong>d</strong> = Finished corroded opening diameter.<br />
                  <strong>t_r</strong> = Required shell thickness for pressure.<br />
                  <strong>F</strong> = Correction factor (normally 1.0; 0.5 for non-radial planes).
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-amber-400 font-bold font-sans">Available Compensating Areas:</div>
                <div className="text-[11px] text-slate-300 space-y-1 font-sans">
                  <div><strong>A₁ (Excess Shell):</strong> Area in vessel wall = (t - t_r) · (d - 2·t_n)</div>
                  <div><strong>A₂ (Excess Nozzle Wall):</strong> Area in nozzle neck = 2 · (t_n - t_rn) · L_H</div>
                  <div><strong>A₃ (Internal Protrusion):</strong> Area in nozzle projecting inward</div>
                  <div><strong>A₄ (Weld Fillets):</strong> Area in exterior & interior attachment welds</div>
                  <div><strong>A₅ (Reinforcing Pad):</strong> Plate area provided by external repad</div>
                </div>
              </div>
            </div>
          </div> <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" /> Figure 3.1: Zone of Reinforcement Limits (UG-40)
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <svg className="w-full h-56" viewBox="0 0 500 200" fill="none"> <rect x="60" y="110" width="380" height="35" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                <text x="70" y="132" fill="#475569" fontSize="10" fontWeight="bold">Vessel Shell (t)</text> <rect x="210" y="20" width="80" height="90" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                <rect x="230" y="20" width="40" height="135" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 3" />
                <text x="237" y="60" fill="#94a3b8" fontSize="10" fontWeight="bold">Bore (d)</text> <rect x="130" y="35" width="240" height="145" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
                <text x="375" y="45" fill="#ef4444" fontSize="9" fontWeight="bold">Limit Boundary</text> <line x1="130" y1="185" x2="370" y2="185" stroke="#ef4444" strokeWidth="1.5" />
                <text x="215" y="197" fill="#ef4444" fontSize="9" fontWeight="bold">Parallel Limit: 2·d</text>
                
                <line x1="390" y1="110" x2="390" y2="35" stroke="#2563eb" strokeWidth="1.5" />
                <text x="400" y="75" fill="#2563eb" fontSize="9" fontWeight="bold">Normal Limit: 2.5·t_n</text> <rect x="150" y="110" width="55" height="12" fill="#3b82f6" opacity="0.6" />
                <text x="168" y="120" fill="#fff" fontSize="9" fontWeight="bold">A₁</text>
                
                <rect x="210" y="45" width="18" height="60" fill="#10b981" opacity="0.7" />
                <text x="214" y="80" fill="#fff" fontSize="9" fontWeight="bold">A₂</text>
                
                <polygon points="200,110 210,100 210,110" fill="#ec4899" />
                <text x="195" y="105" fill="#ec4899" fontSize="8" fontWeight="bold">A₄</text>
              </svg>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Parallel Limit ($L_R$):</strong> Must not exceed greater of $2 \cdot d$ or $d + 2 \cdot (t + t_n)$. Metal outside this boundary cannot contribute to area replacement.</div>
              <div><strong>Normal Limit ($L_H$):</strong> Must not exceed smaller of $2.5 \cdot t$ or $2.5 \cdot t_n + t_e$. Prevents credit for pipe metal located too far from the shell junction.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wrc107_wrc297',
      category: 'nozzles',
      title: 'WRC-107 / WRC-537 & WRC-297 Local Discontinuity Stress Analysis',
      badge: 'Local Load Evaluation',
      summary: '6-degree-of-freedom piping reaction load evaluation, Bijlaard dimensionless coefficients (beta, gamma), and combined stress limits.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase mb-3">
              <Zap className="w-4 h-4" /> Part 4: External Piping Reactions & Local Shell Stresses
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              WRC Bulletin 107 / 537 & WRC 297 Analysis Protocol
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              External piping systems exert heavy mechanical forces and thermal expansion moments onto equipment nozzles. Standard ASME formulas evaluate internal pressure only; Welding Research Council (WRC) Bulletins 107/537 and 297 provide the industry-standard mathematical solutions for local shell bending and membrane stresses.
            </p>
          </div> <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider">
              The 6 Primary Piping Load Vectors Applied at Vessel Junction:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-emerald-400 font-bold text-sm">P (Radial Thrust)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Axial thrust force directed along nozzle center line into/out of shell.</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-emerald-400 font-bold text-sm">V_L (Longitudinal Shear)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Shear force directed parallel to cylindrical vessel longitudinal axis.</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-emerald-400 font-bold text-sm">V_C (Circumferential Shear)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Shear force directed tangential to vessel circumference.</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-indigo-400 font-bold text-sm">M_L (Longitudinal Moment)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Bending moment producing longitudinal bending in shell wall.</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-indigo-400 font-bold text-sm">M_C (Circumferential Moment)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Bending moment producing circumferential flexure across shell radius.</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className="text-indigo-400 font-bold text-sm">M_T (Torsional Moment)</div>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">Twisting moment twisting nozzle neck about its radial axis.</div>
              </div>
            </div>
          </div> <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
            <h4 className="text-slate-900 font-black text-sm">Non-Dimensional Parameters:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-indigo-700">Shell Slenderness Ratio (γ):</div>
                <div className="text-base font-black text-slate-900 my-1">γ = R_m / T</div>
                <div className="text-[11px] text-slate-500 font-sans">Ratio of shell mean radius to shell nominal thickness (valid range: 5 ≤ γ ≤ 300).</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-indigo-700">Nozzle-to-Shell Ratio (β):</div>
                <div className="text-base font-black text-slate-900 my-1">β = 0.875 · (r_o / R_m)</div>
                <div className="text-[11px] text-slate-500 font-sans">Ratio of nozzle outside radius to shell mean radius (valid range: 0.05 ≤ β ≤ 0.55).</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Stresses are calculated at 8 cardinal positions around the attachment perimeter: points <strong>A, B, C, D</strong> on both the <strong>Inside Surface</strong> and <strong>Outside Surface</strong> of the shell wall and nozzle neck. Total stress intensities ($S_I$) are combined with internal pressure hoop stress and compared against ASME Section VIII Div 2 Part 5 allowable limits:
            </p>
            <div className="bg-slate-100 p-3 rounded-xl font-mono text-xs text-slate-800 font-bold space-y-1">
              <div>Primary Membrane Stress (P_L) ≤ 1.5 · S</div>
              <div>Primary Membrane + Primary Bending (P_L + P_b) ≤ 1.5 · S</div>
              <div>Primary + Secondary Stress Range (P + Q) ≤ 3.0 · S (Shakedown criteria)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'asme_div2_part5_dba',
      category: 'fea_analysis',
      title: 'ASME Section VIII Div 2 Part 5 FEA Design-by-Analysis (DBA) Masterclass',
      badge: 'Advanced FEA Suite',
      summary: 'Stress Classification Lines (SCL), tensor integration, Protection against Plastic Collapse, Local Failure, Buckling, and Cyclic Fatigue.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase mb-3">
              <Cpu className="w-4 h-4" /> Part 5: Numerical Continuum Mechanics & Finite Element Evaluation
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Design-by-Analysis (DBA) Mathematical Foundations
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              ASME Section VIII Division 2 (Part 5) governs finite element analysis. It departs from simple empirical equations and requires decomposing the full 3D continuum stress tensor into fundamental failure mode categories through Stress Linearization along <strong>Stress Classification Lines (SCL)</strong>.
            </p>
          </div> <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">
              Stress Linearization Mathematical Integration Across Wall Thickness (t):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
              <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-amber-300 font-bold font-sans text-sm block">1. Membrane Stress Tensor (σ_m,ij):</span>
                <p className="text-slate-300 font-sans text-[11px]">Average through-thickness normal and shear components:</p>
                <div className="bg-slate-950 p-3 rounded-lg text-emerald-300 text-center font-bold">
                  σ_m,ij = (1 / t) · ∫₀ᵗ σ_ij(x) · dx
                </div>
                <p className="text-[10px] text-slate-400 font-sans">Carries direct net tension or compression. Corresponds to gross plastic burst limit.</p>
              </div>
              <div className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-amber-300 font-bold font-sans text-sm block">2. Bending Stress Tensor (σ_b,ij):</span>
                <p className="text-slate-300 font-sans text-[11px]">Linear moment equilibrium distribution across thickness:</p>
                <div className="bg-slate-950 p-3 rounded-lg text-emerald-300 text-center font-bold">
                  σ_b,ij = (6 / t²) · ∫₀ᵗ σ_ij(x) · (t/2 - x) · dx
                </div>
                <p className="text-[10px] text-slate-400 font-sans">Self-equilibrating linear gradient producing zero net membrane force.</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-indigo-300 font-sans font-bold">Peak Stress Component (F_ij):</div>
              <div>F_ij(x) = σ_total,ij(x) - [ σ_m,ij + σ_b,ij(x) ]</div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                The non-linear notch or fillet peak stress. Does not cause gross deformation, but governs fatigue crack initiation and cyclic damage accumulation.
              </p>
            </div>
          </div> <div className="space-y-4">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">
              The Four Mandatory Protection Criteria (Part 5):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">5.2 Plastic Collapse</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Mandatory</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Prevents catastrophic burst. Evaluated via: (a) Elastic Stress Analysis with SCL limits ($P_m \le S, P_L \le 1.5S, P_L + P_b \le 1.5S$), (b) Limit Load Analysis, or (c) Elastic-Plastic FEA using True Stress-Strain curves.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">5.3 Local Failure</span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Triaxial Strain</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Prevents ductile tearing in regions of high triaxial tension (σ1 + σ2 + σ3). Limits total equivalent plastic strain ε_peq ≤ ε_L, where ε_L is the triaxial strain limit function.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">5.4 Buckling Collapse</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Stability</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Protects vessels subjected to external pressure, vacuum, or axial compressive loads. Requires eigenvalue bifurcation buckling factor $\Phi_B \ge 2.0$ or non-linear collapse with initial geometric ovality.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">5.5 Cyclic Fatigue Life</span>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Fatigue</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Evaluates crack initiation under transient thermal cycles and pressure variations using smooth bar S-N curves (Annex 3-F) or Battelle Structural Stress Method ($\Delta \sigma_k$) for welded joints.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'flange_bolting',
      category: 'flanges',
      title: 'Flange Design & Gasket Seating Mechanics (Appendix 2 & Div 2 4.16)',
      badge: 'Bolting & Seals',
      summary: 'Waters-Taylor-Forge analytical equations, gasket seating vs operating bolt loads, flange moments, and equivalent pressure.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-black uppercase mb-3">
              <Disc className="w-4 h-4 text-slate-700" /> Part 6: Gasket Seating & Bolted Flange Mechanics
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Taylor-Forge Method (ASME Section VIII-1 Appendix 2 & Div 2 4.16)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              Bolted flanged connections must satisfy two distinct operating regimes: (1) <strong>Gasket Seating Condition</strong> (initial cold bolt make-up without pressure), and (2) <strong>Operating Condition</strong> (hydrostatic end thrust pushing the flange apart while maintaining minimum gasket compression).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <span className="font-bold text-slate-900 text-sm block border-b pb-2">1. Required Bolt Loads:</span>
              <div className="space-y-2 font-mono">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-500 font-sans block text-[11px]">Operating Bolt Load (W_m1):</span>
                  <strong>W_m1 = (π/4 · G² · P) + (2 · b · π · G · m · P)</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-500 font-sans block text-[11px]">Gasket Seating Bolt Load (W_m2):</span>
                  <strong>W_m2 = π · b · G · y</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div><strong>G</strong> = Mean gasket diameter</div>
                <div><strong>b</strong> = Effective gasket seating width</div>
                <div><strong>m</strong> = Gasket maintenance factor</div>
                <div><strong>y</strong> = Gasket yield seating stress (MPa or psi)</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <span className="font-bold text-slate-900 text-sm block border-b pb-2">2. Flange Design Moments (M_o):</span>
              <div className="space-y-2 font-mono">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-500 font-sans block text-[11px]">Total Operating Moment:</span>
                  <strong>M_o = M_D + M_T + M_G</strong>
                </div>
                <div className="text-[11px] text-slate-600 font-sans space-y-1 mt-2">
                  <div><strong>M_D</strong> = Moment from hydrostatic end force on bore = H_D · h_D</div>
                  <div><strong>M_T</strong> = Moment from pressure force on flange face = H_T · h_T</div>
                  <div><strong>M_G</strong> = Moment from gasket compression reaction = H_G · h_G</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'materials_and_allowables',
      category: 'materials',
      title: 'Materials, Allowable Stresses & MDMT (ASME Section II-D & UCS-66)',
      badge: 'Metallurgy & Codes',
      summary: 'Section II-D Table 1A/5A stress limits, UCS-66 impact test exemption curves A/B/C/D, and Post-Weld Heat Treatment (PWHT).',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase mb-3">
              <Flame className="w-4 h-4 text-rose-600" /> Part 7: Metallurgy, Allowable Stress Rules & Impact Toughness
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ASME Section II-D & Minimum Design Metal Temperature (MDMT)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              Brittle fracture occurs without prior warning at low temperatures when nominal stresses are well below yield. ASME Section VIII enforces strict Minimum Design Metal Temperature (MDMT) rules under <strong>UCS-66</strong> (Div 1) and <strong>Part 3.11</strong> (Div 2) to eliminate catastrophic cleavage fractures.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-slate-900 text-sm">UCS-66 Impact Test Exemption Curves:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="font-black text-red-900 block mb-1">Curve A (Highest MDMT)</span>
                <p className="text-red-800 text-[11px]">As-rolled carbon steels (SA-36, SA-285). Not fine-grain practice. Most prone to brittle fracture.</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="font-black text-amber-900 block mb-1">Curve B</span>
                <p className="text-amber-800 text-[11px]">SA-516 plates not normalized. Moderate toughness for standard non-cryogenic vessels.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="font-black text-blue-900 block mb-1">Curve C</span>
                <p className="text-blue-800 text-[11px]">Normalized fine-grain carbon steel plate (SA-516 Gr. 70 normalized). Enhanced notch toughness.</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-black text-emerald-900 block mb-1">Curve D (Lowest MDMT)</span>
                <p className="text-emerald-800 text-[11px]">Fully killed, normalized, fine-grain practice with PWHT. Allows service down to -48°C without impact testing.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ansys_wizards_suite',
      category: 'wizards',
      title: 'Ansys ACT Wizards (.WBEX) & Stress-Strain Curve Generator',
      badge: 'Workbench ACT Extensions',
      summary: 'Automated 1-click FEA mesh & geometry generation for Shell Nozzles, Head Nozzles, Full Nozzles, and ASME Section VIII-2 Annex 3-D Stress-Strain curves.',
      content: (
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase mb-3">
              <Zap className="w-4 h-4 text-emerald-600" /> ACT Automation Suite: Direct ANSYS Workbench Add-ins
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Ansys ACT Extensions (.WBEX) Architecture & Automation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
              ANSYS Customization Toolkit (ACT) extensions (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">.wbex</code>) integrate directly into the ANSYS Mechanical and Workbench interface to automate tedious geometry slicing, automatic weld prep, hex-dominant structured mesh generation, boundary condition mapping, and non-linear material property generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">1. Shell Nozzle Wizard</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">₹4,999 / mo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automates cylindrical shell-to-nozzle intersections with reinforcing pads, fillet welds, automatic local coordinate systems, and ASME Section VIII Div 2 Part 5 SCL paths.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">2. Head Nozzle Wizard (1.5X)</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">₹7,499 / mo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parametric 2:1 Ellipsoidal, Hemispherical, and Torispherical head nozzle modeling with oblique radial offsets, knuckle transition stress paths, and automatic contact setup.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">3. Full Nozzle Wizard (2X)</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded bg-purple-100 text-purple-800">₹9,999 / mo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete unified pressure vessel package combining Shell, Heads, standard ANSI B16.5 flanges, blind covers, bolting pretension, and multi-load combinations (internal pressure + WRC nozzle loads).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">4. Stress-Strain Curve Wizard</span>
                <span className="text-[11px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">₹1,499 / mo</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates all types of non-linear true stress-strain curves in Ansys Engineering Data: Multilinear Isotropic (MISO), Kinematic Hardening (KINH), Ramberg-Osgood, and ASME Section VIII-2 Annex 3-D multi-temperature models.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> How to Install & License .WBEX Files
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-medium">
              <li>Purchase and download the verified <code className="bg-white px-1.5 py-0.5 rounded border font-mono">.wbex</code> file directly from your user dashboard.</li>
              <li>Launch ANSYS Workbench &rarr; Click <strong>Extensions</strong> on top menu &rarr; <strong>Install Extension...</strong></li>
              <li>Select the downloaded <code className="bg-white px-1.5 py-0.5 rounded border font-mono">.wbex</code> file &rarr; Click <strong>Open</strong>.</li>
              <li>Go to <strong>Extensions</strong> &rarr; <strong>Manage Extensions...</strong> &rarr; Check the box for your wizard to activate the custom toolbar in SpaceClaim and Mechanical.</li>
            </ol>
          </div>
        </div>
      )
    }
  ];

  const filteredTopics = topics.filter(t => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = !searchQuery.trim() || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  return (
    <div className="relative z-10 min-h-screen p-4 pt-24 font-sans text-slate-900 md:p-8">
      <div className="max-w-[1240px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-gradient-to-r from-slate-950 via-[#0c2340] to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-wider border border-indigo-400/30">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Complete Pressure Vessel Engineering Compendium
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              ASME Section VIII Div 1 & Div 2 Knowledge Base
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Exhaustive technical documentation, mathematical derivations, closed-form formulas, FEA Design-by-Analysis (Part 5) standards, WRC-107/537 local stress evaluation, and fabrication rules.
            </p>
          </div>

          <div className="mt-6 relative max-w-xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations, clauses (e.g. UG-27, SCL, WRC-107, Tresca, Flange)..."
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 border border-white/20 rounded-2xl pl-12 pr-10 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'wizards', label: 'Ansys ACT Wizards (.WBEX)' },
            { id: 'philosophy', label: 'Div 1 vs Div 2' },
            { id: 'formulas', label: 'Shell & Head Formulas' },
            { id: 'nozzles', label: 'Nozzles & WRC-107' },
            { id: 'fea_analysis', label: 'Div 2 Part 5 FEA' },
            { id: 'flanges', label: 'Flange & Gasket Design' },
            { id: 'materials', label: 'Materials & UCS-66' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div> <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"> <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-3xl border-2 border-slate-200/90 shadow-md space-y-2">
              <div className="text-[11px] font-black uppercase text-slate-400 px-3 tracking-wider">
                Chapters & Research Topics ({filteredTopics.length})
              </div>
              <div className="space-y-1.5">
                {filteredTopics.map((topic) => {
                  const isSelected = selectedTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#2874f0] text-white shadow-lg scale-[1.02]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${isSelected ? 'text-blue-100' : 'text-indigo-600'}`}>
                          {topic.badge}
                        </span>
                        <div className="font-bold text-xs leading-snug line-clamp-2">
                          {topic.title}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div> <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border-2 border-slate-200/90 shadow-xl min-h-[600px]">
            {activeTopic ? (
              activeTopic.content
            ) : (
              <div className="text-center py-20 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <h4 className="font-bold text-slate-700">No matching topic found</h4>
                <p className="text-xs text-slate-400 mt-1">Try searching with a different term or select another category</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
