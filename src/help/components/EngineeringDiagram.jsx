import React, { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * Clean White Technical Vector Engineering Schematics
 * Architectural engineering drawing style on crisp white paper background
 */
export default function EngineeringDiagram({ type = 'nozzle', caption, title }) {
  const [activeElement, setActiveElement] = useState(null);

  return (
    <div 
      className="my-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Schematic Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-800 font-mono">
            {title || `Technical Engineering Schematic: ${type.toUpperCase()}`}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Precision Vector CAD
        </div>
      </div>

      {/* SVG Canvas Area - Clean White Drafting Paper Style */}
      <div className="p-4 sm:p-6 flex items-center justify-center bg-white overflow-x-auto min-h-[300px] border-b border-slate-100">
        {renderDiagramSvg(type, activeElement, setActiveElement)}
      </div>

      {/* Active Element Context Bar */}
      {activeElement && (
        <div className="px-4 py-2.5 bg-blue-50 border-t border-blue-200 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>{activeElement.name}:</strong> {activeElement.desc}
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200 font-bold shadow-2xs">
            {activeElement.code}
          </span>
        </div>
      )}

      {/* Caption Footer */}
      {caption && (
        <div className="px-4 py-2 bg-slate-50 text-[11px] text-slate-500 italic text-center">
          {caption}
        </div>
      )}
    </div>
  );
}

function renderDiagramSvg(type, activeElement, setActiveElement) {
  switch (type) {
    case 'nozzle':
      return (
        <svg viewBox="0 0 650 360" className="w-full max-w-[620px] h-auto text-slate-700 select-none font-mono">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
            <marker id="loadArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#e11d48" />
            </marker>
          </defs>

          {/* Clean Engineering Grid Lines */}
          <pattern id="lightgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          </pattern>
          <rect width="650" height="360" fill="url(#lightgrid)" />

          {/* Main Vessel Shell Cylindrical Wall */}
          <path 
            d="M 50,260 C 200,285 450,285 600,260 L 600,300 C 450,325 200,325 50,300 Z" 
            fill="#f8fafc" 
            stroke="#334155" 
            strokeWidth="2.5"
            className="cursor-pointer hover:fill-blue-50/50 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Vessel Shell (D_i, T_v)', desc: 'Cylindrical or dished shell wall providing primary membrane pressure containment.', code: 'UG-27 / Part 4' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Reinforcement Pad (RF Pad) */}
          <ellipse 
            cx="325" cy="265" rx="140" ry="25" 
            fill="#e2e8f0" 
            stroke="#0284c7" 
            strokeWidth="2" 
            strokeDasharray="4 2"
            className="cursor-pointer hover:fill-sky-100 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Reinforcement Pad (W_p, T_p)', desc: 'Optional supplementary plate welded to shell to replenish opening area removal.', code: 'UG-37 / UW-16' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Attachment Fillet Welds */}
          <path d="M 260,260 L 268,266 L 260,268 Z" fill="#d97706" />
          <path d="M 390,260 L 382,266 L 390,268 Z" fill="#d97706" />

          {/* Nozzle Neck Cylinder */}
          <path 
            d="M 265,90 L 265,260 C 300,266 350,266 385,260 L 385,90 Z" 
            fill="#ffffff" 
            stroke="#0284c7" 
            strokeWidth="2.5"
            className="cursor-pointer hover:fill-blue-50 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Nozzle Neck (d_i, t_n)', desc: 'Cylindrical branch pipe penetrating vessel opening.', code: 'UG-45 / WRC 537' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Nozzle Flange Top Rim */}
          <rect x="250" y="70" width="150" height="20" rx="3" fill="#f1f5f9" stroke="#0284c7" strokeWidth="2" />
          <circle cx="270" cy="80" r="3" fill="#64748b" />
          <circle cx="380" cy="80" r="3" fill="#64748b" />

          {/* Centerline */}
          <line x1="325" y1="40" x2="325" y2="330" stroke="#dc2626" strokeWidth="1" strokeDasharray="8 4 2 4" opacity="0.7" />

          {/* External Piping Load Vectors */}
          {/* Radial Thrust P */}
          <line x1="325" y1="20" x2="325" y2="60" stroke="#e11d48" strokeWidth="3" markerEnd="url(#loadArrow)" />
          <text x="335" y="45" fill="#e11d48" fontSize="12" fontWeight="bold">Radial Load (P)</text>

          {/* Shear Forces */}
          <line x1="410" y1="80" x2="460" y2="80" stroke="#e11d48" strokeWidth="2.5" markerEnd="url(#loadArrow)" />
          <text x="465" y="85" fill="#e11d48" fontSize="11" fontWeight="bold">V_L / V_C</text>

          {/* Overturning Moments */}
          <path d="M 400,120 A 25 25 0 0 1 400,160" fill="none" stroke="#e11d48" strokeWidth="2.5" markerEnd="url(#loadArrow)" />
          <text x="430" y="145" fill="#e11d48" fontSize="11" fontWeight="bold">Moment (M_L / M_C)</text>

          {/* Dimensional Annotations */}
          {/* Nozzle Inner Diameter d */}
          <line x1="265" y1="120" x2="385" y2="120" stroke="#475569" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="325" y="115" fill="#1e293b" fontSize="11" textAnchor="middle" fontWeight="bold">d_i (ID)</text>

          {/* Shell Thickness T */}
          <line x1="580" y1="260" x2="580" y2="300" stroke="#0284c7" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="590" y="285" fill="#0284c7" fontSize="11" fontWeight="bold">T_v</text>

          {/* Stress Classification Line (SCL) Crotch Corner */}
          <line x1="265" y1="260" x2="230" y2="280" stroke="#9333ea" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx="265" cy="260" r="4" fill="#9333ea" />
          <text x="160" y="295" fill="#9333ea" fontSize="10" fontWeight="bold">Crotch SCL Path (P_L + P_b)</text>
        </svg>
      );

    case 'bellows':
      return (
        <svg viewBox="0 0 650 340" className="w-full max-w-[620px] h-auto text-slate-700 select-none font-mono">
          <defs>
            <marker id="arrowB" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Centerline */}
          <line x1="40" y1="170" x2="610" y2="170" stroke="#dc2626" strokeWidth="1" strokeDasharray="8 4 2 4" opacity="0.6" />

          {/* Convolutions (U-shaped multi-ply profile) */}
          <path 
            d="M 120,110 
               L 160,110 
               C 160,50 190,50 190,110 
               C 190,50 220,50 220,110 
               C 220,50 250,50 250,110 
               C 250,50 280,50 280,110 
               C 280,50 310,50 310,110 
               C 310,50 340,50 340,110 
               C 340,50 370,50 370,110 
               C 370,50 400,50 400,110 
               C 400,50 430,50 430,110 
               L 480,110" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="3.5"
            className="cursor-pointer hover:stroke-amber-600 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Convolution Profile (w, q, t)', desc: 'Flexible metallic corrugation absorbing axial, lateral, and angular piping movements.', code: 'EJMA 11th Ed' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Mirror Lower Convolutions */}
          <path 
            d="M 120,230 
               L 160,230 
               C 160,290 190,290 190,230 
               C 190,290 220,290 220,230 
               C 220,290 250,290 250,230 
               C 250,290 280,290 280,230 
               C 280,290 310,290 310,230 
               C 310,290 340,290 340,230 
               C 340,290 370,290 370,230 
               C 370,290 400,290 400,230 
               C 400,290 430,290 430,230 
               L 480,230" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="3.5" 
          />

          {/* Left Tangent Collar & Flange */}
          <rect x="80" y="80" width="40" height="180" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
          <text x="100" y="175" fill="#334155" fontSize="10" textAnchor="middle" fontWeight="bold">Weld Neck</text>

          {/* Right Tangent Collar & Flange */}
          <rect x="480" y="80" width="40" height="180" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
          <text x="500" y="175" fill="#334155" fontSize="10" textAnchor="middle" fontWeight="bold">Weld Neck</text>

          {/* Internal Flow Sleeve */}
          <line x1="120" y1="130" x2="420" y2="130" stroke="#d97706" strokeWidth="2" strokeDasharray="6 3" />
          <line x1="120" y1="210" x2="420" y2="210" stroke="#d97706" strokeWidth="2" strokeDasharray="6 3" />
          <text x="270" y="145" fill="#b45309" fontSize="10" fontWeight="bold">Internal Flow Sleeve (Prevents Erosion / Vortices)</text>

          {/* Dimensional Callouts */}
          {/* Pitch q */}
          <line x1="220" y1="40" x2="250" y2="40" stroke="#0284c7" strokeWidth="1" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
          <text x="235" y="32" fill="#0284c7" fontSize="10" textAnchor="middle" fontWeight="bold">Pitch (q)</text>

          {/* Convolution Depth w */}
          <line x1="445" y1="50" x2="445" y2="110" stroke="#0284c7" strokeWidth="1" markerStart="url(#arrowB)" markerEnd="url(#arrowB)" />
          <text x="455" y="85" fill="#0284c7" fontSize="10" fontWeight="bold">Height (w)</text>

          {/* Internal Pressure Thrust */}
          <line x1="535" y1="170" x2="590" y2="170" stroke="#e11d48" strokeWidth="2.5" markerEnd="url(#arrowB)" />
          <text x="540" y="195" fill="#e11d48" fontSize="10" fontWeight="bold">Pressure Thrust F = P·A_e</text>
        </svg>
      );

    case 'flange':
      return (
        <svg viewBox="0 0 650 340" className="w-full max-w-[620px] h-auto text-slate-700 select-none font-mono">
          <defs>
            <marker id="arrowF" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Flange Ring Cross Section (Top) */}
          <path 
            d="M 220,60 L 420,60 L 420,130 L 370,130 L 350,210 L 290,210 L 270,130 L 220,130 Z" 
            fill="#f8fafc" 
            stroke="#0284c7" 
            strokeWidth="2.5"
            className="cursor-pointer hover:fill-blue-50 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Flange Ring Hub (A, B, C, t)', desc: 'Weld neck or slip-on forged body resisting internal pressure and gasket bolt moment.', code: 'ASME B16.5 / VIII-1 App 2' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Bolt Hole Cavity */}
          <rect x="235" y="60" width="22" height="70" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 2" />
          <rect x="385" y="60" width="22" height="70" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 2" />

          {/* Stud Bolt with Preload Arrows */}
          <rect x="240" y="40" width="12" height="110" rx="2" fill="#cbd5e1" stroke="#64748b" />
          <rect x="390" y="40" width="12" height="110" rx="2" fill="#cbd5e1" stroke="#64748b" />

          {/* Raised Face (RF) Surface */}
          <rect x="280" y="55" width="80" height="5" fill="#f59e0b" />
          <text x="320" y="48" fill="#d97706" fontSize="10" textAnchor="middle" fontWeight="bold">Raised Face Gasket Contact</text>

          {/* Internal Fluid Pressure Bore */}
          <text x="320" y="160" fill="#0284c7" fontSize="11" textAnchor="middle" fontWeight="bold">Bore B (ID)</text>

          {/* Bolt Circle C */}
          <line x1="246" y1="20" x2="396" y2="20" stroke="#0284c7" strokeWidth="1" markerStart="url(#arrowF)" markerEnd="url(#arrowF)" />
          <text x="321" y="15" fill="#0284c7" fontSize="10" textAnchor="middle" fontWeight="bold">Bolt Circle (C)</text>

          {/* Outside Diameter A */}
          <line x1="220" y1="270" x2="420" y2="270" stroke="#475569" strokeWidth="1" markerStart="url(#arrowF)" markerEnd="url(#arrowF)" />
          <text x="320" y="290" fill="#475569" fontSize="10" textAnchor="middle" fontWeight="bold">Outside Diameter (A)</text>
        </svg>
      );

    case 'saddle':
      return (
        <svg viewBox="0 0 650 340" className="w-full max-w-[620px] h-auto text-slate-700 select-none font-mono">
          <defs>
            <marker id="arrowS" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Cylindrical Vessel Horizontal Shell */}
          <rect x="60" y="80" width="520" height="120" rx="40" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" />
          <line x1="40" y1="140" x2="600" y2="140" stroke="#dc2626" strokeWidth="1" strokeDasharray="8 4" opacity="0.6" />

          {/* Left Saddle Support */}
          <path 
            d="M 160,185 L 140,280 L 220,280 L 200,185 Z" 
            fill="#e2e8f0" 
            stroke="#475569" 
            strokeWidth="2" 
            className="cursor-pointer hover:fill-blue-50 transition-colors"
            onMouseEnter={() => setActiveElement({ name: 'Twin Saddle Supports (b, theta)', desc: 'Fabricated cradle resisting gravity operating weight, seismic acceleration, and wind.', code: 'Zick Analysis / BS 5500' })}
            onMouseLeave={() => setActiveElement(null)}
          />

          {/* Right Saddle Support */}
          <path d="M 440,185 L 420,280 L 500,280 L 480,185 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

          {/* Critical Saddle Horn Stress Spot */}
          <circle cx="160" cy="185" r="7" fill="#e11d48" className="animate-ping" opacity="0.75" />
          <circle cx="160" cy="185" r="5" fill="#e11d48" />
          <text x="110" y="170" fill="#e11d48" fontSize="10" fontWeight="bold">Horn Bending (σ_6 / σ_7)</text>

          {/* Zick Dimensions */}
          {/* Distance a from tangent to saddle */}
          <line x1="60" y1="300" x2="180" y2="300" stroke="#0284c7" strokeWidth="1" markerStart="url(#arrowS)" markerEnd="url(#arrowS)" />
          <text x="120" y="318" fill="#0284c7" fontSize="10" textAnchor="middle" fontWeight="bold">Overhang a (≤ 0.25R)</text>

          {/* Span L between saddles */}
          <line x1="180" y1="300" x2="460" y2="300" stroke="#0284c7" strokeWidth="1" markerStart="url(#arrowS)" markerEnd="url(#arrowS)" />
          <text x="320" y="318" fill="#0284c7" fontSize="10" textAnchor="middle" fontWeight="bold">Span Length L</text>
        </svg>
      );

    default:
      return (
        <div className="py-12 text-center text-slate-500 font-mono text-xs">
          Interactive schematic for {type} is active. View parameter tables for dimensional data.
        </div>
      );
  }
}
