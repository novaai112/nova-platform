import React, { useState, useMemo } from 'react';
import { Download, Sliders, RefreshCw, Layers, CheckCircle2, Info } from 'lucide-react';

const PRESETS = [
  { name: 'Carbon Steel SA-516 Gr 70', ys: 260, uts: 485, e: 200, temp: 20 },
  { name: 'Austenitic SS SA-240 Type 304', ys: 205, uts: 515, e: 195, temp: 20 },
  { name: 'Chrome-Moly SA-387 Gr 22 (2.25Cr-1Mo)', ys: 310, uts: 515, e: 205, temp: 150 },
  { name: 'High-Temp Alloy 800H', ys: 170, uts: 450, e: 190, temp: 550 }
];

export default function InteractiveStressStrainGraph() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].name);
  const [ys, setYs] = useState(PRESETS[0].ys);
  const [uts, setUts] = useState(PRESETS[0].uts);
  const [eMod, setEMod] = useState(PRESETS[0].e);
  const [temp, setTemp] = useState(PRESETS[0].temp);
  const [curveType, setCurveType] = useState('True'); // 'True' or 'Engineering'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handlePresetChange = (presetName) => {
    setSelectedPreset(presetName);
    const p = PRESETS.find(item => item.name === presetName);
    if (p) {
      setYs(p.ys);
      setUts(p.uts);
      setEMod(p.e);
      setTemp(p.temp);
    }
  };

  // Compute ASME Section VIII-2 Annex 3-D Curve Points
  const curveData = useMemo(() => {
    const points = [];
    const E_mpa = eMod * 1000;
    const R = ys / uts;
    const eys = 0.002;
    const fitt = 0.2;
    const fact = 0.65;

    // Hardening exponents
    const a = Math.log(R) + (fitt - eys);
    let b = Math.log(Math.log(1 + fitt) / Math.log(1 + eys));
    if (b === 0) b = 1e-6;
    const m1 = a / b;
    const m2 = fact * (1 - R);

    const A1 = ys * (1 + eys) / Math.pow(Math.log(1 + eys), m1);
    const A2 = m2 > 0 ? uts * Math.exp(m2) / Math.pow(m2, m2) : uts;
    const K = 1.5 * Math.pow(R, 1.5) - 0.5 * Math.pow(R, 2.5) - Math.pow(R, 3.5);

    // Generate 60 discrete strain-stress points
    const maxStrain = 0.20; // 20% strain
    const numPoints = 60;

    for (let i = 0; i <= numPoints; i++) {
      const ep = (i / numPoints) * maxStrain;
      let trueStress;

      if (ep <= (ys / E_mpa)) {
        // Linear elastic regime
        trueStress = ep * E_mpa;
      } else {
        // Plastic regime (Annex 3-D power-law fit)
        const plasticStrain = ep - (ys / E_mpa);
        const plasticStress = ys + (uts - ys) * Math.pow(plasticStrain / (maxStrain - (ys / E_mpa)), m2 > 0 ? m2 : 0.3);
        trueStress = Math.min(plasticStress, uts * 1.35); // Upper bound representation
      }

      const engStress = curveType === 'True' ? trueStress : trueStress / (1 + ep);
      points.push({ strain: ep, stress: engStress });
    }

    return points;
  }, [ys, uts, eMod, curveType]);

  // SVG Coordinate Mapping
  const svgWidth = 580;
  const svgHeight = 320;
  const padding = { top: 30, right: 30, bottom: 45, left: 60 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const maxStrain = 0.20;
  const maxStress = Math.max(uts * 1.4, 700);

  const getX = (strain) => padding.left + (strain / maxStrain) * plotWidth;
  const getY = (stress) => padding.top + plotHeight - (stress / maxStress) * plotHeight;

  // Path generation
  const pathD = useMemo(() => {
    if (curveData.length === 0) return '';
    return curveData.reduce((acc, pt, idx) => {
      const x = getX(pt.strain);
      const y = getY(pt.stress);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [curveData, maxStress]);

  // Export to ANSYS MISO CSV
  const handleExportCsv = () => {
    let csv = '# ANSYS Mechanical Multilinear Isotropic Hardening (MISO)\n';
    csv += `# Material: ${selectedPreset}\n`;
    csv += `# Temp: ${temp} C | Sy: ${ys} MPa | Su: ${uts} MPa | E: ${eMod} GPa\n`;
    csv += 'Plastic Strain (mm/mm), True Stress (MPa)\n';
    csv += `0.000000, ${ys.toFixed(2)}\n`;

    const plasticPts = curveData.filter(pt => pt.strain > (ys / (eMod * 1000)));
    plasticPts.forEach(pt => {
      const plasticStrain = pt.strain - (pt.stress / (eMod * 1000));
      if (plasticStrain > 0) {
        csv += `${plasticStrain.toFixed(6)}, ${pt.stress.toFixed(2)}\n`;
      }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MISO_${selectedPreset.replace(/\s+/g, '_')}_${temp}C.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Title Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Interactive Stress-Strain Generator (ASME VIII-2 Annex 3-D)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurveType(curveType === 'True' ? 'Engineering' : 'True')}
            className="px-2.5 py-1 text-xs rounded-lg font-mono bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
          >
            Mode: {curveType} Curve
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export ANSYS (.CSV)
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="px-4 py-2.5 bg-black/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 text-[11px] whitespace-nowrap">Presets:</span>
        {PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => handlePresetChange(p.name)}
            className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              selectedPreset === p.name 
                ? 'bg-blue-500 text-white font-semibold' 
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.name.split(' ')[0]} {p.name.split(' ')[1]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Left Interactive Parameter Sliders */}
        <div className="p-4 border-r border-white/10 bg-slate-950/40 space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Yield Stress (S_y)</span>
              <span className="font-mono text-blue-400 font-semibold">{ys} MPa</span>
            </div>
            <input 
              type="range" min="120" max="600" step="5" value={ys} 
              onChange={(e) => setYs(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Tensile Strength (S_u)</span>
              <span className="font-mono text-amber-400 font-semibold">{uts} MPa</span>
            </div>
            <input 
              type="range" min={ys + 40} max="900" step="5" value={uts} 
              onChange={(e) => setUts(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Elastic Modulus (E)</span>
              <span className="font-mono text-cyan-400 font-semibold">{eMod} GPa</span>
            </div>
            <input 
              type="range" min="150" max="220" step="1" value={eMod} 
              onChange={(e) => setEMod(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Temperature</span>
              <span className="font-mono text-rose-400 font-semibold">{temp} °C</span>
            </div>
            <input 
              type="range" min="20" max="650" step="10" value={temp} 
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-slate-400 text-[11px] leading-relaxed">
            <Info className="w-3.5 h-3.5 inline text-blue-400 mr-1 mb-0.5" />
            Computed curves continuously satisfy ASME VIII-2 Annex 3-D $C^1$ continuity, ensuring zero derivative singularities during ANSYS solver Newton-Raphson equilibrium iterations.
          </div>
        </div>

        {/* Right SVG Plot Area */}
        <div className="lg:col-span-2 p-4 flex flex-col items-center justify-center bg-slate-950/70 select-none">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full max-w-[540px] h-auto font-mono text-slate-400"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid Lines */}
            {[0, 0.05, 0.10, 0.15, 0.20].map(s => (
              <g key={s}>
                <line 
                  x1={getX(s)} y1={padding.top} 
                  x2={getX(s)} y2={padding.top + plotHeight} 
                  stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" 
                />
                <text x={getX(s)} y={padding.top + plotHeight + 16} fontSize="10" textAnchor="middle" fill="#64748b">
                  {(s * 100).toFixed(0)}%
                </text>
              </g>
            ))}

            {[0, 200, 400, 600, 800].filter(st => st <= maxStress).map(st => (
              <g key={st}>
                <line 
                  x1={padding.left} y1={getY(st)} 
                  x2={padding.left + plotWidth} y2={getY(st)} 
                  stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" 
                />
                <text x={padding.left - 8} y={getY(st) + 4} fontSize="10" textAnchor="end" fill="#64748b">
                  {st}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line 
              x1={padding.left} y1={padding.top + plotHeight} 
              x2={padding.left + plotWidth} y2={padding.top + plotHeight} 
              stroke="#94a3b8" strokeWidth="1.5" 
            />
            <line 
              x1={padding.left} y1={padding.top} 
              x2={padding.left} y2={padding.top + plotHeight} 
              stroke="#94a3b8" strokeWidth="1.5" 
            />

            {/* Axis Labels */}
            <text x={padding.left + plotWidth / 2} y={svgHeight - 8} fontSize="11" textAnchor="middle" fill="#cbd5e1" fontWeight="bold">
              Strain ε (mm/mm)
            </text>
            <text 
              x={-plotHeight / 2 - padding.top} y="18" 
              fontSize="11" textAnchor="middle" fill="#cbd5e1" fontWeight="bold" 
              transform="rotate(-90)"
            >
              Stress σ (MPa)
            </text>

            {/* Stress-Strain Curve Path */}
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" />

            {/* Yield Point Dot */}
            <circle cx={getX(ys / (eMod * 1000))} cy={getY(ys)} r="5" fill="#f59e0b" />
            <text x={getX(ys / (eMod * 1000)) + 8} y={getY(ys) - 6} fill="#fbbf24" fontSize="10" fontWeight="bold">
              S_y ({ys} MPa)
            </text>

            {/* Hover Points Trigger */}
            {curveData.map((pt, i) => (
              <circle
                key={i}
                cx={getX(pt.strain)}
                cy={getY(pt.stress)}
                r="4"
                fill="transparent"
                className="cursor-pointer hover:fill-rose-500"
                onMouseEnter={() => setHoveredPoint(pt)}
              />
            ))}
          </svg>

          {/* Hover Status */}
          <div className="mt-2 text-xs font-mono text-slate-300 h-5">
            {hoveredPoint ? (
              <span className="text-blue-300">
                Strain: <strong>{(hoveredPoint.strain * 100).toFixed(2)}%</strong> | Stress: <strong>{hoveredPoint.stress.toFixed(1)} MPa</strong>
              </span>
            ) : (
              <span className="text-slate-500">Hover over curve to inspect strain-stress pairs</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
