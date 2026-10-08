// Engineering Terminology & Glossary Database
// Verified against ASME BPVC Section VIII, Section II, B31.3, EJMA 11th Ed, and WRC Bulletins

export const GLOSSARY_TERMS = [
  {
    term: 'Allowable Stress (S / Sa)',
    category: 'Materials & Stress',
    definition: 'The maximum permissible stress magnitude permitted by code rules under specified operating or design conditions.',
    engineeringContext: 'In ASME Section VIII Division 1, allowable stress is based on the lesser of 2/3 of yield strength (Sy) or tensile strength (Su) divided by 3.5. In Division 2 Class 2, the design margin on tensile strength is reduced to 2.4, permitting higher allowable stresses.',
    relatedModules: ['Nozzle Analysis', 'Flange Analysis', 'Saddle Analysis', 'Tubesheet Analysis', 'ASME Materials'],
    relatedParameters: ['S', 'Sa', 'Sd', 'Sy', 'Su'],
    relatedStandards: 'ASME Section II Part D (Table 1A, Table 2A, Table 5A)'
  },
  {
    term: 'Area Replacement Method',
    category: 'Nozzle Design',
    definition: 'A design-by-rule approach requiring that the cross-sectional metal area removed by a shell penetration be fully compensated by excess metal within defined dimensional limits.',
    engineeringContext: 'Under ASME VIII-1 UG-37, the required replacement area is A_req = d · tr · F. Metal located beyond 2d parallel to the vessel or 2.5tn normal to the vessel cannot be counted as compensating metal.',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard'],
    relatedParameters: ['A_req', 'A1', 'A2', 'A3', 'A4', 'A5', 'd', 'tr', 'tn'],
    relatedStandards: 'ASME Section VIII Div 1 UG-37, ASME Section VIII Div 2 Part 4.5'
  },
  {
    term: 'Axial Load / Thrust (P / FY)',
    category: 'Loads & Mechanics',
    definition: 'A direct normal force acting along the longitudinal or centerline axis of a component (e.g., nozzle neck, bellows, or tie rod).',
    engineeringContext: 'In nozzle-shell intersections, radial thrust pushes inward or pulls outward on the vessel wall, creating axisymmetric membrane and bending dish deformations evaluated via WRC 107/537.',
    relatedModules: ['Nozzle Analysis', 'Bellows Analysis', 'Trunnion Analysis'],
    relatedParameters: ['P', 'FY', 'Fx', 'Fz'],
    relatedStandards: 'WRC Bulletin 537 / 107, EJMA 11th Edition'
  },
  {
    term: 'Bellows (Expansion Joint)',
    category: 'Components',
    definition: 'A flexible, thin-walled corrugated metallic shell element designed to absorb thermal expansion, mechanical vibrations, and angular misalignments while containing fluid pressure.',
    engineeringContext: 'Bellows convolutions flex elastically and plastically. Key failure modes include hoop rupture, column squirm (elastic instability), in-plane squirm (meridional plastic rotation), and low-cycle fatigue.',
    relatedModules: ['Bellows Analysis'],
    relatedParameters: ['Db', 'Nc', 'q', 'w', 'tn', 'np'],
    relatedStandards: 'EJMA 11th Edition, ASME Section VIII Div 1 Appendix 26'
  },
  {
    term: 'Bending Moment (M / ML / MC / MT)',
    category: 'Loads & Mechanics',
    definition: 'A mechanical force couple acting at a distance from a reference axis that induces flexural curvature and varying through-thickness tensile and compressive stresses.',
    engineeringContext: 'In external nozzle loads, moments are resolved into Longitudinal Moment (ML, bending in vessel longitudinal plane), Circumferential Moment (MC, bending across vessel circumference), and Torsional Moment (MT, twisting nozzle neck).',
    relatedModules: ['Nozzle Analysis', 'Saddle Analysis', 'Trunnion Analysis', 'Lug Analysis'],
    relatedParameters: ['ML', 'MC', 'MT', 'Mo'],
    relatedStandards: 'WRC Bulletin 107 / 537 / 297'
  },
  {
    term: 'Bolt Preload & Pretension',
    category: 'Flange Engineering',
    definition: 'The initial axial tensile clamp load developed in flange stud bolts during cold assembly make-up to seat the gasket and prevent joint leakage.',
    engineeringContext: 'Under ASME Appendix 2, the bolt load required to seat the gasket without pressure is Wm2 = π·b·G·y. Under operating pressure, the bolt load must counteract fluid hydrostatic end force while maintaining gasket seating pressure: Wm1 = (π/4·G²·P) + (2·b·π·G·m·P).',
    relatedModules: ['Flange Analysis'],
    relatedParameters: ['Wm1', 'Wm2', 'b', 'G', 'm', 'y', 'Bolt Pretension'],
    relatedStandards: 'ASME Section VIII Div 1 Appendix 2, ASME PCC-1'
  },
  {
    term: 'Buckling & Bifurcation Instability',
    category: 'Failure Modes',
    definition: 'A sudden, non-linear geometric failure mode where a thin-walled shell or column under compressive stress snaps into a deformed shape at stresses well below material yield.',
    engineeringContext: 'Vessels under vacuum or external pressure, as well as bellows under pressure thrust, can buckle. Stiffener rings are spaced at intervals Ls to divide the shell into short, unbuckled cylindrical segments.',
    relatedModules: ['Stiffener Analysis', 'Bellows Analysis'],
    relatedParameters: ['Ls', 'Is', 'Pa', 'Factor of Safety'],
    relatedStandards: 'ASME Section VIII Div 1 UG-28 / UG-29, ASME Section VIII Div 2 Part 5.4'
  },
  {
    term: 'CAD AI & Parametric Geometry',
    category: 'Design Automation',
    definition: 'Artificial intelligence-assisted translation of engineering prompt specifications into constraint-validated 3D boundary representation (B-Rep) solid CAD models.',
    engineeringContext: 'Translates vessel diameter, head aspect ratios, and nozzle positions into standardized STEP / IGES formats. Requires strict engineering review because geometric validity does not equate to ASME structural compliance.',
    relatedModules: ['CAD AI', 'Nova Website'],
    relatedParameters: ['STEP', 'IGES', 'Parasolid', 'B-Rep'],
    relatedStandards: 'ISO 10303 (STEP AP203/AP214)'
  },
  {
    term: 'Circumferential (Hoop) Stress',
    category: 'Stress Categories',
    definition: 'The membrane tensile stress acting tangentially to the cylinder circumference caused by radial internal fluid pressure.',
    engineeringContext: 'Derived from force equilibrium on a longitudinal half-cylinder cut: σ_hoop = (P·R)/t. Because hoop stress is exactly double longitudinal stress under internal pressure, longitudinal seam welds govern shell thickness.',
    relatedModules: ['Nozzle Analysis', 'Saddle Analysis', 'Stiffener Analysis'],
    relatedParameters: ['P', 'R', 't', 'E', 'S'],
    relatedStandards: 'ASME Section VIII Div 1 UG-27(c)(1)'
  },
  {
    term: 'Design-by-Analysis (DBA)',
    category: 'Design Philosophy',
    definition: 'A numerical continuum mechanics framework (FEA) evaluating detailed local stress tensors against fundamental failure modes (plastic collapse, local failure, buckling, cyclic fatigue).',
    engineeringContext: 'Enforced by ASME Section VIII Division 2 (Part 5). Removes empirical thickness formulas in favor of stress linearization along Stress Classification Lines (SCL) and elastic-plastic non-linear simulation.',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard', 'Hot Box Analysis'],
    relatedParameters: ['Pm', 'PL', 'Pb', 'Q', 'F', 'SCL'],
    relatedStandards: 'ASME Section VIII Division 2 Part 5'
  },
  {
    term: 'Design-by-Rule (DBR)',
    category: 'Design Philosophy',
    definition: 'A traditional engineering approach relying on closed-form empirical equations, conservative safety margins, and prescriptive geometric tables.',
    engineeringContext: 'The core architecture of ASME Section VIII Division 1. Relies on simplified formulas (UG-27, UG-32, UG-37, Appendix 2) with a higher design margin (3.5 on tensile strength) to accommodate uncalculated secondary peak stresses.',
    relatedModules: ['Nozzle Analysis', 'Flange Analysis', 'Saddle Analysis', 'Tubesheet Analysis'],
    relatedParameters: ['UG-27', 'UG-32', 'UG-37', 'UW-12'],
    relatedStandards: 'ASME Section VIII Division 1'
  },
  {
    term: 'Design Pressure (P)',
    category: 'Design Conditions',
    definition: 'The coincident pressure specified for the design of a vessel component at its design temperature, used to determine minimum required thicknesses.',
    engineeringContext: 'Design pressure must not be exceeded by the Maximum Allowable Working Pressure (MAWP). Must account for static head of fluid, safety relief valve setpoint margins, and upset transient conditions.',
    relatedModules: ['Nozzle Analysis', 'Bellows Analysis', 'Flange Analysis', 'Tubesheet Analysis', 'Saddle Analysis'],
    relatedParameters: ['P', 'MAWP', 'Static Head', 'Relief Margin'],
    relatedStandards: 'ASME Section VIII Div 1 UG-21'
  },
  {
    term: 'Design Temperature (T)',
    category: 'Design Conditions',
    definition: 'The maximum and minimum coincident metal temperature expected in service at the coincident design pressure.',
    engineeringContext: 'Establishes the allowable stress (S) from ASME Section II-D. At elevated temperatures, creep rupture occurs; at sub-zero temperatures, brittle fracture risk necessitates MDMT evaluation under UCS-66.',
    relatedModules: ['All Modules'],
    relatedParameters: ['T', 'MDMT', 'Soaking Temp', 'Creep Limit'],
    relatedStandards: 'ASME Section VIII Div 1 UG-20, ASME Section II-D'
  },
  {
    term: 'Differential Thermal Expansion',
    category: 'Thermal Mechanics',
    definition: 'Relative movement resulting when adjacent structural components expand or contract at different rates due to temperature differences or differing coefficients of thermal expansion (α).',
    engineeringContext: 'Critical in fixed tubesheet heat exchangers (shell expansion vs. tube bundle expansion) and Hot Box vessel skirts (hot bottom head vs. cool support skirt foundation), causing high secondary thermal bending stresses.',
    relatedModules: ['Tubesheet Analysis', 'Hot Box Analysis', 'Bellows Analysis'],
    relatedParameters: ['α', 'ΔT', 'ΔL', 'Film Coefficient'],
    relatedStandards: 'TEMA RCB, ASME Section VIII-1 Part UHX'
  },
  {
    term: 'Effective Gasket Width (b)',
    category: 'Flange Engineering',
    definition: 'The empirical gasket width utilized in ASME Appendix 2 flange equations to calculate required bolt clamp loads.',
    engineeringContext: 'Calculated from the basic gasket seating width (b0). When b0 ≤ 6 mm, b = b0. When b0 > 6 mm, b = 2.52·√(b0) in mm, accounting for flange rotation and non-uniform face contact pressure.',
    relatedModules: ['Flange Analysis'],
    relatedParameters: ['b', 'b0', 'G', 'Gasket OD', 'Gasket ID'],
    relatedStandards: 'ASME Section VIII Div 1 Appendix 2 Table 2-5.2'
  },
  {
    term: 'Fatigue & Cycle Life (N / Nal)',
    category: 'Failure Modes',
    definition: 'Progressive structural damage and crack propagation occurring under repeated fluctuating stresses, culminating in sudden fracture after a finite number of load cycles.',
    engineeringContext: 'In bellows, evaluated per EJMA fatigue formulas using total equivalent stress range (St). In ASME Div 2 Part 5.5, evaluated using smooth bar fatigue design curves (Annex 3-F) or structural stress methods at weld toes.',
    relatedModules: ['Bellows Analysis', 'Nozzle Analysis', 'Hot Box Analysis'],
    relatedParameters: ['Nal', 'Cycles', 'Stress Range', 'Kf'],
    relatedStandards: 'EJMA 11th Ed, ASME Section VIII Div 2 Part 5.5'
  },
  {
    term: 'Flange Rigidity Index (J)',
    category: 'Flange Engineering',
    definition: 'A dimensionless stiffness criterion indicating whether a bolted flange resists excessive angular rotation that could unload the gasket and cause leakage.',
    engineeringContext: 'ASME Appendix 2 Equation (2-14) calculates the rigidity index J. The code mandates J ≤ 1.0. If J > 1.0, the flange face rotates excessively under bolt preload, pinching the outer gasket edge while unseating the inner diameter.',
    relatedModules: ['Flange Analysis'],
    relatedParameters: ['J', 'Flange Thickness', 'Hub Small End', 'Hub Length'],
    relatedStandards: 'ASME Section VIII Div 1 Appendix 2 (Non-mandatory Appendix 2-14)'
  },
  {
    term: 'Gasket Factors (m and y)',
    category: 'Flange Engineering',
    definition: 'Dimensionless maintenance factor (m) and minimum gasket yield seating stress (y) defining gasket sealing performance.',
    engineeringContext: 'm defines the ratio of residual compressive stress across the gasket to the internal fluid pressure required to prevent blow-by under operating conditions. y represents the minimum initial contact pressure required to seat the gasket into flange surface asperities.',
    relatedModules: ['Flange Analysis'],
    relatedParameters: ['m', 'y', 'Wm1', 'Wm2'],
    relatedStandards: 'ASME Section VIII Div 1 Appendix 2 Table 2-5.1'
  },
  {
    term: 'Hot Box (Skirt Junction)',
    category: 'Components & Thermal',
    definition: 'An insulated structural transition chamber constructed around the junction between a high-temperature vertical pressure vessel bottom head and its cylindrical support skirt.',
    engineeringContext: 'Acts as a thermal barrier preventing steep axial temperature gradients along the support skirt. Without a hot box, heat conducted from the hot head (e.g. 400°C) into the air-cooled skirt creates localized cyclic thermal bending stresses leading to skirt crotch cracking.',
    relatedModules: ['Hot Box Analysis'],
    relatedParameters: ['Head THK', 'Skirt THK', 'Insulation Support Location', 'Film Coeff'],
    relatedStandards: 'WRC Bulletin 438, API Recommended Practice 571'
  },
  {
    term: 'Joint Efficiency (E)',
    category: 'Welding & NDE',
    definition: 'A numerical factor (0.70 to 1.00) reducing the allowable stress of a welded joint based on the degree of volumetric non-destructive examination (NDE).',
    engineeringContext: 'Under ASME VIII-1 UW-12: Full Radiography (Full RT/UT) provides E = 1.00; Spot Examination provides E = 0.85; No Radiography gives E = 0.70. A higher joint efficiency directly reduces the required shell thickness.',
    relatedModules: ['Nozzle Analysis', 'Saddle Analysis', 'Tubesheet Analysis'],
    relatedParameters: ['E', 'RT', 'UT', 'UW-12'],
    relatedStandards: 'ASME Section VIII Div 1 Table UW-12'
  },
  {
    term: 'Ligament Efficiency (μ)',
    category: 'Tubesheet Design',
    definition: 'The ratio of net load-bearing solid metal width between adjacent tube holes in a tubesheet to the nominal tube pitch spacing.',
    engineeringContext: 'For triangular pitch: μ = (p - do) / p. The perforated tubesheet is treated as an equivalent solid plate with effective anisotropic elastic modulus (E*) and effective Poisson’s ratio (ν*) per ASME UHX.',
    relatedModules: ['Tubesheet Analysis'],
    relatedParameters: ['μ', 'p', 'do', 'E*', 'ν*'],
    relatedStandards: 'ASME Section VIII Div 1 Part UHX, TEMA RCB-7'
  },
  {
    term: 'Local Failure (Triaxial Strain Limit)',
    category: 'Failure Modes',
    definition: 'Ductile tearing and void nucleation occurring in regions experiencing high triaxial tensile hydrostatic stress fields.',
    engineeringContext: 'ASME Section VIII Division 2 (Part 5.3) protects against local failure by limiting the total equivalent plastic strain (ε_peq) to a triaxial strain limit function (ε_L) dependent on stress triaxiality: (σ1 + σ2 + σ3) / (3 · σ_eq).',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard'],
    relatedParameters: ['ε_peq', 'ε_L', 'Triaxiality Factor'],
    relatedStandards: 'ASME Section VIII Division 2 Part 5.3'
  },
  {
    term: 'Membrane Stress (Pm / PL)',
    category: 'Stress Categories',
    definition: 'The average uniform through-thickness component of normal or shear stress acting across a solid cross-section.',
    engineeringContext: 'Membrane stress resists gross cross-sectional forces. General Primary Membrane (Pm) is not self-limiting and must not exceed 1.0·S. Local Primary Membrane (PL) occurs near discontinuities (e.g. nozzles, support skirts) and is permitted up to 1.5·S.',
    relatedModules: ['Nozzle Analysis', 'Saddle Analysis', 'Trunnion Analysis'],
    relatedParameters: ['Pm', 'PL', 'SCL', 'Stress Linearization'],
    relatedStandards: 'ASME Section VIII Div 2 Part 5.2'
  },
  {
    term: 'Minimum Design Metal Temperature (MDMT)',
    category: 'Materials & Toughness',
    definition: 'The lowest permissible metal temperature at which equipment can safely operate at full design pressure without risk of catastrophic brittle fracture.',
    engineeringContext: 'Determined in ASME VIII-1 via UCS-66 curves A, B, C, D based on material specification, heat treatment, and governing nominal thickness. Operating below the MDMT requires mandatory Charpy V-notch impact testing.',
    relatedModules: ['ASME Materials', 'Nozzle Analysis'],
    relatedParameters: ['MDMT', 'UCS-66', 'Impact Energy', 'Curve A/B/C/D'],
    relatedStandards: 'ASME Section VIII Div 1 UCS-66, ASME Section VIII Div 2 Part 3.11'
  },
  {
    term: 'Nozzle Projection (Np)',
    category: 'Geometry',
    definition: 'The outward distance from the outer surface of the vessel shell or head centerline to the outer sealing face of the nozzle flange.',
    engineeringContext: 'Must provide sufficient clearance for stud bolt removal, insulation jacket installation, and external piping weld access while minimizing the cantilevered bending moment arm caused by external piping reactions.',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard'],
    relatedParameters: ['Np', 'Projection Length', 'Flange Face'],
    relatedStandards: 'ASME B16.5, WRC 107'
  },
  {
    term: 'Plastic Collapse (Limit Load)',
    category: 'Failure Modes',
    definition: 'The unbounded gross plastic deformation occurring throughout a structure when the full cross-section yields, eliminating static equilibrium.',
    engineeringContext: 'ASME Section VIII Division 2 (Part 5.2) mandates protection against plastic collapse using one of three approaches: Elastic Stress Analysis with SCL limits, Limit Load Analysis with elastic-perfectly plastic material, or Elastic-Plastic FEA.',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard', 'Stress-Strain Curve'],
    relatedParameters: ['Collapse Load', 'Limit Load', 'Design Margin'],
    relatedStandards: 'ASME Section VIII Division 2 Part 5.2'
  },
  {
    term: 'Post-Weld Heat Treatment (PWHT)',
    category: 'Fabrication & Thermal',
    definition: 'A controlled thermal cycle in which a welded structure is heated to a sub-critical temperature, soaked for a specified time, and slowly cooled to relieve weld residual stresses.',
    engineeringContext: 'Reduces residual tensile peak stresses caused by weld metal shrinkage, tempers brittle martensitic heat-affected zone (HAZ) microstructures, drives out entrapped diffusible hydrogen, and improves fracture toughness.',
    relatedModules: ['Local PWHT'],
    relatedParameters: ['Soaking Temp', 'Holding Time', 'Heating Rate', 'Cooling Rate', 'SB', 'HB', 'IB'],
    relatedStandards: 'ASME Section VIII Div 1 UW-40, WRC Bulletin 452'
  },
  {
    term: 'Reinforcing Pad (Repad)',
    category: 'Components',
    definition: 'A doughnut-shaped curved plate welded to the outside (or inside) of a vessel shell surrounding a nozzle penetration to restore structural area removed by the opening.',
    engineeringContext: 'Adds compensating area A5 in ASME UG-37. Repads require a threaded telltale weep hole (typically 1/4" NPT) to vent gases during welding and allow detection of leakage past the nozzle-to-shell weld during hydrotest.',
    relatedModules: ['Nozzle Analysis', 'Trunnion Analysis'],
    relatedParameters: ['Pad OD', 'Pad THK', 'Wep Hole', 'A5'],
    relatedStandards: 'ASME Section VIII Div 1 UG-37 / UG-40'
  },
  {
    term: 'Saddle Horn Stress (S3)',
    category: 'Saddle Analysis',
    definition: 'High localized circumferential bending and membrane stresses generated at the topmost tip (horn) of a twin-saddle horizontal vessel support.',
    engineeringContext: 'Evaluated using the Zick empirical method. Because the saddle restrains downward displacement while the upper shell flexes outward under fluid weight, peak circumferential stresses concentrate at the saddle horn. Wear plates are commonly added to prevent localized shell rupture.',
    relatedModules: ['Saddle Analysis'],
    relatedParameters: ['S3', 'Saddle Angle (θ)', 'Wear Plate Width', 'Wear Plate THK'],
    relatedStandards: 'Zick Method (1951), ASME Section VIII Div 2 Part 4.15'
  },
  {
    term: 'Secondary Stress (Q)',
    category: 'Stress Categories',
    definition: 'A normal or shear stress developed by self-constraint of adjacent parts or by thermal gradients, which is self-limiting because localized plastic yield relieves the driving displacement.',
    engineeringContext: 'Unlike primary stresses, secondary stresses do not cause plastic collapse on a single load application. They are limited to (P + Q) ≤ 3.0·S (the shakedown limit) to prevent incremental plastic ratcheting under repeated thermal/pressure cycles.',
    relatedModules: ['Nozzle Analysis', 'Hot Box Analysis', 'Tubesheet Analysis'],
    relatedParameters: ['Q', 'P + Q', '3S Limit', 'Shakedown'],
    relatedStandards: 'ASME Section VIII Division 2 Part 5.2'
  },
  {
    term: 'Squirm (Bellows Instability)',
    category: 'Failure Modes',
    definition: 'A sudden lateral or in-plane buckling instability occurring in a pressurized bellows expansion joint under internal pressure thrust.',
    engineeringContext: 'Column Squirm: The bellows behaves like an Euler column and bows laterally when internal pressure creates an effective axial compressive force exceeding the column limit. In-plane Squirm: Individual convolutions tilt and warp plastically, opening on one side and closing on the other.',
    relatedModules: ['Bellows Analysis'],
    relatedParameters: ['Column Squirm Pressure', 'In-plane Squirm Pressure', 'Db', 'Nc'],
    relatedStandards: 'EJMA 11th Edition Section C'
  },
  {
    term: 'Stress Classification Line (SCL)',
    category: 'FEA Methodology',
    definition: 'A straight line segment oriented through the wall thickness of an FEA solid continuum model along which the stress tensor is linearized into membrane, bending, and peak components.',
    engineeringContext: 'Enforced by ASME Section VIII Division 2 Part 5. Must be oriented perpendicular to the mid-surface of the wall. Tensile and shear stress components are integrated along the line to derive σ_m, σ_b, and F tensors for failure mode evaluation.',
    relatedModules: ['Nozzle Analysis', 'Ansys ACT Wizard', 'Hot Box Analysis'],
    relatedParameters: ['SCL', 'Pm', 'PL', 'Pb', 'Q', 'F'],
    relatedStandards: 'ASME Section VIII Division 2 Annex 5-A'
  },
  {
    term: 'Stress-Strain Curve (True vs. Engineering)',
    category: 'Materials & Mechanics',
    definition: 'A graphical relationship between applied mechanical stress and resulting strain. Engineering stress/strain reference initial geometry (A0, L0); true stress/strain reference instantaneous instantaneous dimensions.',
    engineeringContext: 'True Stress σ_true = σ_eng · (1 + ε_eng); True Strain ε_true = ln(1 + ε_eng). For non-linear elastic-plastic FEA, ASME Section VIII-2 Annex 3-D provides mathematical equations converting Section II-D Sy and Su values into true stress-strain curves.',
    relatedModules: ['Stress-Strain Curve', 'Ansys ACT Wizard'],
    relatedParameters: ['σy', 'σuts', 'Ey', 'εp', 'm2', 'MISO', 'KINH'],
    relatedStandards: 'ASME Section VIII Division 2 Annex 3-D'
  },
  {
    term: 'Trunnion Support',
    category: 'Components & Lifting',
    definition: 'A cylindrical pipe stub welded perpendicularly to a vessel shell, equipped with a bail ring, designed to serve as a pivot bearing point during vertical equipment erection or rigging.',
    engineeringContext: 'Subject to heavy bending moments and transverse shear during upending from horizontal transport to vertical foundation placement. WRC 537 evaluates resulting localized shell longitudinal and circumferential stresses.',
    relatedModules: ['Trunnion Analysis'],
    relatedParameters: ['Trunnion OD', 'Projection Length', 'Bail Width', 'Pull Angle'],
    relatedStandards: 'WRC Bulletin 537, ASME Section VIII Div 2 Part 5'
  },
  {
    term: 'Tubesheet (Heat Exchanger)',
    category: 'Components',
    definition: 'A heavy circular plate perforated with a regular pattern of tube holes, separating shell-side and tube-side fluids and supporting the tube bundle.',
    engineeringContext: 'Acts as a flat plate subjected to differential pressure (tube-side vs shell-side), bolt moments, and axial tube bundle restraint. Evaluated per ASME VIII-1 Part UHX / TEMA for bending, shear, and tube-to-tubesheet joint pull-out capacity.',
    relatedModules: ['Tubesheet Analysis'],
    relatedParameters: ['ts_thk', 'tube_pitch', 'tube_od', 'ligament efficiency'],
    relatedStandards: 'ASME Section VIII Div 1 Part UHX, TEMA 10th Edition'
  },
  {
    term: 'WRC Bulletin 107 / 537 / 297',
    category: 'Analytical Standards',
    definition: 'Authoritative technical bulletins published by the Welding Research Council for calculating localized membrane and bending stresses in cylindrical and spherical shells subjected to external nozzle loads.',
    engineeringContext: 'WRC 107 (1965) / WRC 537 (2010 precision update) provides Bijlaard non-dimensional curves for solid rectangular and cylindrical attachments. WRC 297 extends the methodology to large diameter-to-thickness shell ratios with hollow nozzle necks.',
    relatedModules: ['Nozzle Analysis', 'Lug Analysis', 'Trunnion Analysis'],
    relatedParameters: ['β', 'γ', 'P', 'VL', 'VC', 'ML', 'MC', 'MT'],
    relatedStandards: 'WRC Bulletin 537, WRC Bulletin 297, WRC Bulletin 107'
  },
  {
    term: 'Yield Strength (Sy)',
    category: 'Materials & Strength',
    definition: 'The stress level at which a metallic material begins to deform plastically and permanently, typically determined by the 0.2% offset strain method.',
    engineeringContext: 'Fundamental basis for ASME design stress limits. At ambient temperatures, carbon steel yield strength is governed by room temperature tests (e.g. 260 MPa for SA-516 Gr. 70). At high temperatures, Sy declines steeply per ASME Section II-D Table Y-1.',
    relatedModules: ['ASME Materials', 'Stress-Strain Curve', 'All Analyses'],
    relatedParameters: ['Sy', '0.2% Offset', 'Elastic Limit'],
    relatedStandards: 'ASME Section II Part D Table Y-1, ASTM A370'
  },
  {
    term: 'Zick Method',
    category: 'Analytical Standards',
    definition: 'The industry-standard semi-empirical analytical formulation developed by L.P. Zick (1951) for evaluating structural stresses in horizontal cylindrical pressure vessels resting on two saddle supports.',
    engineeringContext: 'Calculates: (1) Maximum longitudinal bending stress at midspan and over the saddles, (2) Tangential shear stress in the shell, (3) Circumferential bending and tensile stress at the saddle horn, and (4) Circumferential compressive stress in the shell ring.',
    relatedModules: ['Saddle Analysis'],
    relatedParameters: ['S1', 'S2', 'S3', 'Saddle Location (A)', 'Saddle Angle (θ)'],
    relatedStandards: 'Welding Journal Research Supplement 1951, ASME Section VIII-2 Part 4.15'
  }
];
