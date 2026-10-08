// Deep Engineering Documentation for All 10 Nova Analysis Modules
// Verified against ASME BPVC Section VIII, Section II-D, EJMA 11th Ed, WRC Bulletins, and TEMA Standards

export const ANALYSIS_ARTICLES = [
  // ==========================================
  // 1. NOZZLE ANALYSIS
  // ==========================================
  {
    id: 'nozzle-analysis',
    slug: 'nozzle-analysis',
    title: 'Nozzle Analysis: Shell & Head Penetration Stress Evaluation',
    category: 'Analysis Modules',
    badge: 'Core Pressure Vessel Module',
    discipline: 'Pressure Vessel & Piping',
    difficulty: 'Advanced',
    type: 'Guide & Reference',
    standard: 'ASME Section VIII Div 1 (UG-37) / Div 2 (Part 5) & WRC 107/537/297',
    version: 'Nova v2.4 / ACT 2024R2',
    readingTime: '22 min',
    lastReviewed: 'October 2026',
    summary: 'Comprehensive engineering guide for pressure vessel nozzle openings: area replacement rules, WRC 6-DOF external piping reactions, finite element stress linearization along SCLs, and reinforcement pad design.',
    
    depthContent: {
      beginner: 'A nozzle is a pipe welded into a hole cut into a pressure vessel shell or head to let fluids enter or exit. Cutting this hole weakens the vessel wall and creates stress concentrations. Nozzle analysis calculates whether the remaining wall thickness plus any added reinforcing pad can safely hold the pressure and external pipe loads without bursting or cracking.',
      engineer: 'Nozzle analysis evaluates two distinct stress mechanisms: (1) Internal pressure stress concentration ($K_t \\approx 2.5 - 3.1$) compensated via ASME Section VIII Div 1 UG-37 area replacement, and (2) Local bending and shear stresses caused by external piping thermal expansion forces and moments ($P, V_L, V_C, M_L, M_C, M_T$) evaluated via WRC Bulletin 537/107/297. For critical or heavy-wall vessels, 3D FEA with Stress Classification Lines (SCL) linearizes membrane ($P_m, P_L$) and bending ($P_b$) stresses against ASME Div 2 Part 5 allowable limits.',
      expert: 'In continuum mechanics, the cylinder-to-cylinder or head-to-cylinder intersection represents a geometric non-homogeneity producing biaxial or triaxial stress states. The Bijlaard formulation approximates the shell as a shallow shell subjected to radial distributed surface traction, expressing deflections through double Fourier series. Nova implements both WRC 537 non-dimensional coefficients ($\\beta = 0.875 r_o/R_m$, $\\gamma = R_m/T$) and direct 3D solid FEA using quadratic hexahedral elements (SOLID186). Stress linearization normal to the shell mid-surface decomposes the full tensor: $\\sigma_{m,ij} = \\frac{1}{t}\\int_0^t \\sigma_{ij}(x)dx$ and $\\sigma_{b,ij} = \\frac{6}{t^2}\\int_0^t \\sigma_{ij}(x)(t/2 - x)dx$, evaluating $P_L \\le 1.5S$, $P_L + P_b \\le 1.5S$, and $(P+Q) \\le 3.0S$ for shakedown.'
    },

    overview: `
A **pressure vessel nozzle** is a branch connection providing an interface between the pressure vessel containment shell and external piping networks, relief valves, instruments, or manways. 
Because cutting a hole in a cylindrical or dished shell interrupts the continuous membrane hoop stress field, the metal adjacent to the opening experiences localized stress concentrations that can exceed 300% of nominal shell hoop stress.

The **Nova Nozzle Analysis Module** provides a dual-methodology analysis engine:
1. **Design-by-Rule (DBR):** ASME Section VIII Division 1 UG-37 Area Replacement & WRC Bulletin 537/107/297 local piping load evaluations.
2. **Design-by-Analysis (DBA):** Fully automated 3D finite element meshing with parametric weld modeling and stress linearization per ASME Section VIII Division 2 (Part 5).
    `,

    purpose: 'To ensure pressure containment integrity, prevent ductile burst at the nozzle crotch corner, avoid excessive localized shell plastic deformation under external piping loads, and prevent cyclic fatigue cracking at nozzle attachment welds.',

    whyRequired: `
1. **Interrupted Hoop Stress Flow:** Internal pressure produces hoop tension $\\sigma_h = P \\cdot R / t$. An opening creates an abrupt geometric discontinuity where stress trajectories bunch together, producing peak crotch stresses.
2. **Piping Thermal Expansion Loads:** Long runs of connected piping expand and contract with operating temperature swings, exerting sustained forces ($F_x, F_y, F_z$) and thermal bending/torsional moments ($M_x, M_y, M_z$) onto the vessel shell junction.
3. **Code Compliance:** Pressure vessel design codes legally mandate that every opening exceeding 60 mm (2.375 in) in diameter must be formally reinforced and certified by engineering calculations.
    `,

    whenToUse: [
      'Sizing nozzles on cylindrical shells, conical sections, or formed dished heads (2:1 Ellipsoidal, Torispherical, Hemispherical, Flat heads).',
      'Verifying external piping reaction forces and moments supplied from CAESAR II, AutoPIPE, or ROHR2 piping stress analyses.',
      'Determining whether an external reinforcing pad (repad) is required or if a heavy barrel / self-reinforced forged neck (FVC / HB) is necessary.',
      'Performing fitness-for-service (FFS) re-rating of existing nozzle penetrations when operating conditions or piping loads increase.'
    ],

    whenNotToUse: [
      'Do NOT use standard UG-37 area replacement for large openings where nozzle diameter exceeds half the vessel diameter ($d > 0.5D$). In such cases, ASME Section VIII-1 Appendix 1-7 or 3D FEA (DBA) is mandatory.',
      'Do NOT use WRC 107/537 when the shell slenderness ratio $\\gamma = R_m/T > 300$ or nozzle ratio $\\beta > 0.55$; use WRC 297 or FEA.',
      'Do NOT use this module for non-metallic (FRP/plastic) vessels or unstayed flat plate manways.'
    ],

    supportedConfigurations: [
      'Cylindrical Shell Nozzles (Radial and Non-Radial Offset connections)',
      '2:1 Ellipsoidal Head Nozzles (Central and Oblique / Off-center connections)',
      'Torispherical (ASME Flanged & Dished) Head Nozzles (Crown and Knuckle region)',
      'Hemispherical Head Nozzles (Radial)',
      'Flat Head Nozzles (Welded or Bolted blind configurations)',
      'Straight pipe nozzles with or without external reinforcing pads',
      'Integrally reinforced forged nozzles (Heavy Barrel, Long Weld Neck, Self-reinforced forgings)'
    ],

    engineeringTheory: `
### 1. Area Replacement Rule (ASME Section VIII-1 UG-37)
The basic premise of UG-37 is that the cross-sectional area of metal removed from the vessel wall ($A_{req}$) must be restored by excess metal naturally available in the adjacent vessel wall ($A_1$), excess nozzle neck thickness ($A_2$), nozzle internal projection ($A_3$), attachment fillet welds ($A_4$), and external reinforcing pad plate ($A_5$).

$$\\text{Total Available Area } A_{avail} = A_1 + A_2 + A_3 + A_4 + A_5 \\ge A_{req}$$

Where required area is:
$$A_{req} = d \\cdot t_r \\cdot F + 2 \\cdot t_n \\cdot t_r \\cdot F \\cdot (1 - f_{r1})$$
- $d$ = Finished corroded opening diameter
- $t_r$ = Required shell thickness for internal pressure
- $F$ = Correction factor (normally 1.0; 0.5 for planes non-orthogonal to hoop stress)
- $f_{r1}$ = Strength reduction ratio between nozzle material and shell material: $f_{r1} = S_n / S_v \\le 1.0$

### 2. Reinforcement Boundary Limits (UG-40)
Metal can only be credited toward reinforcement if it lies within the prescribed boundary zone:
- **Parallel Limit ($L_R$):** Distance on each side of nozzle centerline = $\\max(2d, \\; d + 2(t + t_n))$.
- **Normal Limit ($L_H$):** Distance measured outward from shell surface = $\\min(2.5t, \\; 2.5t_n + t_e)$.

### 3. WRC Bulletin 537 / 107 Local Piping Loads
Piping reactions apply 6 distinct load vectors onto the nozzle-shell interface:
1. **$P$ (Radial Thrust):** Normal force pushing into or pulling out of vessel.
2. **$V_L$ (Longitudinal Shear):** Shear force parallel to vessel longitudinal axis.
3. **$V_C$ (Circumferential Shear):** Shear force tangential to vessel circumference.
4. **$M_L$ (Longitudinal Moment):** Bending moment inducing longitudinal bending in shell wall.
5. **$M_C$ (Circumferential Moment):** Bending moment inducing circumferential flexure across curvature.
6. **$M_T$ (Torsional Moment):** Twisting moment about nozzle neck centerline.

Bijlaard non-dimensional parameters determine dimensionless stress factors:
$$\\beta = 0.875 \\cdot \\left(\\frac{r_o}{R_m}\\right), \\quad \\gamma = \\frac{R_m}{T}$$

Stresses are calculated at 8 cardinal positions around the nozzle perimeter (Points A, B, C, D on inside and outside surfaces). Total combined stress intensity ($S_I$) must satisfy:
$$P_L \\le 1.5 \\cdot S, \\quad P_L + P_b \\le 1.5 \\cdot S, \\quad (P + Q) \\le 3.0 \\cdot S$$
    `,

    parameters: [
      { name: 'S_OD', label: 'Shell Outer Diameter', symbol: 'OD_s', unit: 'mm', required: true, source: 'Vessel Drawing', meaning: 'Vessel shell outside diameter.', validation: 'Must be > 0 and > Nozzle OD.', commonMistake: 'Entering inside diameter instead of outside diameter.' },
      { name: 'S_THK', label: 'Shell Nominal Thickness', symbol: 't_s', unit: 'mm', required: true, source: 'Vessel Spec', meaning: 'Nominal plate thickness before corrosion.', validation: 'Must exceed pressure design thickness + CA.', commonMistake: 'Entering corroded thickness instead of nominal.' },
      { name: 'N_OD', label: 'Nozzle Outside Diameter', symbol: 'OD_n', unit: 'mm', required: true, source: 'Piping Schedule', meaning: 'Outside diameter of nozzle pipe.', validation: 'Must be smaller than vessel OD.', commonMistake: 'Entering nominal pipe size (e.g. 10 instead of 273 mm).' },
      { name: 'N_THK', label: 'Nozzle Wall Thickness', symbol: 't_n', unit: 'mm', required: true, source: 'Piping Schedule', meaning: 'Nominal thickness of nozzle pipe.', validation: 'Must satisfy minimum schedule thickness per UG-45.', commonMistake: 'Neglecting manufacturing mill undertolerance (12.5%).' },
      { name: 'P_W', label: 'Pad Width', symbol: 'W_p', unit: 'mm', required: false, source: 'Design', meaning: 'Radial width of reinforcing pad extending from nozzle OD.', validation: 'Must be within UG-40 parallel limits.', commonMistake: 'Specifying pad too wide to receive code credit.' },
      { name: 'P_THK', label: 'Pad Thickness', symbol: 't_p', unit: 'mm', required: false, source: 'Design', meaning: 'Thickness of external reinforcing pad plate.', validation: 'Normally $\\le$ shell thickness.', commonMistake: 'Omitting telltale weep hole requirement in pad fabrication.' },
      { name: 'p', label: 'Internal Design Pressure', symbol: 'P', unit: 'MPa', required: true, source: 'Process Data', meaning: 'Coincident internal design pressure.', validation: 'Must be strictly positive.', commonMistake: 'Entering bar or psi without unit normalization.' },
      { name: 'DesignTemp', label: 'Design Temperature', symbol: 'T', unit: '°C', required: true, source: 'Process Data', meaning: 'Coincident metal design temperature.', validation: 'Must be within Section II-D table limit.', commonMistake: 'Using operating temperature instead of design temperature.' },
      { name: 'FX / FY / FZ', label: 'Piping Forces', symbol: 'F_L, P, F_C', unit: 'N', required: false, source: 'Piping Stress Report', meaning: 'External shear and axial thrust piping loads.', validation: 'Must verify sign convention (tension vs compression).', commonMistake: 'Confusing local nozzle coordinate axes with global vessel coordinates.' },
      { name: 'MX / MY / MZ', label: 'Piping Moments', symbol: 'M_L, M_T, M_C', unit: 'N·mm', required: false, source: 'Piping Stress Report', meaning: 'External bending and torsional moments.', validation: 'Ensure units are N·mm (1 kN·m = 10⁶ N·mm).', commonMistake: 'Entering N·m directly, causing 1,000x underestimation of bending stresses.' }
    ],

    stepByStepProcedure: [
      'Step 1: Select shell geometry (Cylindrical Shell or Formed Head) and input diameter and nominal thickness.',
      'Step 2: Assign certified ASME materials for shell, nozzle, and reinforcing pad from Section II-D database.',
      'Step 3: Define design conditions: internal pressure, design temperature, and corrosion allowance.',
      'Step 4: Input nozzle opening dimensions: outside diameter, wall thickness, projection, and nozzle type.',
      'Step 5: If pad-reinforced, specify pad width and thickness.',
      'Step 6: Input 6-DOF external piping reaction loads (P, VL, VC, ML, MC, MT) from piping stress summary.',
      'Step 7: Run automated UG-37 area replacement and WRC 537 local stress calculation.',
      'Step 8: Review stress intensities against ASME Section VIII Div 2 Part 5 limits ($P_L \\le 1.5S$, $P_L + P_b \\le 1.5S$, $P+Q \\le 3S$).',
      'Step 9: If FEA option is toggled, review 3D mesh quality, SCL stress linearization plots, and contour maps.',
      'Step 10: Export certified PDF calculation report.'
    ],

    resultInterpretation: `
Nova outputs results structured into three distinct verification tiers:
1. **Area Replacement Status:** Compares $A_{avail}$ vs $A_{req}$. If $A_{avail} \\ge A_{req}$, the opening satisfies ASME VIII-1 UG-37 under pure internal pressure.
2. **Local Piping Stress Ratio (WRC 537):** Stresses at cardinal points A, B, C, D (inner and outer surfaces) are combined with pressure membrane stress. The governing stress ratio ($S_I / S_{allow}$) must be $\\le 1.00$.
3. **Finite Element SCL Linearization:** For 3D FEA runs, the linearized membrane ($P_m, P_L$) and membrane+bending ($P_L + P_b$) stresses across the nozzle crotch SCL are checked against $1.5S$. Secondary ranges ($P+Q$) are checked against $3S$.

*Status Interpretation:*
- **PASS (Green):** All calculated stress intensities and area balances satisfy code limits with positive margin of safety.
- **WARNING (Amber):** Stress ratio is between 0.90 and 1.00, or local geometric limits (such as nozzle d/D or WRC $\\beta$ limits) are near code boundaries.
- **FAIL (Red):** Calculated stress exceeds allowable code limits or reinforcement area is insufficient. Wall thickness, pad dimensions, or piping loads must be revised.
    `,

    workedExample: {
      problemStatement: 'Evaluate an NPS 10 (273.05 mm OD) nozzle penetration in a cylindrical pressure vessel shell with external piping reactions.',
      givenData: {
        vesselOD: '1500 mm',
        vesselNomThk: '16 mm',
        corrosionAllowance: '3.0 mm',
        nozzleOD: '273.05 mm',
        nozzleNomThk: '12.7 mm (Sch 80)',
        nozzleProjection: '250 mm',
        materialShell: 'SA-516 Gr. 70 (Allowable stress S = 138 MPa at 200°C)',
        materialNozzle: 'SA-106 Gr. B (Allowable stress S = 118 MPa at 200°C)',
        internalPressure: '1.8 MPa',
        designTemp: '200°C',
        jointEfficiency: 'E = 1.0 (Full RT)',
        externalLoads: 'Radial Thrust P = 12,000 N, Long. Moment ML = 4,500,000 N·mm, Circ. Moment MC = 3,800,000 N·mm'
      },
      calculationSteps: [
        '1. Corroded Dimensions: Vessel R_corroded = (1500/2) - 16 + 3 = 737 mm. Shell t_corroded = 16 - 3 = 13 mm. Nozzle t_n_corroded = 12.7 - 3 = 9.7 mm. Finished bore d = 273.05 - 2(9.7) = 253.65 mm.',
        '2. Required Shell Thickness: t_r = (P · R) / (S · E - 0.6 · P) = (1.8 · 737) / (138 · 1.0 - 0.6 · 1.8) = 1326.6 / 136.92 = 9.69 mm.',
        '3. Required Reinforcement Area: A_req = d · t_r · F = 253.65 · 9.69 · 1.0 = 2,457.8 mm².',
        '4. Available Area in Shell Wall (A1): A1 = (t - t_r) · (d - 2·t_n) = (13 - 9.69) · 253.65 = 3.31 · 253.65 = 839.6 mm².',
        '5. Available Area in Nozzle Neck (A2): Nozzle t_rn = (1.8 · 117.1) / (118 · 1.0 - 0.6 · 1.8) = 1.79 mm. Excess neck metal within limit LH: A2 = 2 · (9.7 - 1.79) · min(2.5·13, 2.5·9.7) = 2 · 7.91 · 24.25 = 383.6 mm².',
        '6. Area Balance without Pad: A1 + A2 = 839.6 + 383.6 = 1,223.2 mm² < 2,457.8 mm² (Deficit of 1,234.6 mm²). REINFORCING PAD REQUIRED.',
        '7. Reinforcing Pad Sizing: Required pad plate thickness tp = 12 mm. Required width Wp = 1,235 / (2 · 12) = 51.5 mm. Specify 12 mm thick × 100 mm wide pad plate (SA-516 Gr. 70). Provides A5 = 2,400 mm².',
        '8. WRC 537 Evaluation: Shell gamma = 737 / 13 = 56.7. Beta = 0.875 · (136.5 / 737) = 0.162. Combined local stress intensity at cardinal Point A outer surface = 168.4 MPa. Allowable 1.5 · S = 207 MPa. Stress ratio = 168.4 / 207 = 0.813 ≤ 1.00.'
      ],
      conclusion: 'PASS. The nozzle penetration satisfies ASME Section VIII Div 1 UG-37 with a 100 mm × 12 mm reinforcing pad plate, and complies with WRC 537 local piping stress limits with a governing stress ratio of 0.813 (18.7% safety margin).'
    },

    verificationChecklist: [
      { id: 'geo_check', label: 'Vessel shell and nozzle diameters and nominal wall thicknesses verified against mechanical drawings' },
      { id: 'corrosion_check', label: 'Corrosion allowance (internal and external) properly subtracted from all pressure boundary thicknesses' },
      { id: 'mat_check', label: 'ASME Section II-D certified materials assigned with correct temperature-dependent allowable stresses' },
      { id: 'press_check', label: 'Design pressure accounts for maximum relief valve accumulation and static liquid head' },
      { id: 'piping_check', label: '6-DOF piping reaction loads verified against finalized CAESAR II / piping stress qualification dossier' },
      { id: 'coord_check', label: 'Load coordinate system properly transformed into local nozzle axes (Radial P, Longitudinal ML, Circumferential MC)' },
      { id: 'repad_check', label: 'Reinforcing pad outer diameter confirmed within UG-40 parallel limits and equipped with 1/4" NPT weep hole' },
      { id: 'fea_check', label: 'If running FEA: Hex mesh contains minimum 3 solid elements through wall thickness; SCL lines oriented normal to mid-surface' },
      { id: 'pe_review', label: 'Independent verification completed and signed off by qualified pressure equipment engineer' }
    ],

    faqs: [
      { q: 'Why does nozzle analysis fail under external moments when internal pressure passes?', a: 'Internal pressure produces uniform axisymmetric membrane hoop stress. External piping moments (ML, MC) create localized bending leverage with high tensile peaks on one side and compression on the opposite side of the nozzle crotch. A vessel wall that easily carries internal pressure may lack the flexural bending rigidity needed to resist heavy piping moments without an added reinforcing pad or thicker shell.' },
      { q: 'What is the difference between WRC 107 and WRC 537?', a: 'WRC Bulletin 107 was published in 1965 using manual hand-drafted parametric curves based on Bijlaard\'s work. WRC Bulletin 537 was published in 2010 by the Welding Research Council as an exact digital mathematical representation of the original WRC 107 equations, eliminating reading errors from scanned curves. Nova implements the verified WRC 537 numerical equations.' },
      { q: 'When should I choose an integrally reinforced forging over a welded pad?', a: 'Welded reinforcing pads create a secondary fillet weld boundary and a concealed crevice between pad and shell. In severe cyclic service, high-temperature creep service (>400°C), hydrogen embrittlement environments (HIC/NACE), or lethal substance service, ASME codes and project specifications prohibit fillet-welded pads and mandate integrally reinforced forged necks (self-reinforced LWN or FVC forgings) with 100% volumetric examination.' }
    ],

    relatedTopics: ['flange-analysis', 'asme-materials', 'results-reports', 'ansys-act-wizard', 'cad-ai'],
    references: [
      { source: 'ASME BPVC Section VIII Division 1', topic: 'UG-36 through UG-45: Openings and Reinforcements' },
      { source: 'ASME BPVC Section VIII Division 2', topic: 'Part 4.5 (Design-by-Rule Openings) & Part 5 (Design-by-Analysis SCL Rules)' },
      { source: 'Welding Research Council Bulletin 537', topic: 'Precision Equations and Curves for Local Stresses in Spherical and Cylindrical Shells' },
      { source: 'Welding Research Council Bulletin 297', topic: 'Local Stresses in Cylindrical Shells Due to External Loadings on Nozzles' },
      { source: 'ASME B36.10M', topic: 'Welded and Seamless Wrought Steel Pipe Dimensions' }
    ]
  },

  // ==========================================
  // 2. BELLOWS / BELLOW ANALYSIS
  // ==========================================
  {
    id: 'bellows-analysis',
    slug: 'bellows-analysis',
    title: 'Bellows Analysis: Metallic Expansion Joint Integrity & Fatigue Life',
    category: 'Analysis Modules',
    badge: 'Expansion Joint Engineering',
    discipline: 'Piping & Pressure Vessels',
    difficulty: 'Advanced',
    type: 'Guide & Reference',
    standard: 'EJMA 10th & 11th Editions / ASME Section VIII Div 1 Appendix 26',
    version: 'Nova v2.2',
    readingTime: '20 min',
    lastReviewed: 'October 2026',
    summary: 'Engineering design and validation of metallic expansion bellows: U-shaped convolutions, multi-ply configurations, spring rates, column/in-plane squirm stability, and cycle life prediction.',
    
    depthContent: {
      beginner: 'A metallic bellows expansion joint is a flexible accordion-shaped pipe component. It absorbs thermal expansion and movement in hot piping systems while keeping internal pressure contained. Bellows analysis calculates how much the bellows can flex before fatiguing and checks that internal pressure will not cause it to buckle or burst.',
      engineer: 'Bellows design balances two contradictory requirements: high pressure containment (requiring thick walls) versus low spring rate and high cyclic fatigue life (requiring thin walls). This dilemma is resolved using multi-ply construction. The Expansion Joint Manufacturers Association (EJMA) standards formulate meridional membrane ($S_1, S_2$), meridional bending ($S_3, S_4$), and circumferential membrane ($S_5, S_6$) stresses under coincident pressure and deflection. Key stability limits evaluated include Column Squirm and In-Plane Squirm.',
      expert: 'In shell theory, bellows convolutions are treated as toroidal-conical thin shells undergoing large non-linear elastic-plastic flexure. EJMA provides empirical closed-form approximations for convolution spring rate: $f_{iu} = 1.7 \\cdot \\frac{E_o \\cdot D_b \\cdot t_p^3 \\cdot n_p}{w^3 \\cdot C_f}$. Total stress range across one thermal cycle: $S_t = 0.7(S_3 + S_4) + (S_5 + S_6)$. Fatigue cycle life $N_{al}$ is determined from the empirical EJMA power-law equation: $N_{al} = \\left(\\frac{K_o}{S_t - S_o}\\right)^2$. Column squirm instability corresponds to an Euler column buckling mode driven by internal pressure thrust $F_{thrust} = P \\cdot A_e$, where effective area $A_e = \\frac{\\pi}{4}(D_b + w)^2$.'
    },

    overview: `
**Metallic bellows expansion joints** are precision flexible elements installed in piping runs, heat exchanger shells, and turbomachinery ducts to absorb axial, lateral, and angular thermal movements without transferring destructive thrust forces to equipment nozzles or anchors.

The **Nova Bellows Analysis Module** implements the authoritative methodology of the **Expansion Joint Manufacturers Association (EJMA) Standards (10th & 11th Editions)** and **ASME Section VIII Division 1 Appendix 26**.
    `,

    purpose: 'To size convolution geometry, verify structural stability against pressure squirm, calculate axial/lateral/angular spring rates, and predict fatigue cycle life under thermal cyclic operation.',

    whyRequired: `
1. **Piping Thermal Relief:** A 100-meter carbon steel steam pipe heated from 20°C to 300°C expands by approximately 350 mm. Without flexible loops or bellows, this thermal elongation generates immense compressive anchor loads capable of shearing foundation bolts or buckling pipe walls.
2. **Squirm Prevention:** Internal pressure acting on the closed ends of a flexible bellows creates an effective axial compressive force ($P \\cdot A_e$). If internal pressure exceeds the critical squirm limit, the bellows buckles laterally (column squirm) or convolution crests tilt plastically (in-plane squirm), causing catastrophic rupture.
3. **Fatigue Life Certification:** Bellows operate in the low-cycle plastic fatigue regime. Accurate fatigue life prediction is mandatory to prevent fatigue cracking in hazardous chemical or steam service.
    `,

    whenToUse: [
      'Designing single, universal, hinged, or gimbal metallic bellows expansion joints.',
      'Sizing thin-walled U-shaped convolutions with single-ply or multi-ply wall construction.',
      'Evaluating expansion joints for shell-and-tube heat exchangers (floating head or fixed tubesheet shells).',
      'Verifying bellows stability against Column Squirm and In-Plane Squirm under operating and hydrostatic test pressures.'
    ],

    whenNotToUse: [
      'Do NOT use this module for elastomeric (rubber) expansion joints, fabric expansion joints, or toroidal heavy-wall expansion joints.',
      'Do NOT use when axial deflection exceeds allowable convolution crest clearance (convolution bottoming out).'
    ],

    parameters: [
      { name: 'm_nc', label: 'Number of Convolutions', symbol: 'N_c', unit: 'dimensionless', required: true, source: 'Bellows Sizing', meaning: 'Total count of corrugated convolution crests.', validation: 'Must be an integer $\\ge 1$.', commonMistake: 'Entering too few convolutions, causing extreme per-convolution deflection and premature fatigue.' },
      { name: 'm_dj', label: 'Bellows Inside Diameter', symbol: 'D_b / D_j', unit: 'mm', required: true, source: 'Piping Bore', meaning: 'Inside diameter of bellows tangent collar and root.', validation: 'Must match mating pipe bore.', commonMistake: 'Entering outside convolution crest diameter instead of root diameter.' },
      { name: 'm_g', label: 'Convolution Pitch', symbol: 'q', unit: 'mm', required: true, source: 'Manufacturer Catalog', meaning: 'Axial distance from crest to crest.', validation: 'Must be positive and greater than twice convolution radius.', commonMistake: 'Confusing pitch with convolution height.' },
      { name: 'm_to', label: 'Nominal Ply Thickness', symbol: 't_n / t_p', unit: 'mm', required: true, source: 'Sheet Spec', meaning: 'Thickness of individual metallic ply before forming.', validation: 'Typically 0.3 mm to 3.0 mm.', commonMistake: 'Entering total thickness instead of single-ply thickness for multi-ply bellows.' },
      { name: 'w', label: 'Convolution Height', symbol: 'w', unit: 'mm', required: true, source: 'Geometry', meaning: 'Radial depth of convolution from root to crest.', validation: 'Must be positive.', commonMistake: 'Entering convolution diameter instead of radial depth.' },
      { name: 'np', label: 'Number of Plies', symbol: 'n_p', unit: 'dimensionless', required: true, source: 'Design', meaning: 'Count of nested metal sheets forming bellows wall.', validation: 'Integer $\\ge 1$ (typically 1 to 5).', commonMistake: 'Assuming single-ply when multi-ply was specified in order.' },
      { name: 'shellPressure', label: 'Operating / Design Pressure', symbol: 'P', unit: 'MPa', required: true, source: 'Process Data', meaning: 'Internal design pressure.', validation: 'Must be strictly positive.', commonMistake: 'Omitting surge pressure or upset pressure peaks.' },
      { name: 'shellTemp', label: 'Design Temperature', symbol: 'T', unit: '°C', required: true, source: 'Process Data', meaning: 'Metal operating temperature.', validation: 'Within material allowable temperature range.', commonMistake: 'Using room temperature for hot piping bellows.' },
      { name: 'e_ax', label: 'Total Axial Movement', symbol: '\\Delta x', unit: 'mm', required: true, source: 'Piping Stress Run', meaning: 'Total axial compression or extension per convolution.', validation: 'Must not exceed convolution closing limit.', commonMistake: 'Entering total system movement without dividing across all expansion joints.' }
    ],

    calculationLogic: `
### 1. Effective Pressure Area ($A_e$)
$$A_e = \\frac{\\pi}{4} \\cdot (D_b + w)^2$$
Internal pressure produces a massive **Pressure Thrust Force**:
$$F_{thrust} = P \\cdot A_e$$
This thrust load must be resisted by external structural piping anchors or internal tie rods.

### 2. Spring Rate Formulas (EJMA 11th Ed)
- **Theoretical Axial Spring Rate per Convolution ($f_{iu}$):**
$$f_{iu} = 1.7 \\cdot \\frac{E_o \\cdot D_b \\cdot t_p^3 \\cdot n_p}{w^3 \\cdot C_f}$$
- **Total Bellows Axial Spring Rate ($K_x$):**
$$K_x = \\frac{f_{iu}}{N_c}$$

### 3. Stability & Squirm Limits
- **Column Squirm Critical Pressure ($P_{sc}$):**
$$P_{sc} = \\frac{\\pi \\cdot K_x}{L_b} = \\frac{\\pi \\cdot f_{iu}}{N_c^2 \\cdot q}$$
Design code requires: $P_{design} \\le \\frac{P_{sc}}{2.25}$ for operating pressure, and $P_{test} \\le \\frac{P_{sc}}{1.5}$ for hydrotest.
- **In-Plane Squirm Critical Pressure ($P_{si}$):** Evaluates local root yield and circumferential tilting of individual convolutions.

### 4. Cyclic Fatigue Life ($N_{al}$)
Total equivalent stress range:
$$S_t = 0.7 \\cdot (S_3 + S_4) + (S_5 + S_6)$$
Cycle life prediction per EJMA fatigue curve:
$$N_{al} = \\left( \\frac{C_f \\cdot K_o}{S_t - S_o} \\right)^2$$
    `,

    workedExample: {
      problemStatement: 'Perform an EJMA verification of a DN 400 (16-inch) stainless steel expansion joint absorbing 25 mm axial compression.',
      givenData: {
        bellowID: '406.4 mm',
        convolutionHeight: '35 mm',
        convolutionPitch: '28 mm',
        numConvolutions: '10',
        plyThickness: '1.2 mm',
        numPlies: '2 (Two-ply construction)',
        material: 'Incoloy 825 / SS 321 (E = 195,000 MPa at 20°C, 182,000 MPa at 250°C)',
        designPressure: '1.0 MPa (10 bar)',
        designTemp: '250°C',
        axialCompression: '25 mm total'
      },
      calculationSteps: [
        '1. Effective Mean Diameter: Dm = Db + w = 406.4 + 35 = 441.4 mm.',
        '2. Effective Area: Ae = (π / 4) · (441.4)² = 153,025 mm².',
        '3. Pressure Thrust: F_thrust = P · Ae = 1.0 MPa · 153,025 mm² = 153,025 N (153 kN / 34,400 lbf). Heavy piping anchors mandatory!',
        '4. Movement per Convolution: e_x = 25 mm / 10 convolutions = 2.5 mm compression/conv.',
        '5. Single Convolution Axial Spring Rate: f_iu = 1.7 · (182,000 · 406.4 · (1.2)³ · 2) / (35³ · 1.0) = 432,600 / 42,875 = 10.09 N/mm.',
        '6. Total Bellows Spring Rate: Kx = f_iu / Nc = 10.09 / 10 = 1.01 N/mm.',
        '7. Column Squirm Limit: P_sc = (π · f_iu) / (Nc² · q) = (π · 10.09) / (100 · 28) = 31.7 / 2800 ... yielding P_sc = 3.52 MPa. Allowable P_squirm = 3.52 / 2.25 = 1.56 MPa > 1.0 MPa. (SAFE from Column Squirm).',
        '8. Total Stress Range: St calculated = 582 MPa.',
        '9. Fatigue Life: Nal = ((1.86 · 10⁶) / (582 - 280))² = (1.86e6 / 302)² = 37,900 design cycles.'
      ],
      conclusion: 'PASS. The bellows satisfies EJMA 11th Edition structural stability against squirm (margin = 1.56x) and provides an estimated fatigue life of 37,900 cycles, exceeding standard 10,000 cycle industrial requirements.'
    },

    verificationChecklist: [
      { id: 'mat_cert', label: 'Bellows material certified for operating temperature, stress corrosion cracking resistance, and weldability' },
      { id: 'ply_check', label: 'Multi-ply configuration verified; ply thickness within manufacturer hydraulic/elastomer forming tolerances' },
      { id: 'anchor_check', label: 'Piping anchor load calculations incorporate full pressure thrust force (P · Ae) plus spring reaction' },
      { id: 'squirm_check', label: 'Column squirm and in-plane squirm safety margins verified for both operating and hydrotest pressures' },
      { id: 'guide_check', label: 'Piping alignment guides installed per EJMA spacing rules (first guide within 4 pipe diameters of bellows)' },
      { id: 'cycle_check', label: 'Fatigue cycle life prediction meets or exceeds project design life cycles with required safety factor' }
    ],

    faqs: [
      { q: 'What is the main advantage of multi-ply bellows over single-ply?', a: 'Because bending stress and spring rate vary with the cube of wall thickness ($t^3$), a single thick ply of 2.0 mm has a spring rate proportional to $2.0^3 = 8.0$. In contrast, two plies of 1.0 mm have a spring rate proportional to $2 \\times 1.0^3 = 2.0$—four times more flexible—while maintaining the identical hoop burst pressure resistance.' },
      { q: 'What happens if a bellows is tested with unconstrained ends?', a: 'Never perform a hydrostatic pressure test without rigid tie rods or external anchors. The pressure thrust force ($P \\cdot A_e$) will instantly blow the bellows open like a piston, causing destructive over-extension and complete failure.' }
    ],

    relatedTopics: ['nozzle-analysis', 'tubesheet-analysis', 'asme-materials'],
    references: [
      { source: 'EJMA Standards 11th Edition', topic: 'Standards of the Expansion Joint Manufacturers Association' },
      { source: 'ASME BPVC Section VIII Division 1', topic: 'Mandatory Appendix 26: Bellows Expansion Joints' },
      { source: 'ISO 15348', topic: 'Metallic Bellows Expansion Joints for Pressure Applications' }
    ]
  },

  // ==========================================
  // 3. FLANGE ANALYSIS
  // ==========================================
  {
    id: 'flange-analysis',
    slug: 'flange-analysis',
    title: 'Flange Analysis: Rigidity, Gasket Seating & Bolted Joint Mechanics',
    category: 'Analysis Modules',
    badge: 'Bolted Joint Engineering',
    discipline: 'Pressure Vessel & Mechanical',
    difficulty: 'Advanced',
    type: 'Guide & Reference',
    standard: 'ASME Section VIII Div 1 Appendix 2 / ASME B16.5 / EN 1591',
    version: 'Nova v2.1',
    readingTime: '18 min',
    lastReviewed: 'October 2026',
    summary: 'Design and verification of bolted flanged connections: Waters-Taylor-Forge equations, operating vs. seating bolt loads, flange rotation, rigidity index (J ≤ 1.0), and external piping moment integration.',
    
    depthContent: {
      beginner: 'A flange is a rimmed disc welded to a vessel or pipe so two sections can be bolted together with a gasket in between. Flange analysis calculates how tightly the bolts must be tightened to seat the gasket without crushing it, checks that the flange will not bend or twist under internal pressure, and ensures the joint will not leak.',
      engineer: 'Under ASME Section VIII Division 1 Appendix 2, bolted flanges must satisfy two operating regimes: (1) Gasket Seating Condition ($W_{m2} = \\pi b G y$) without internal pressure, and (2) Operating Condition ($W_{m1} = \\frac{\\pi}{4}G^2P + 2b\\pi G m P$) where bolt tension counteracts hydrostatic end thrust while maintaining minimum gasket compression. Total flange moments ($M_D, M_T, M_G$) induce longitudinal hub stress ($S_H$), radial stress ($S_R$), and tangential stress ($S_T$). Crucially, the flange rigidity index $J$ must be $\\le 1.00$ to prevent face rotation and leakage.',
      expert: 'The analytical foundation is the Taylor-Forge method derived by Waters, Wesstrom, Rossheim, and Williams (1937). The flange ring is modeled as an elastic annular plate attached to a circular cylindrical or tapered conical shell (the hub). Differential equilibrium equations yield shape factors $F, V, f, Y, Z, U$. Stresses must satisfy: $S_H \\le 1.5S_{fo}$, $S_R \\le S_{fo}$, $S_T \\le S_{fo}$, and $(S_H + S_R)/2 \\le S_{fo}$, $(S_H + S_T)/2 \\le S_{fo}$. External bending moments ($M$) and axial forces ($F_{ext}$) from connected piping are converted into equivalent design pressure: $P_{eq} = P + \\frac{4 F_{ext}}{\\pi G^2} + \\frac{16 M}{\\pi G^3}$.'
    },

    overview: `
**Bolted flanged connections** are the primary separable joints in pressure vessels, reactor manways, heat exchanger channels, and piping systems. 
A flanged connection is a complex structural system comprising four interacting components:
1. Two mating flange rings (with or without tapered hubs)
2. Gasket sealing element
3. Set of high-strength threaded stud bolts and nuts
4. Attached cylindrical vessel shell or pipe neck

The **Nova Flange Analysis Module** performs complete design, rating verification, and rigidity checks per **ASME Section VIII Division 1 Appendix 2**, **ASME B16.5**, and **ASME PCC-1**.
    `,

    purpose: 'To ensure zero fluid leakage past the gasket under all operating, hydrotest, and thermal transient conditions while preventing plastic bending of the flange ring and yield failure of stud bolts.',

    whyRequired: `
Flange failure rarely involves explosive rupture; instead, failure manifests as **flange leakage**. 
Even minor leakage of high-pressure hydrogen, toxic chemicals, or superheated steam causes immediate unscheduled plant shutdowns, environmental fines, and severe fire/explosion hazards. 
Rigidity checks ($J \\le 1.0$) are critical because an insufficiently thick flange ring rotates elastically under bolt make-up, relieving compression on the inner gasket edge and creating leak paths.
    `,

    whenToUse: [
      'Designing custom, non-standard pressure vessel flanges exceeding ASME B16.5 / B16.47 size or pressure limits.',
      'Verifying standard ANSI B16.5 flanges subjected to high external piping bending moments and axial forces.',
      'Selecting gasket materials (spiral wound, RTJ metal ring, camprofile, PTFE) and calculating required bolt assembly torques.',
      'Checking flange rigidity index $J$ to eliminate face rotation and chronic bolt loosening.'
    ],

    parameters: [
      { name: 'f_mat', label: 'Flange Material', symbol: 'Mat_f', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Forging specification for flange ring and hub (e.g. SA-105, SA-182 F316).', validation: 'Must be verified ASME forging grade.', commonMistake: 'Selecting plate specification for a forged weld neck flange.' },
      { name: 'nb_mat', label: 'Nut/Bolt Material', symbol: 'Mat_b', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Bolting material specification (e.g. SA-193 B7, SA-193 B8M).', validation: 'High strength bolting steel.', commonMistake: 'Using commercial low-strength carbon steel bolts on pressure vessel flanges.' },
      { name: 'flange_od', label: 'Flange Outside Diameter (A)', symbol: 'A', unit: 'mm', required: true, source: 'Drawing', meaning: 'Overall outer diameter of flange ring.', validation: 'Must be > Bolt Circle.', commonMistake: 'Confusing bolt circle with flange OD.' },
      { name: 'flange_id', label: 'Flange Inside Diameter (B)', symbol: 'B', unit: 'mm', required: true, source: 'Drawing', meaning: 'Bore diameter matching attached pipe or vessel.', validation: 'Must match mating cylinder inside diameter.', commonMistake: 'Entering outside diameter of pipe instead of bore.' },
      { name: 'flange_thk', label: 'Flange Thickness (T)', symbol: 'T', unit: 'mm', required: true, source: 'Drawing', meaning: 'Thickness of annular flange ring plate.', validation: 'Must be positive and satisfy rigidity $J \\le 1.0$.', commonMistake: 'Specifying thin plate to save weight, causing excessive rotation.' },
      { name: 'bolt_circle', label: 'Bolt Circle Diameter (C)', symbol: 'C', unit: 'mm', required: true, source: 'Drawing', meaning: 'Centerline pitch circle diameter of bolt holes.', validation: 'Must lie between Gasket OD and Flange OD.', commonMistake: 'Too small bolt circle, leaving insufficient tool clearance for socket torque wrenches.' },
      { name: 'no_of_bolts', label: 'Number of Bolts (n)', symbol: 'n', unit: 'integer', required: true, source: 'Drawing', meaning: 'Total count of flange stud bolts.', validation: 'Must be multiple of 4.', commonMistake: 'Specifying odd number of bolts, preventing symmetrical 4-point criss-cross bolt torquing.' },
      { name: 'bolt_pretension', label: 'Bolt Pretension Force', symbol: 'W', unit: 'N', required: true, source: 'Assembly Spec', meaning: 'Target initial tensile clamp load per bolt.', validation: 'Must satisfy $W_{m1}$ and $W_{m2}$.', commonMistake: 'Exceeding 70% of bolt material yield strength.' }
    ],

    workedExample: {
      problemStatement: 'Verify a 600 mm (24-inch) Class 300 equivalent custom Weld Neck flange operating at 3.0 MPa and 200°C.',
      givenData: {
        flangeOD: '810 mm',
        flangeID: '600 mm',
        flangeThk: '55 mm',
        boltCircle: '740 mm',
        numBolts: '24 (M30 stud bolts, SA-193 B7)',
        hubSmall: '20 mm (g0)',
        hubLarge: '45 mm (g1)',
        hubLength: '80 mm (hL)',
        gasket: 'Spiral Wound 316/Graphite: OD = 690 mm, ID = 635 mm, m = 3.0, y = 69 MPa',
        pressure: '3.0 MPa (30 bar)',
        designTemp: '200°C',
        flangeMaterial: 'SA-105 Forging (Allowable stress S = 138 MPa)'
      },
      calculationSteps: [
        '1. Gasket Dimensions: Mean gasket diameter G = (690 + 635)/2 = 662.5 mm. Basic width b0 = (690 - 635)/4 = 13.75 mm. Effective width b = 2.52 · √(13.75) = 9.35 mm.',
        '2. Gasket Seating Bolt Load: Wm2 = π · b · G · y = π · 9.35 · 662.5 · 69 = 1,342,000 N (1,342 kN).',
        '3. Operating Bolt Load: Hydrostatic end thrust H = (π/4) · (662.5)² · 3.0 = 1,034,000 N. Gasket compression reaction Hp = 2 · 9.35 · π · 662.5 · 3.0 · 3.0 = 350,000 N. Wm1 = H + Hp = 1,384,000 N (1,384 kN).',
        '4. Design Bolt Load: W = max(Wm1, Wm2) = 1,384 kN. Bolt load per stud = 1,384,000 / 24 = 57,667 N (~57.7 kN per bolt).',
        '5. Flange Moments: Hydrostatic bore moment MD = 320,000 N·m. Face pressure moment MT = 115,000 N·m. Gasket moment MG = 245,000 N·m. Total operating moment Mo = 680,000 N·m (680 kN·m).',
        '6. Stresses: Hub longitudinal stress SH = 142 MPa (Allowable 1.5·S = 207 MPa) → PASS. Radial stress SR = 68 MPa (Allowable S = 138 MPa) → PASS. Tangential stress ST = 95 MPa (Allowable S = 138 MPa) → PASS.',
        '7. Rigidity Index: J = 0.74 ≤ 1.00 → RIGIDITY PASS.'
      ],
      conclusion: 'PASS. The custom flanged connection satisfies ASME Section VIII Div 1 Appendix 2 stress criteria and achieves an acceptable rigidity index J = 0.74, ensuring leak-free performance under bolt preload and operating conditions.'
    },

    verificationChecklist: [
      { id: 'gasket_data', label: 'Gasket factors m and y verified against manufacturer certification and ASME Appendix 2 Table 2-5.1' },
      { id: 'bolt_stress', label: 'Bolt stresses verified for both operating (Wm1) and gasket seating (Wm2) conditions against allowable bolt stress' },
      { id: 'rigidity_check', label: 'Flange rigidity index J verified strictly ≤ 1.00 (or J ≤ 0.20 for full face elastomeric gaskets)' },
      { id: 'hub_slope', label: 'Tapered hub slope confirmed ≤ 1:3 transition angle to prevent sharp discontinuity stress peaks' },
      { id: 'pcc1_torque', label: 'Assembly bolt torque values calculated per ASME PCC-1 guidelines with specified thread lubricant friction coefficient' }
    ],

    faqs: [
      { q: 'Why is standard ASME B16.5 flange rating not always sufficient for high external piping loads?', a: 'ASME B16.5 pressure-temperature ratings assume the flange carries internal pressure ONLY. In reality, external piping thermal expansion exerts bending moments ($M$) and axial forces ($F$) that pry the flange faces apart. An engineer must convert external moments to equivalent pressure $P_{eq} = P + \\frac{16M}{\\pi G^3}$ or perform Appendix 2 verification to confirm the gasket remains seated.' }
    ],

    relatedTopics: ['nozzle-analysis', 'asme-materials', 'results-reports'],
    references: [
      { source: 'ASME BPVC Section VIII Division 1', topic: 'Mandatory Appendix 2: Rules for Bolted Flange Connections with Ring Type Gaskets' },
      { source: 'ASME B16.5', topic: 'Pipe Flanges and Flanged Fittings: NPS 1/2 through NPS 24' },
      { source: 'ASME PCC-1', topic: 'Guidelines for Pressure Boundary Bolted Flange Joint Assembly' }
    ]
  },

  // ==========================================
  // 4. LOCAL PWHT
  // ==========================================
  {
    id: 'local-pwht',
    slug: 'local-pwht',
    title: 'Local PWHT: Post-Weld Heat Treatment Thermal Gradient Evaluation',
    category: 'Analysis Modules',
    badge: 'Thermal & Metallurgy',
    discipline: 'Welding & Metallurgy',
    difficulty: 'Intermediate',
    type: 'Guide & Reference',
    standard: 'WRC Bulletin 452 / ASME Section VIII Div 1 UW-40 / AWS D10.10',
    version: 'Nova v2.0',
    readingTime: '17 min',
    lastReviewed: 'October 2026',
    summary: 'Engineering sizing and thermal transient analysis of local post-weld heat treatment: soak bands, heating bands, gradient control insulation bands, and cooling rate compliance.',
    
    depthContent: {
      beginner: 'When thick steel is welded, the molten weld metal cools and shrinks, leaving high locked-in residual stresses that can cause brittle cracking. Post-Weld Heat Treatment (PWHT) heats the weld area in a controlled furnace or with heating pads to relax these stresses. When a whole vessel cannot fit into a furnace, Local PWHT heats a circular band around the weld. This analysis sizes the heated and insulated bands so the temperature changes gradually without causing new thermal stresses.',
      engineer: 'Local PWHT involves a controlled 360-degree circumferential heating band centered on the weld seam. The primary engineering danger is structural restraint: as the hot band expands radially against the colder, unheated vessel shell, severe localized bending moments and through-thickness shears develop at the temperature transition zone. Welding Research Council (WRC) Bulletin 452 and ASME UW-40 define three critical zones: Soak Band ($SB$), Heating Band ($HB$), and Gradient Control / Insulation Band ($IB$). Heating and cooling ramp rates must be controlled to prevent thermal shock.',
      expert: 'The governing differential equation for radial shell displacement under an axisymmetric temperature distribution $T(x)$ is: $\\frac{d^4 w}{dx^4} + 4\\beta^4 w = \\frac{1}{D} \\cdot \\frac{E \\cdot t \\cdot \\alpha \\cdot [T(x) - T_o]}{R}$, where the shell structural characteristic parameter is $\\beta = \\left[\\frac{3(1-\\nu^2)}{R^2 t^2}\\right]^{1/4}$. The characteristic decay length is $\\lambda = \\frac{\\pi}{\\beta} \\approx 2.5\\sqrt{R t}$. If the temperature gradient between the hot soak band and cold shell occurs over a distance shorter than $\\lambda$, the thermal curvature induces peak secondary bending stresses exceeding material yield strength at temperature, generating new residual stresses and defeating the entire purpose of PWHT.'
    },

    overview: `
**Post-Weld Heat Treatment (PWHT)** is a thermal operation performed after welding to reduce weld-induced residual tensile stresses, temper hard and brittle martensitic heat-affected zones (HAZ), drive out diffusible hydrogen, and restore fracture toughness.

When heating an entire pressure vessel inside a permanent furnace is impossible due to size or field construction, **Local PWHT** is performed using flexible ceramic heating elements (FOC pads) and exterior insulation wraps.
    `,

    purpose: 'To calculate mandatory Soak Band, Heating Band, and Insulation Band widths, establish maximum allowable heating/cooling ramp rates, and prevent secondary thermal gradient overstress per WRC 452 and ASME UW-40.',

    parameters: [
      { name: 'component', label: 'Component Configuration', symbol: 'Comp', unit: 'select', required: true, source: 'Weld Drawing', meaning: 'Joint configuration: Shell-to-Shell, Head-to-Shell, or Nozzle-to-Shell.', validation: 'Options: Shell to Shell, Head to Shell, Nozzle to Shell.', commonMistake: 'Applying shell-to-shell rules to complex nozzle penetrations without extra insulation.' },
      { name: 'mat_name', label: 'Material Name', symbol: 'Mat', unit: 'text', required: true, source: 'Weld Procedure (WPS)', meaning: 'Base metal material specification (e.g. SA-516 Gr 70, SA-387 Gr 11).', validation: 'ASME P-Number classification.', commonMistake: 'Using carbon steel soaking temperatures (600°C) for P-4 or P-5 chrome-moly steels (680–720°C).' },
      { name: 'shell_id', label: 'Shell Inside Diameter', symbol: 'D_i', unit: 'mm', required: true, source: 'Drawing', meaning: 'Inside diameter of vessel shell at weld joint.', validation: 'Must be positive.', commonMistake: 'Entering radius instead of diameter.' },
      { name: 'shell_thk', label: 'Governing Wall Thickness', symbol: 't', unit: 'mm', required: true, source: 'Drawing', meaning: 'Governing weld joint thickness determining soaking time and ramp rates.', validation: 'Must match heaviest component at weld.', commonMistake: 'Using thinner shell thickness when welding to a heavy forging.' },
      { name: 'soak_temp', label: 'Soaking Temperature', symbol: 'T_soak', unit: '°C', required: true, source: 'ASME Table UCS-56', meaning: 'Target dwell temperature for residual stress relaxation.', validation: 'Typically 595°C to 650°C for P-1 carbon steels.', commonMistake: 'Exceeding material lower critical transformation temperature (A1), which destroys plate heat treatment.' },
      { name: 'hold_time', label: 'Holding / Soaking Time', symbol: 't_hold', unit: 'hours', required: true, source: 'ASME UCS-56', meaning: 'Duration temperature is maintained within soak band.', validation: 'Minimum 1 hr per 25 mm of thickness (min 1 hr).', commonMistake: 'Insufficient soak duration for heavy plate sections.' },
      { name: 'heat_rate_load', label: 'Heating Ramp Rate', symbol: 'R_h', unit: '°C/hr', required: true, source: 'Code Rules', meaning: 'Maximum heating rate above loading temperature.', validation: 'Calculated from thickness: $R_h \\le 222 / (t / 25)$ °C/hr.', commonMistake: 'Ramping temperature too fast, inducing severe through-wall thermal gradients.' },
      { name: 'cool_rate', label: 'Cooling Ramp Rate', symbol: 'R_c', unit: '°C/hr', required: true, source: 'Code Rules', meaning: 'Maximum controlled cooling rate down to unloading temperature.', validation: 'Must not exceed code limit (typically $\\le 280 / (t / 25)$ °C/hr).', commonMistake: 'Stripping insulation too early, causing rapid air quenching and re-hardening.' }
    ],

    workedExample: {
      problemStatement: 'Determine local PWHT thermal parameters and band dimensions for a circumferential weld on a 2000 mm ID × 40 mm thick carbon steel vessel (SA-516 Gr. 70).',
      givenData: {
        vesselID: '2000 mm',
        vesselThk: '40 mm',
        material: 'SA-516 Gr. 70 (ASME P-No 1 Group 2)',
        weldWidth: '25 mm',
        ambientTemp: '30°C'
      },
      calculationSteps: [
        '1. Minimum Soaking Temperature (ASME Table UCS-56-1): Target T_soak = 620°C (Code minimum = 595°C).',
        '2. Minimum Soaking Time: Thickness t = 40 mm. Required time = 1 hr/25 mm = 40/25 = 1.6 hours (Specify 2.0 hours).',
        '3. Maximum Heating Rate above 300°C: Rh = 5555 / t_mm = 5555 / 40 = 138.8°C/hr (Specify 100°C/hr for conservative margin).',
        '4. Maximum Cooling Rate down to 300°C: Rc = 7000 / t_mm = 7000 / 40 = 175°C/hr (Specify 120°C/hr).',
        '5. Soak Band Width (SB): SB = weld_width + 2 · t = 25 + 2(40) = 105 mm centered on weld seam.',
        '6. Heating Band Width (HB) per WRC 452: HB = SB + 2 · √(R · t) = 105 + 2 · √(1020 · 40) = 105 + 2 · 202 = 509 mm (Specify 550 mm heating pad width).',
        '7. Insulation Band Width (IB): IB = HB + 4 · √(R · t) = 550 + 4 · 202 = 1,358 mm (Specify 1,400 mm total insulation blanket width).'
      ],
      conclusion: 'PASS. The specified thermal cycle (620°C soak for 2 hours, ramp rates ≤ 100°C/hr, 550 mm heating band, 1,400 mm insulation blanket) ensures compliant stress relief without inducing harmful structural restraint stresses.'
    },

    verificationChecklist: [
      { id: 'wps_check', label: 'Soak temperature verified against ASME Table UCS-56 for specific material P-Number and Group Number' },
      { id: 'sb_check', label: 'Soak Band width verified to cover weld metal, HAZ, and adjacent base metal to at least 1t on each side' },
      { id: 'tc_check', label: 'Thermocouple layout includes control and monitoring TCs on both top and bottom (6 o\'clock position runs cooler due to convection)' },
      { id: 'record_check', label: 'Calibrated automated multi-point temperature chart recorder in place with 100% data logging redundancy' },
      { id: 'insul_check', label: 'Thermal insulation extends across full Insulation Band width (IB) with taped seams to eliminate chimney draft effects' }
    ],

    faqs: [
      { q: 'Why is the bottom (6 o\'clock) position on a horizontal vessel PWHT always colder?', a: 'Natural convection causes heated air inside the vessel to rise toward the 12 o\'clock crown, while cooler dense air sinks to the 6 o\'clock invert. Thermocouples at the 6 o\'clock position must control separate heater zones with independent power controllers to ensure uniform temperature.' }
    ],

    relatedTopics: ['asme-materials', 'results-reports'],
    references: [
      { source: 'WRC Bulletin 452', topic: 'Recommended Practices for Local Heating of Welds in Pressure Vessels' },
      { source: 'ASME Section VIII Div 1', topic: 'UW-40: Procedures for Postweld Heat Treatment' },
      { source: 'AWS D10.10', topic: 'Recommended Practices for Local Heating of Pipeline Welds' }
    ]
  },

  // ==========================================
  // 5. SADDLE ANALYSIS
  // ==========================================
  {
    id: 'saddle-analysis',
    slug: 'saddle-analysis',
    title: 'Saddle Analysis: Horizontal Vessel Support Stresses (Zick Method)',
    category: 'Analysis Modules',
    badge: 'Support & Structural',
    discipline: 'Vessels & Structural',
    difficulty: 'Advanced',
    type: 'Guide & Reference',
    standard: 'Zick Method (1951) / ASME Section VIII Div 2 Part 4.15',
    version: 'Nova v2.3',
    readingTime: '19 min',
    lastReviewed: 'October 2026',
    summary: 'Engineering evaluation of horizontal pressure vessels on twin saddle supports: longitudinal bending moments, tangential shear stresses, saddle horn circumferential bending, and wear plate design.',
    
    depthContent: {
      beginner: 'Horizontal tanks and drums (like propane bullets or refinery surge drums) rest on two cradle-shaped steel supports called saddles. Saddle analysis calculates the bending of the tank between the supports like a beam, checks for high stresses at the sharp tips (horns) of the saddles where the shell rests, and tells you whether you need an extra welded wear plate to prevent dents or tears.',
      engineer: 'L.P. Zick (1951) published the seminal mathematical solution treating the horizontal vessel as a continuous beam over two supports with cantilevered dished heads. Four distinct stress categories are calculated: (1) Longitudinal bending stress at midspan ($S_{1a}$) and over the saddles ($S_{1b}$), (2) Tangential shear stress in the shell ($S_2$), (3) Circumferential bending and tensile stress at the saddle horn ($S_3$), and (4) Circumferential compressive ring stress. If horn stress $S_3$ exceeds allowable limits, a welded wear plate with contact angle $\\theta_w = \\theta + 10^\\circ$ is sized.',
      expert: 'The Zick formulation balances beam flexure with shell ovalization. When saddles are placed close to stiff dished heads ($A \\le 0.2L$), the dished heads act as rigid diaphragms, maintaining shell circularity and transferring shear directly to the saddles without high shell distortion. When saddles are placed far from heads ($A > 0.2L$), the unstiffened shell undergoes extensive circumferential ovalization, and peak saddle horn bending stress is evaluated via: $S_3 = -\\frac{Q}{4 t (b + 1.56\\sqrt{R t})} - \\frac{3 K_6 Q}{2 t^2}$. Nova computes Zick coefficients $K_1$ through $K_8$ as continuous functions of saddle angle $\\theta$ and location ratio $A/R$, verifying against ASME Section VIII Division 2 (Part 4.15).'
    },

    overview: `
**Horizontal cylindrical pressure vessels** (accumulators, knock-out drums, heat exchangers, and storage bullets) are universally supported by two twin saddle supports. Supporting a cylindrical shell on more than two saddles causes indeterminate load distribution due to differential foundation settlement.

The **Nova Saddle Analysis Module** performs complete structural checks per the **Zick Method** and **ASME Section VIII Division 2 (Part 4.15)**.
    `,

    purpose: 'To verify horizontal vessel shell structural integrity under operating weight, fluid contents, internal pressure, and seismic/wind reactions while sizing saddle dimensions, ribs, baseplates, and wear plates.',

    parameters: [
      { name: 'v_id', label: 'Vessel Inside Diameter', symbol: 'D_i', unit: 'mm', required: true, source: 'Vessel Spec', meaning: 'Inside diameter of vessel shell cylinder.', validation: 'Must be positive.', commonMistake: 'Entering radius instead of diameter.' },
      { name: 'v_thk', label: 'Shell Wall Thickness', symbol: 't', unit: 'mm', required: true, source: 'Vessel Spec', meaning: 'Corroded wall thickness of vessel shell.', validation: 'Must satisfy pressure design.', commonMistake: 'Using uncorroded nominal thickness.' },
      { name: 'v_len', label: 'Vessel Length (Tangent-to-Tangent)', symbol: 'L', unit: 'mm', required: true, source: 'Vessel Drawing', meaning: 'Cylindrical shell length between head tangent lines.', validation: 'Must be > 2 × Saddle Location.', commonMistake: 'Entering overall length including head depths.' },
      { name: 's_loc', label: 'Saddle Location from Tangent Line', symbol: 'A', unit: 'mm', required: true, source: 'Support Layout', meaning: 'Distance from nearest head tangent line to saddle centerline.', validation: 'Recommended $A \\le 0.2L$.', commonMistake: 'Placing saddles too far from heads without stiffener rings.' },
      { name: 's_angle', label: 'Saddle Contact Angle', symbol: 'θ', unit: 'deg', required: true, source: 'Drawing', meaning: 'Subtended circumferential wrap angle of saddle cradle.', validation: 'Must be $\\ge 120^\\circ$ (typically 120° or 150°).', commonMistake: 'Specifying 90° angle, which is prohibited by ASME VIII-2.' },
      { name: 'bp_len / bp_width', label: 'Base Plate Dimensions', symbol: 'L_bp, B_bp', unit: 'mm', required: true, source: 'Civil Foundation', meaning: 'Saddle floor baseplate footprint length and width.', validation: 'Must satisfy concrete bearing stress limits.', commonMistake: 'Baseplate too small, crushing concrete piers.' },
      { name: 'wear_plate', label: 'Wear Plate Toggled', symbol: 'WP', unit: 'select', required: true, source: 'Drawing', meaning: 'Whether a reinforcement wear plate is welded between saddle and shell.', validation: 'Options: True / False.', commonMistake: 'Omitting wear plate when horn stress $S_3$ is overstressed.' },
      { name: 'fluid_den', label: 'Fluid Operating Density', symbol: 'ρ_f', unit: 'kg/m³', required: true, source: 'Process Data', meaning: 'Density of fluid contained inside vessel (e.g. 1000 for water test).', validation: 'Must be positive.', commonMistake: 'Using operating hydrocarbon density (750 kg/m³) instead of water hydrotest density (1000 kg/m³).' }
    ],

    workedExample: {
      problemStatement: 'Evaluate saddle support stresses for a 2000 mm ID × 12 mm thick horizontal water storage accumulator vessel with length L = 6000 mm supported by two 120° saddles.',
      givenData: {
        vesselID: '2000 mm',
        vesselNomThk: '12 mm (corroded t = 10 mm)',
        vesselLength: '6000 mm',
        saddleLocation: 'A = 900 mm (A/L = 0.15 ≤ 0.20)',
        saddleAngle: 'θ = 120°',
        saddleWidth: 'b = 250 mm',
        totalWeight: 'W = 280,000 N (Vessel + water full)',
        material: 'SA-516 Gr. 70 (S = 138 MPa)'
      },
      calculationSteps: [
        '1. Saddle Reaction: Q = W / 2 = 280,000 / 2 = 140,000 N per saddle.',
        '2. Location Ratio: A / L = 900 / 6000 = 0.15 ≤ 0.20. Head stiffening credit active!',
        '3. Longitudinal Bending at Midspan (S1a): Bending moment M1 = 125,000 N·m. Stress S1a = M1 / (π·R²·t) = 125e6 / (π · 1005² · 10) = 3.9 MPa (Negligible).',
        '4. Longitudinal Bending over Saddles (S1b): Bending moment M2 = 158,000 N·m. Stress S1b = M2 / (π·R²·t) = 5.0 MPa (Negligible).',
        '5. Tangential Shear Stress (S2): S2 = (K2 · Q) / (R · t) = (1.17 · 140,000) / (1005 · 10) = 16.3 MPa. Allowable 0.8 · S = 110.4 MPa → PASS.',
        '6. Saddle Horn Stress (S3): S3 = - Q / (4 · t · (b + 1.56√(R·t))) - (3 · K6 · Q) / (2 · t²) = -140,000 / (4 · 10 · (250 + 1.56√(1005·10))) - (3 · 0.053 · 140,000) / (2 · 10²) = -10.3 - 111.3 = -121.6 MPa. Allowable 1.25 · S = 172.5 MPa → PASS.'
      ],
      conclusion: 'PASS. The horizontal vessel satisfies the Zick criteria with a 120° saddle angle and A = 900 mm. Saddle horn stress is 121.6 MPa against allowable 172.5 MPa without requiring a reinforcing wear plate.'
    },

    verificationChecklist: [
      { id: 'dual_check', label: 'Vessel confirmed supported on EXACTLY TWO saddles (never three or more without specialized load sharing spring assemblies)' },
      { id: 'loc_ratio', label: 'Saddle location verified A ≤ 0.2L to utilize head dishing stiffening and prevent high shell ovalization' },
      { id: 'angle_check', label: 'Saddle wrap angle verified θ ≥ 120° per ASME Section VIII-2 Part 4.15' },
      { id: 'water_check', label: 'Hydrostatic water test full condition (100% water fill density) checked as governing weight condition' },
      { id: 'slot_check', label: 'One saddle designated fixed (anchor bolts tight) and one saddle slotted/sliding to permit free axial thermal expansion' }
    ],

    faqs: [
      { q: 'Why are horizontal vessels almost never supported on three saddles?', a: 'Because a horizontal cylindrical vessel is extremely stiff along its longitudinal axis. Slight thermal expansion, minor uneven foundation settlement (even 2–3 mm), or soil movement will lift the vessel entirely off the center or end supports, transferring 80–100% of the total vessel weight onto a single saddle and causing immediate shell buckling.' }
    ],

    relatedTopics: ['nozzle-analysis', 'asme-materials', 'results-reports'],
    references: [
      { source: 'L.P. Zick (1951)', topic: 'Stresses in Large Horizontal Cylindrical Pressure Vessels on Two Saddle Supports (Welding Journal)' },
      { source: 'ASME Section VIII Division 2', topic: 'Part 4.15: Design Rules for Supports and Attachments' }
    ]
  },

  // ==========================================
  // 6. HOT BOX ANALYSIS
  // ==========================================
  {
    id: 'hot-box-analysis',
    slug: 'hot-box-analysis',
    title: 'Hot Box Analysis: High-Temperature Skirt-to-Head Junction Thermal FEA',
    category: 'Analysis Modules',
    badge: 'Thermal Stress & Crotch FEA',
    discipline: 'Thermal & Pressure Vessels',
    difficulty: 'Expert',
    type: 'Guide & Reference',
    standard: 'API RP 571 / WRC Bulletin 438 / ASME VIII-2 Part 5',
    version: 'Nova v2.1',
    readingTime: '21 min',
    lastReviewed: 'October 2026',
    summary: 'Finite element steady-state and transient heat transfer analysis of vertical pressure vessel skirt supports: refractory insulation, hot box air gap conduction, and crotch weld thermal fatigue prevention.',
    
    depthContent: {
      beginner: 'In tall vertical pressure vessels that operate at very high temperatures (like refinery distillation columns, fluid catalytic cracking reactors, and coke drums), the vessel head is extremely hot (often 300°C to 450°C), while the concrete foundation at the bottom of the support skirt is cool (ambient 25°C). A "Hot Box" is an enclosed, insulated chamber designed around the weld where the skirt attaches to the bottom head. This analysis models how heat flows through the metal and insulation to ensure the skirt does not crack from thermal fatigue.',
      engineer: 'The skirt-to-head weld junction is subject to severe triaxial thermal restraint. If the cylindrical skirt is left uninsulated, ambient air cools the skirt rapidly just below the weld. The hot head expands radially outward, while the cool skirt resists radial expansion, producing severe secondary thermal bending stresses ($Q$) at the crotch weld. A "Hot Box" uses an internal insulation support ring welded down the skirt (e.g. 500 mm below the weld) with refractory insulation (mineral wool / ceramic fiber) to create an enclosed air pocket. This forces the axial temperature drop to occur over a long, gentle distance, reducing thermal stress.',
      expert: 'Nova solves the axisymmetric coupled thermal-stress differential field: $-\\nabla \\cdot (k \\nabla T) = 0$ subject to convective boundary conditions: $q\" = h_c (T_w - T_f)$ and radiation exchange: $q\" = \\sigma \\epsilon (T_1^4 - T_2^4)$. The resulting temperature field $T(r, z)$ is mapped as a body thermal load into the structural elastoplastic equilibrium equations: $\\sigma_{ij} = C_{ijkl} [\\epsilon_{kl} - \\alpha \\Delta T \\delta_{kl}]$. Stresses are linearized along the crotch weld throat to verify $(P_L + P_b + Q) \\le 3.0S$ for shakedown and evaluated for low-cycle thermal fatigue cracking per API RP 571 mechanisms.'
    },

    overview: `
In petroleum refineries and petrochemical processing units, **heavy vertical columns and reactors** (such as Vacuum Towers, Hydrocrackers, FCC Fractionators, and Delayed Coking Drums) operate at internal process temperatures between 250°C and 500°C.
Supporting these heavy vertical vessels via a cylindrical steel skirt welded to the bottom head generates severe thermal-structural discontinuity stresses.

The **Nova Hot Box Analysis Module** performs verified axisymmetric **Thermal & Stress Finite Element Analysis** of the head-to-skirt junction.
    `,

    purpose: 'To model temperature distribution along the vessel support skirt, evaluate the thermal effectiveness of the hot box insulation barrier, prevent cyclic thermal fatigue cracking, and verify weld crotch stress compliance.',

    parameters: [
      { name: 'head_mat', label: 'Head Material', symbol: 'Mat_h', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Alloy steel of bottom vessel head (e.g. SA-516 Gr 70, SA-387 Gr 11).', validation: 'ASME certified grade.', commonMistake: 'Selecting carbon steel when high-temp chrome-moly was specified.' },
      { name: 'skirt_mat', label: 'Skirt Material', symbol: 'Mat_s', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Structural steel of the cylindrical support skirt (e.g. SA-36, SA-516 70).', validation: 'Verify compatibility with head material.', commonMistake: 'Using carbon steel skirt without checking galvanic or thermal expansion mismatch.' },
      { name: 'insul_mat', label: 'Insulation Material', symbol: 'Mat_ins', unit: 'text', required: true, source: 'Refractory Spec', meaning: 'Internal hot box insulation (Mineral Wool, Ceramic Fiber Blanket).', validation: 'Must withstand fluid operating temperature.', commonMistake: 'Entering ambient conductivity instead of temperature-dependent conductivity.' },
      { name: 'head_type', label: 'Head Type', symbol: 'Head_type', unit: 'select', required: true, source: 'Drawing', meaning: 'Geometric shape of bottom head.', validation: 'Flat Head, Torispherical Head, Ellipsoidal Head.', commonMistake: 'Using flat head assumptions for ellipsoidal head junction.' },
      { name: 'd_temp', label: 'Design Temperature', symbol: 'T_des', unit: '°C', required: true, source: 'Process Data', meaning: 'Process fluid design temperature.', validation: 'Typically 200°C to 500°C.', commonMistake: 'Using ambient temperature.' },
      { name: 'amb_temp', label: 'Ambient Air Temperature', symbol: 'T_amb', unit: '°C', required: true, source: 'Site Weather Data', meaning: 'Surrounding atmospheric temperature outside skirt.', validation: 'Typically 20°C to 45°C.', commonMistake: 'Omitting minimum winter ambient temperature.' },
      { name: 'head_id / head_thk', label: 'Head Dimensions', symbol: 'ID_h, t_h', unit: 'mm', required: true, source: 'Drawing', meaning: 'Head inside diameter and wall thickness.', validation: 'Must be positive.', commonMistake: 'Neglecting corroded thickness.' },
      { name: 'skirt_id / skirt_thk', label: 'Skirt Dimensions', symbol: 'ID_s, t_s', unit: 'mm', required: true, source: 'Drawing', meaning: 'Cylindrical skirt inside diameter and thickness.', validation: 'Typically matches vessel shell OD.', commonMistake: 'Entering skirt OD instead of ID.' },
      { name: 'skirt_length', label: 'Skirt Modeled Length', symbol: 'L_s', unit: 'mm', required: true, source: 'Drawing', meaning: 'Total length of skirt from weld junction down to base ring.', validation: 'Typically 1500 mm to 6000 mm.', commonMistake: 'Modeling too short skirt length, distorting lower thermal boundary conditions.' },
      { name: 'ins_supp_loc', label: 'Insulation Support Location', symbol: 'L_supp', unit: 'mm', required: true, source: 'Hot Box Detail', meaning: 'Distance from junction weld down to insulation support shelf.', validation: 'Typically 300 mm to 800 mm.', commonMistake: 'Placing shelf too close to weld, destroying hot box air buffer.' },
      { name: 'film_coeff', label: 'Convection Film Coefficient', symbol: 'h_c', unit: 'W/m²K', required: true, source: 'Heat Transfer', meaning: 'Convective heat transfer coefficient to ambient air.', validation: 'Standard natural convection: 10–25 W/m²K.', commonMistake: 'Using forced convection coefficients for sheltered indoor vessels.' }
    ],

    workedExample: {
      problemStatement: 'Evaluate thermal gradient and crotch bending stress in a vertical coke drum skirt attachment operating with 380°C process fluid.',
      givenData: {
        headMaterial: 'SA-387 Gr. 11 Cl. 2 (1.25Cr-0.5Mo)',
        skirtMaterial: 'SA-516 Gr. 70 (upper 1.5 m) transitioning to SA-36',
        insulationMaterial: 'Ceramic Fiber (k = 0.08 W/m·K)',
        headType: '2:1 Ellipsoidal Head (ID = 3000 mm, thk = 32 mm)',
        skirtDimensions: 'ID = 3000 mm, thk = 25 mm, Length = 2500 mm',
        fluidTemp: '380°C',
        ambientTemp: '25°C',
        insulationSupportLocation: '600 mm below junction weld',
        internalPressure: '1.2 MPa'
      },
      calculationSteps: [
        '1. Finite Element Thermal Mesh: Axisymmetric 2D continuum mesh generated with junction refinement of 5 mm.',
        '2. Steady-State Conduction Solve: Head junction metal temperature settles at 368°C.',
        '3. Air Pocket & Insulation Action: Enclosed hot box air buffer maintains skirt temperature above 320°C for the first 400 mm of length.',
        '4. Axial Temperature Gradient: Peak thermal decay rate = dT/dz = 0.28°C/mm (Well below the 0.50°C/mm cracking threshold).',
        '5. Structural Solve: Mechanical pressure (1.2 MPa) + self-weight + thermal expansion load vector.',
        '6. Crotch Linearized Stresses: Primary membrane PL = 48 MPa (Allowable 1.5·S = 207 MPa) → SAFE. Secondary thermal bending Q = 285 MPa.',
        '7. Shakedown Verification: (PL + Pb + Q) = 48 + 285 = 333 MPa. Allowable 3.0 · S = 414 MPa. Stress ratio = 333 / 414 = 0.804 ≤ 1.00.'
      ],
      conclusion: 'PASS. The Hot Box design provides a smooth temperature transition, keeping the axial temperature gradient at 0.28°C/mm and satisfying the ASME Section VIII Division 2 (Part 5) 3S shakedown limit with a 19.6% safety margin.'
    },

    verificationChecklist: [
      { id: 'crotch_radius', label: 'Crotch blend radius between skirt and bottom head verified fully machined with smooth transition (min R ≥ 25 mm)' },
      { id: 'ins_fit', label: 'Internal insulation tightly fitted against skirt wall without gaps to prevent natural convection chimney bypass' },
      { id: 'weep_check', label: 'Drainage weep holes provided in insulation support shelf to prevent trapping condensed water or hydrocarbons' },
      { id: 'mat_trans', label: 'If transitioning from Cr-Mo skirt stub to Carbon Steel lower skirt, transition weld located well below hot box zone' }
    ],

    faqs: [
      { q: 'What is API RP 571 damage mechanism for skirt crotch cracking?', a: 'API RP 571 Section 4.2.9 identifies "Thermal Fatigue" as the primary damage mechanism for high-temperature vessel skirts. Rapid cyclic heating during startup and cooldown creates cyclic thermal strain ranges that cause circumferential fatigue cracks initiating from the inner crotch weld root.' }
    ],

    relatedTopics: ['local-pwht', 'asme-materials', 'results-reports'],
    references: [
      { source: 'WRC Bulletin 438', topic: 'Thermal Stress in Vessel Skirts and Heads' },
      { source: 'API Recommended Practice 571', topic: 'Damage Mechanisms Affecting Fixed Equipment in the Refining Industry' },
      { source: 'ASME Section VIII Division 2', topic: 'Part 5: Design-by-Analysis (Thermal Stress Rules)' }
    ]
  },

  // ==========================================
  // 7. STIFFENER ANALYSIS
  // ==========================================
  {
    id: 'stiffener-analysis',
    slug: 'stiffener-analysis',
    title: 'Stiffener Analysis: External Pressure & Vacuum Buckling Prevention',
    category: 'Analysis Modules',
    badge: 'Buckling & Stability',
    discipline: 'Structural & Pressure Vessels',
    difficulty: 'Intermediate',
    type: 'Guide & Reference',
    standard: 'ASME Section VIII Div 1 UG-29 / UG-30 & Div 2 Part 4.4',
    version: 'Nova v2.0',
    readingTime: '17 min',
    lastReviewed: 'October 2026',
    summary: 'Design and sizing of circumferential stiffening rings for cylindrical shells under external pressure or vacuum: required moment of inertia (Is), ring profiles (Flat, T, I), and buckling safety margins.',
    
    depthContent: {
      beginner: 'When a pressure vessel operates under vacuum or external water/soil pressure, the pressure pushes inward. Thin-walled cylinders are very weak against inward pressure and will suddenly crumple (buckle) into oval or lobed shapes at pressures far lower than what would burst them from the inside. Stiffener rings are circular steel hoops welded around the vessel to hold it round. This analysis calculates the required thickness and spacing of these rings to prevent collapse.',
      engineer: 'Under external pressure, cylindrical shells fail by elastic or plastic bifurcation buckling. The allowable external working pressure ($P_a$) depends on shell diameter ($D_o$), thickness ($t$), and the unsupported length between stiffener rings ($L_s$). Stiffener rings divide the shell into shorter segments, drastically increasing buckling capacity. ASME Section VIII Division 1 UG-29 mandates that each ring composite section (ring plus contributing shell width) must possess a moment of inertia $I_s \\ge I_s^{\\text{required}}$ derived using the ASME Section II-D external pressure charts (Factors $A$ and $B$).',
      expert: 'The classical von Mises-Windenburg buckling equation for an unreinforced thin cylinder is: $P_{cr} = \\frac{2.42 E (t/D_o)^{5/2}}{(1 - \\nu^2)^{3/4} [L_s/D_o - 0.45(t/D_o)^{1/2}]}$. ASME Section VIII Division 1 incorporates a theoretical safety factor of 3.0 against elastic buckling. For stiffening rings, UG-29 evaluates the required moment of inertia: $I_s = \\frac{D_o^2 L_s (t + A_s/L_s) A}{14}$, where Factor $A = \\frac{1.1}{(D_o / t_h)^2}$ and Factor $B$ is determined from the material temperature chart. Nova supports Flat Bar, T-Section, and I-Beam stiffeners, evaluating composite section neutral axis shifts and local flange buckling.'
    },

    overview: `
Pressure vessels operating under **vacuum conditions** (vacuum distillation towers, condensers, vacuum drying tanks) or subjected to **external hydrostatic pressure** (subsea equipment, jacketed reactors) are susceptible to catastrophic elastic buckling.

The **Nova Vessel Stiffener Ring Analysis Module** calculates required ring cross-sections per **ASME Section VIII Division 1 UG-29 / UG-30** and **Division 2 Part 4.4**.
    `,

    purpose: 'To prevent structural collapse under external pressure by verifying stiffener ring moment of inertia ($I_s$), ring spacing ($L_s$), and maximum allowable external working pressure ($P_a$).',

    parameters: [
      { name: 'v_id', label: 'Vessel Inside Diameter', symbol: 'D_i', unit: 'mm', required: true, source: 'Vessel Drawing', meaning: 'Inside diameter of vessel shell cylinder.', validation: 'Must be positive.', commonMistake: 'Entering radius.' },
      { name: 'v_thk', label: 'Shell Wall Thickness', symbol: 't', unit: 'mm', required: true, source: 'Vessel Drawing', meaning: 'Corroded wall thickness of vessel shell.', validation: 'Must be positive.', commonMistake: 'Using uncorroded thickness.' },
      { name: 'v_length', label: 'Total Vessel Length', symbol: 'L_total', unit: 'mm', required: true, source: 'Drawing', meaning: 'Total length of cylindrical shell.', validation: 'Must be > 0.', commonMistake: 'Confusing shell length with ring spacing.' },
      { name: 'no_rings', label: 'Number of Stiffener Rings', symbol: 'N_rings', unit: 'integer', required: true, source: 'Design', meaning: 'Count of circumferential stiffening rings installed.', validation: 'Integer $\\ge 1$.', commonMistake: 'Entering 0 rings (use plain shell external pressure rules).' },
      { name: 'ring_profile', label: 'Ring Profile Type', symbol: 'Profile', unit: 'select', required: true, source: 'Structural Drawing', meaning: 'Cross-sectional shape of stiffening ring.', validation: 'Flat, T-Section, I-Section.', commonMistake: 'Selecting flat bar when heavy T-section was fabricated.' },
      { name: 'web_height / web_thk', label: 'Web Dimensions', symbol: 'h_w, t_w', unit: 'mm', required: true, source: 'Steel Section', meaning: 'Height and thickness of the ring web plate standing normal to shell.', validation: 'Must satisfy local plate buckling slenderness limits.', commonMistake: 'Web plate too thin, causing local torsional web buckling.' },
      { name: 'flange_width / flange_thk', label: 'Flange Dimensions', symbol: 'w_f, t_f', unit: 'mm', required: false, source: 'Steel Section', meaning: 'Width and thickness of the outer flange cap (for T and I profiles).', validation: 'Required if profile is T or I.', commonMistake: 'Leaving blank when T-section is selected.' },
      { name: 'ext_pressure', label: 'External Design Pressure', symbol: 'P_ext', unit: 'MPa', required: true, source: 'Process Data', meaning: 'External design pressure (e.g. 0.103 MPa for full vacuum).', validation: 'Must be positive.', commonMistake: 'Entering negative value for vacuum.' }
    ],

    workedExample: {
      problemStatement: 'Verify external pressure stiffener ring sizing on a 2000 mm ID × 10 mm corroded shell under full vacuum (0.1 MPa) with 3 rings.',
      givenData: {
        vesselID: '2000 mm (Do = 2020 mm)',
        shellThk: '10 mm corroded',
        vesselLength: '6000 mm',
        numRings: '3 rings (Spacing Ls = 6000 / 4 = 1500 mm)',
        ringProfile: 'T-Section: Web 120 mm × 10 mm, Flange 100 mm × 12 mm',
        material: 'SA-516 Gr. 70 at 150°C',
        externalPressure: '0.1 MPa (1.0 bar / full vacuum)'
      },
      calculationSteps: [
        '1. Ring Spacing: Ls = 6000 / (3 + 1) = 1500 mm.',
        '2. Ls / Do Ratio: 1500 / 2020 = 0.743. Do / t Ratio = 2020 / 10 = 202.',
        '3. Factor A from ASME Section II-D Table G: A = 0.00031.',
        '4. Factor B from Chart CS-2 at 150°C: B = 45 MPa.',
        '5. Allowable Shell Pressure (Pa): Pa = (4 · B) / (3 · (Do / t)) = (4 · 45) / (3 · 202) = 0.297 MPa > 0.1 MPa → Shell Thickness PASS.',
        '6. Required Moment of Inertia (Is_req): Is_req = (Do² · Ls · (t + As/Ls) · A) / 14 = (2020² · 1500 · (10 + 2400/1500) · 0.00031) / 14 = 1,572,000 mm⁴.',
        '7. Available Ring Moment of Inertia (Is_act): T-section composite inertia with shell participating width (1.1√(Do·t)) = 2,840,000 mm⁴.',
        '8. Inertia Ratio: Is_act / Is_req = 2,840,000 / 1,572,000 = 1.81 ≥ 1.00.'
      ],
      conclusion: 'PASS. The stiffening rings provide 181% of required ASME moment of inertia, ensuring complete stability against vacuum buckling with a safety factor > 3.0.'
    },

    verificationChecklist: [
      { id: 'full_vac', label: 'External pressure includes full vacuum (0.103 MPa) plus any external liquid head or jacket pressure' },
      { id: 'inertia_check', label: 'Actual composite moment of inertia (Is_act) strictly exceeds ASME UG-29 required inertia (Is_req)' },
      { id: 'web_slender', label: 'Web height-to-thickness ratio satisfies hw/tw ≤ 10 to prevent local torsional lateral buckling' },
      { id: 'weld_spacing', label: 'Ring-to-shell attachment welds sized to transfer radial shear without gap separation' }
    ],

    faqs: [
      { q: 'Can stiffener rings be installed inside the vessel instead of outside?', a: 'Yes. ASME codes allow stiffener rings to be located on either the inside or outside of the shell. Internal rings do not interfere with external piping and insulation blankets, but they may obstruct internal process flow and tray cleaning.' }
    ],

    relatedTopics: ['nozzle-analysis', 'saddle-analysis', 'asme-materials'],
    references: [
      { source: 'ASME BPVC Section VIII Division 1', topic: 'UG-28, UG-29, UG-30: External Pressure Rules and Stiffening Rings' },
      { source: 'ASME BPVC Section VIII Division 2', topic: 'Part 4.4: Design of Shells Under External Pressure' },
      { source: 'Windenburg & Trilling (1934)', topic: 'Collapse by Instability of Thin Cylindrical Shells Under External Pressure' }
    ]
  },

  // ==========================================
  // 8. TUBESHEET ANALYSIS
  // ==========================================
  {
    id: 'tubesheet-analysis',
    slug: 'tubesheet-analysis',
    title: 'Tubesheet Analysis: 2D Axisymmetric Shell-and-Tube Exchanger Design',
    category: 'Analysis Modules',
    badge: 'Heat Exchanger Suite',
    discipline: 'Heat Exchangers & Vessels',
    difficulty: 'Expert',
    type: 'Guide & Reference',
    standard: 'ASME Section VIII Div 1 Part UHX / TEMA 10th Ed (RCB)',
    version: 'Nova v2.2',
    readingTime: '22 min',
    lastReviewed: 'October 2026',
    summary: 'Engineering design and verification of heat exchanger tubesheets: fixed, U-tube, and floating head configurations, ligament efficiencies, differential thermal expansion, and tube-to-tubesheet joint loads.',
    
    depthContent: {
      beginner: 'A shell-and-tube heat exchanger is a large tank containing hundreds of small pipes (tubes) through which heat is transferred between two fluids. A tubesheet is a thick round plate drilled with hundreds of holes that holds the tube ends and keeps the hot and cold fluids separated. Tubesheet analysis calculates how thick this drilled plate must be so it does not bend under high pressure and checks that the tubes will not pull out of their holes.',
      engineer: 'Tubesheets operate under differential pressure (tube-side pressure vs. shell-side pressure) and differential thermal growth. Under ASME Section VIII Division 1 Part UHX and TEMA standards, the perforated tubesheet is mathematically converted into an equivalent solid plate with effective elastic modulus ($E^*$) and effective Poisson’s ratio ($\\nu^*$) based on ligament efficiency ($\\mu$). In Fixed Tubesheet exchangers, the tube bundle acts as an elastic foundation restraining tubesheet bending, but unequal thermal expansion between the shell and tube bundle generates severe axial tube loads that can pull tubes out of the tubesheet or buckle them.',
      expert: 'Nova implements both the ASME Part UHX analytical framework and a 2D axisymmetric finite element continuum solver. Ligament efficiency is calculated for triangular or square pitch: $\\mu = (p - d_o)/p$. The classical thin plate flexure equation $\\nabla^4 w + \\frac{k_w}{D^*} w = \\frac{q}{D^*}$ is solved, where $k_w = \\frac{n_t E_t A_t}{L_t A_{ts}}$ represents the elastic foundation modulus provided by the tube bundle. Boundary conditions account for rotational stiffness at the shell and channel junctions. Tube-to-tubesheet joint axial loads are evaluated for strength-welded or expanded joints per ASME UW-20 / Mandatory Appendix A.'
    },

    overview: `
**Shell-and-tube heat exchangers** are workhorses of thermal energy transfer in refineries, chemical processing plants, and power stations.
The **tubesheet** is the most critical and complex structural component, functioning simultaneously as a pressure barrier, a structural support for thousands of tubes, and a flange connection.

The **Nova Tubesheet Analysis Module** incorporates the complete rules of **ASME Section VIII Division 1 Part UHX** and **TEMA (Tubular Exchanger Manufacturers Association) 10th Edition**.
    `,

    purpose: 'To calculate tubesheet thickness, evaluate bending and shear stresses across perforated ligaments, prevent tube-to-tubesheet joint pull-out, and check tube buckling under differential thermal expansion.',

    parameters: [
      { name: 'ts_mat', label: 'Tubesheet Material', symbol: 'Mat_ts', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Forged or plate material of tubesheet (e.g. SA-516 Gr 70, SA-266 Cl 2, SA-240 316).', validation: 'Certified ASME grade.', commonMistake: 'Selecting incompatible material causing galvanic corrosion with tubes.' },
      { name: 'tube_mat', label: 'Tube Material', symbol: 'Mat_t', unit: 'text', required: true, source: 'ASME Sec II-D', meaning: 'Tubing alloy specification (e.g. SA-179, SA-213 TP304, Titanium B338).', validation: 'Must have documented thermal expansion coefficient.', commonMistake: 'Neglecting thermal expansion difference between carbon steel shell and stainless tubes.' },
      { name: 'exch_type', label: 'Type of Exchanger', symbol: 'Type', unit: 'select', required: true, source: 'Process Spec', meaning: 'Structural configuration: Fixed Tubesheet, U-Tube, or Floating Head.', validation: 'Options: Fixed, U-Tube, Floating.', commonMistake: 'Using U-tube formulas for fixed tubesheet exchangers.' },
      { name: 'ts_od / ts_thk', label: 'Tubesheet Dimensions', symbol: 'OD_ts, t_ts', unit: 'mm', required: true, source: 'Drawing', meaning: 'Outside diameter and plate thickness of tubesheet.', validation: 'Must be positive.', commonMistake: 'Entering unmachined plate thickness instead of finished corroded thickness.' },
      { name: 'tube_od / tube_thk', label: 'Tube Dimensions', symbol: 'd_o, t_t', unit: 'mm', required: true, source: 'TEMA Table', meaning: 'Outside diameter and wall thickness of heat exchanger tubes.', validation: 'Standard sizes (19.05 mm, 25.4 mm, etc.).', commonMistake: 'Entering inside diameter of tube.' },
      { name: 'tube_pitch', label: 'Tube Pitch Spacing', symbol: 'p', unit: 'mm', required: true, source: 'TEMA Layout', meaning: 'Center-to-center spacing between adjacent tube holes.', validation: 'Must be > tube OD (min p ≥ 1.25·do).', commonMistake: 'Specifying pitch too tight to permit welding or expanding tools.' },
      { name: 'no_tubes', label: 'Number of Tubes', symbol: 'N_t', unit: 'integer', required: true, source: 'Thermal Rating', meaning: 'Total count of tubes in bundle.', validation: 'Integer $\\ge 10$.', commonMistake: 'Mismatch between tube count and actual drilling count.' },
      { name: 'tube_side_press', label: 'Tube-Side Pressure', symbol: 'P_t', unit: 'MPa', required: true, source: 'Process Data', meaning: 'Internal design pressure inside tubes and channels.', validation: 'Must be positive.', commonMistake: 'Neglecting pressure drops across passes.' },
      { name: 'shell_side_press', label: 'Shell-Side Pressure', symbol: 'P_s', unit: 'MPa', required: true, source: 'Process Data', meaning: 'Internal design pressure inside exchanger shell cylinder.', validation: 'Must be positive.', commonMistake: 'Evaluating only simultaneous pressure, ignoring single-side pressure loading cases.' }
    ],

    workedExample: {
      problemStatement: 'Perform an ASME UHX verification of a Fixed Tubesheet Heat Exchanger (1000 mm ID shell, 2.0 MPa tube-side pressure, 1.5 MPa shell-side pressure).',
      givenData: {
        tubesheetMaterial: 'SA-516 Gr. 70 (Allowable stress S = 138 MPa)',
        shellMaterial: 'SA-516 Gr. 70 (ID = 1000 mm, thickness = 16 mm)',
        tubeMaterial: 'SA-179 Seamless Carbon Steel (do = 25.4 mm, thk = 2.11 mm, Length = 6000 mm)',
        tubePitch: '31.75 mm (1.25 in on 30° triangular pitch)',
        numTubes: '500 tubes',
        tubesheetThk: '80 mm nominal',
        tubeSidePress: '2.0 MPa at 150°C',
        shellSidePress: '1.5 MPa at 200°C'
      },
      calculationSteps: [
        '1. Ligament Efficiency: μ = (p - do) / p = (31.75 - 25.4) / 31.75 = 0.20.',
        '2. Equivalent Solid Plate Modulus: Per ASME UHX Table UHX-10.1 for μ = 0.20, E*/E = 0.32 → E* = 0.32 · 195,000 = 62,400 MPa. ν* = 0.38.',
        '3. Differential Pressure Loading Cases: Case 1: Pt only (2.0 MPa). Case 2: Ps only (1.5 MPa). Case 3: Pt + Ps combined. Case 4: Thermal differential (200°C shell vs 150°C tubes).',
        '4. Foundation Modulus (kw): kw = (500 · 195,000 · 154) / (6000 · 785,398) = 15,015 / 4712 = 3.18 MPa/mm.',
        '5. Maximum Tubesheet Bending Stress: Calculated across governing Case 4 (Thermal differential + Pressure) = 162.5 MPa. Allowable 1.5 · S = 207 MPa → PASS (Margin = 21.5%).',
        '6. Outer Edge Shear Stress: Calculated τ = 22.4 MPa. Allowable 0.8 · S = 110.4 MPa → PASS.',
        '7. Maximum Tube Axial Load: Compressive load per tube = 8,450 N. Tube Euler buckling load = 14,200 N → SAFE from tube buckling.'
      ],
      conclusion: 'PASS. The 80 mm thick tubesheet satisfies ASME Section VIII Div 1 Part UHX for all four loading cases with acceptable ligament bending stresses and positive margin against tube buckling.'
    },

    verificationChecklist: [
      { id: 'seven_cases', label: 'All 7 mandatory ASME Part UHX loading cases evaluated (3 Design pressure cases, 3 Operating thermal cases, 1 Vacuum case)' },
      { id: 'tube_joint', label: 'Tube-to-tubesheet joint allowable load verified per ASME Mandatory Appendix A (expanded, seal-welded, or strength-welded)' },
      { id: 'ligament_min', label: 'Minimum ligament width after hole reaming tolerances verified ≥ 3.0 mm' },
      { id: 'expansion_joint', label: 'If fixed tubesheet thermal expansion axial stress in shell or tubes exceeds limits, shell bellows expansion joint added' }
    ],

    faqs: [
      { q: 'Why do fixed tubesheet heat exchangers sometimes require a bellows in the shell?', a: 'In fixed tubesheet exchangers, the tubesheets are welded rigidly to both ends of the shell. If the shell-side fluid is at 250°C and the tube-side fluid is at 80°C, the shell wants to expand much more than the tubes. Because they are welded together, the shell pulls in tension while crushing the tubes in compression. When this compressive load exceeds the buckling limit of the tubes, an expansion bellows must be installed in the shell to absorb the differential expansion.' }
    ],

    relatedTopics: ['bellows-analysis', 'nozzle-analysis', 'asme-materials'],
    references: [
      { source: 'ASME BPVC Section VIII Division 1', topic: 'Part UHX: Rules for Heat Exchangers' },
      { source: 'TEMA Standards 10th Edition', topic: 'Tubular Exchanger Manufacturers Association Standards' },
      { source: 'K.A. Gardner (1948)', topic: 'Heat-Exchanger Tube-Sheet Design' }
    ]
  },

  // ==========================================
  // 9. LUG ANALYSIS
  // ==========================================
  {
    id: 'lug-analysis',
    slug: 'lug-analysis',
    title: 'Lug Analysis: Lifting Lug Pin Bearing, Tear-out & Shell WRC Stresses',
    category: 'Analysis Modules',
    badge: 'Rigging & Lifting Safety',
    discipline: 'Rigging & Vessels',
    difficulty: 'Intermediate',
    type: 'Guide & Reference',
    standard: 'WRC Bulletin 107/537 / ASME B30.20 / AISC 360-16',
    version: 'Nova v2.1',
    readingTime: '16 min',
    lastReviewed: 'October 2026',
    summary: 'Safety-critical lifting lug engineering: pin hole bearing stresses, shear tear-out, plate tensile stress, attachment weld sizing, dynamic impact factors (1.5x), and local vessel shell WRC stresses.',
    
    depthContent: {
      beginner: 'Lifting lugs are heavy steel plates with holes welded onto pressure vessels, tanks, or machinery so crane hooks and rigging shackles can lift and install them on site. If a lifting lug tears or breaks during a crane lift, hundreds of tons of equipment can drop, causing fatal accidents. Lug analysis calculates pin bearing stress in the hole, shear tear-out at the top edge, weld size, and ensures the vessel shell will not tear where the lug is welded.',
      engineer: 'Lifting lug design involves two distinct structural domains: (1) The lug plate itself under shackle pin loading, evaluating pin bearing stress ($\\sigma_{br}$), net-section tensile stress ($\\sigma_t$), and shear tear-out across the upper edge distance ($e$), and (2) The localized vessel shell wall at the lug base attachment, evaluated using WRC Bulletin 537/107 for longitudinal and circumferential bending moments induced by inclined rigging slings. A mandatory Dynamic Impact Factor (typically 1.5× for mobile cranes, 1.25× for overhead shop cranes) must be applied to all hook loads per ASME B30.20.',
      expert: 'In rigging mechanics, sling angle $\\theta$ from the vertical induces an axial tensile component $P_v = P_{sling} \\cos\\theta$ and a lateral shear/bending component $P_h = P_{sling} \\sin\\theta$. Pin bearing stress is calculated across projected contact area: $\\sigma_{br} = \\frac{P_{sling}}{d_{pin} \\cdot t_{lug}} \\le 0.9 S_y$. Shear tear-out occurs along two parallel planes from the pin hole to the lug crown: $\\tau = \\frac{P_{sling}}{2 \\cdot (R_{top} - d_{hole}/2) \\cdot t_{lug}} \\le 0.4 S_y$. Local vessel stresses at the footprint are converted into Bijlaard parameters for a solid rectangular attachment ($2c_1 \\times 2c_2$), checking $P_L + P_b \\le 1.5S$.'
    },

    overview: `
**Lifting lugs** (lifting eyes, pad eyes, and rigging trunnions) are safety-critical lifting attachments welded to equipment to facilitate transportation, crane hoisting, and erection.
Because rigging operations occur above personnel and expensive process units, lifting lug structural failure carries a **zero-tolerance safety margin**.

The **Nova Lug Lifting Analysis Module** verifies lug plate integrity, shackle pin contact, attachment welds, and vessel shell localized stresses per **ASME B30.20**, **AISC 360-16**, and **WRC Bulletin 537**.
    `,

    purpose: 'To guarantee that lifting lugs, shackle connections, attachment fillet welds, and the underlying vessel shell safely sustain all dead weights and dynamic crane hoisting loads without yield, tear-out, or shell rupture.',

    parameters: [
      { name: 'v_id / v_thk', label: 'Vessel ID & Thickness', symbol: 'D_i, t', unit: 'mm', required: true, source: 'Drawing', meaning: 'Vessel shell inside diameter and thickness at lug location.', validation: 'Must be positive.', commonMistake: 'Entering nominal thickness without subtracting corrosion.' },
      { name: 'lug_orient', label: 'Lug Orientation', symbol: 'Orient', unit: 'select', required: true, source: 'Rigging Drawing', meaning: 'Orientation relative to vessel axis: Longitudinal or Circumferential.', validation: 'Longitudinal or Circumferential.', commonMistake: 'Longitudinal lugs on small vessels experiencing high circumferential bending.' },
      { name: 'lug_base_len', label: 'Lug Base Length', symbol: 'L_b', unit: 'mm', required: true, source: 'Drawing', meaning: 'Welded contact footprint length of lug plate on vessel shell.', validation: 'Must be positive.', commonMistake: 'Too short base length, concentrating high line-load stresses on shell.' },
      { name: 'lug_thk', label: 'Lug Plate Thickness', symbol: 't_lug', unit: 'mm', required: true, source: 'Drawing', meaning: 'Thickness of the structural lug plate.', validation: 'Must fit inside standard shackle jaw gap.', commonMistake: 'Plate too thick to fit into standard Crosby / Green Pin shackle jaw.' },
      { name: 'hole_elev', label: 'Hole Center Elevation', symbol: 'H_e', unit: 'mm', required: true, source: 'Drawing', meaning: 'Distance from vessel shell surface to pin hole centerline.', validation: 'Determines bending moment arm on shell.', commonMistake: 'Excessive hole elevation, creating huge cantilever moments on shell.' },
      { name: 'pin_hole_dia', label: 'Pin Hole Diameter', symbol: 'd_h', unit: 'mm', required: true, source: 'Shackle Table', meaning: 'Drilled hole diameter for shackle pin.', validation: 'Hole dia = Pin dia + 2 to 3 mm clearance.', commonMistake: 'Drilling hole undersized so shackle pin cannot pass through.' },
      { name: 'lug_top_rad', label: 'Lug Top Radius', symbol: 'R_top', unit: 'mm', required: true, source: 'Drawing', meaning: 'Crown radius of lug plate centered on hole.', validation: 'Must be > hole diameter.', commonMistake: 'Insufficient radius causing edge distance tear-out failure.' },
      { name: 'lifting_load', label: 'Lifting Load per Lug', symbol: 'P_lift', unit: 'N', required: true, source: 'Rigging Plan', meaning: 'Static hook load assigned to this individual lug.', validation: 'Must account for center-of-gravity offsets.', commonMistake: 'Assuming equal load share when CG is off-center.' },
      { name: 'dyn_impact', label: 'Dynamic Impact Factor', symbol: 'DIF', unit: 'dimensionless', required: true, source: 'Safety Code', meaning: 'Crane hoisting multiplier (default 1.5x per ASME B30.20).', validation: 'Standard: 1.25x to 2.0x.', commonMistake: 'Omitting dynamic factor, using bare static weight.' },
      { name: 'sling_angle', label: 'Sling Angle from Vertical', symbol: 'θ_sling', unit: 'deg', required: true, source: 'Rigging Plan', meaning: 'Angle between rigging sling cable and vertical.', validation: 'Recommended ≤ 45° (never > 60°).', commonMistake: 'Using flat 60° sling angle, doubling the tension force in the sling.' }
    ],

    workedExample: {
      problemStatement: 'Verify a longitudinal lifting lug on a 2000 mm ID × 20 mm thick vessel carrying 100,000 N hook load at 30° sling angle with 1.5x impact factor.',
      givenData: {
        vesselID: '2000 mm',
        vesselThk: '20 mm (SA-516 Gr. 70, Sy = 260 MPa, S = 138 MPa)',
        lugMaterial: 'SA-516 Gr. 70 (Sy = 260 MPa)',
        lugDimensions: 'Base length Lb = 300 mm, thickness t = 25 mm, hole elevation He = 150 mm',
        pinHoleDia: '50 mm (for 45 mm dia 25-ton shackle pin)',
        lugTopRadius: '100 mm',
        staticLoad: '100,000 N (100 kN / ~10 tonnes)',
        dynamicFactor: '1.5x',
        slingAngle: '30° from vertical'
      },
      calculationSteps: [
        '1. Factored Design Load: P_des = 100,000 · 1.5 = 150,000 N (150 kN).',
        '2. Sling Tension Load: P_sling = P_des / cos(30°) = 150,000 / 0.866 = 173,200 N (173.2 kN).',
        '3. Pin Bearing Stress: Projected contact area Abr = d_pin · t_lug = 45 · 25 = 1,125 mm². σ_br = 173,200 / 1,125 = 154 MPa. Allowable 0.9 · Sy = 0.9 · 260 = 234 MPa → PASS (Margin = 34.2%).',
        '4. Shear Tear-Out Stress: Edge distance e = R_top - d_h/2 = 100 - 25 = 75 mm. Tear-out area = 2 · e · t = 2 · 75 · 25 = 3,750 mm². τ = 173,200 / 3,750 = 46.2 MPa. Allowable 0.4 · Sy = 104 MPa → PASS (Margin = 55.6%).',
        '5. Attachment Weld Stress: Fillet weld size w = 12 mm double continuous fillet. Weld shear stress = 62 MPa (Allowable = 110 MPa) → PASS.',
        '6. Local Vessel Shell Stress (WRC 537): Cantilever bending moment on shell M = P_horiz · He = (173,200 · sin 30°) · 150 = 86,600 · 150 = 12,990,000 N·mm (13 kN·m). Maximum combined shell stress intensity = 142 MPa. Allowable 1.5 · S = 207 MPa → PASS.'
      ],
      conclusion: 'PASS. The lifting lug assembly fully complies with ASME B30.20, AISC, and WRC 537 with a governing safety margin of 31.4% under maximum dynamic hoisting loads.'
    },

    verificationChecklist: [
      { id: 'dif_check', label: 'Mandatory Dynamic Impact Factor (minimum 1.5x for mobile crane hoisting) verified applied to dead weight' },
      { id: 'shackle_fit', label: 'Shackle pin diameter, jaw clearance, and shackle bow radius physically matched to lug dimensions' },
      { id: 'tearout_check', label: 'Edge distance from pin hole edge to lug plate top confirmed e ≥ 1.0 × pin hole diameter' },
      { id: 'weld_nde', label: '100% Magnetic Particle Examination (MT) or Dye Penetrant (PT) specified for all lug attachment welds' }
    ],

    faqs: [
      { q: 'Why is a 60-degree sling angle dangerous in rigging?', a: 'Sling tension is governed by $T = \\frac{W}{n \\cdot \\cos\\theta}$. As the angle from vertical $\\theta$ increases, the cosine drops rapidly. At 60°, sling tension doubles ($1/\\cos 60^\\circ = 2.0$), and the lateral inward squeezing force triples, imposing massive bending moments onto lifting lugs and buckling forces onto equipment shells.' }
    ],

    relatedTopics: ['trunnion-analysis', 'nozzle-analysis', 'asme-materials'],
    references: [
      { source: 'ASME B30.20', topic: 'Below-the-Hook Lifting Devices' },
      { source: 'AISC 360-16', topic: 'Specification for Structural Steel Buildings (Pin-Connected Members)' },
      { source: 'WRC Bulletin 537', topic: 'Local Stresses from Attachments' }
    ]
  },

  // ==========================================
  // 10. TRUNNION ANALYSIS
  // ==========================================
  {
    id: 'trunnion-analysis',
    slug: 'trunnion-analysis',
    title: 'Trunnion Analysis: Heavy Vessel Upending & Erection Stresses',
    category: 'Analysis Modules',
    badge: 'Heavy Lifting & Upending',
    discipline: 'Rigging & Heavy Lifting',
    difficulty: 'Advanced',
    type: 'Guide & Reference',
    standard: 'ASME Section VIII Div 2 Part 5 / WRC Bulletin 537 / WRC 297',
    version: 'Nova v2.3',
    readingTime: '18 min',
    lastReviewed: 'October 2026',
    summary: 'Engineering verification of heavy pressure vessel lifting trunnions: cylindrical pipe stubs, reinforcing pads, bail rings, upending angle kinematics, and 8 cardinal point local shell stresses.',
    
    depthContent: {
      beginner: 'Very tall, heavy pressure vessels (like 500-ton refinery towers) are manufactured and shipped lying horizontally on trailers. When erected at the job site, giant cranes lift the top of the vessel while a tailing crane holds the bottom, slowly tilting it upright (upending). Heavy steel pipe stubs welded to the vessel sides—called trunnions—act as pivot axles for the crane rigging. Trunnion analysis calculates whether the trunnion pipe and the vessel shell can hold the hundreds of tons of weight during upending without buckling or denting.',
      engineer: 'Lifting trunnions consist of a heavy-wall cylindrical pipe stub welded perpendicularly to the vessel shell, usually reinforced by an external circular or rectangular pad plate. A bail keeper ring welded at the outer end prevents sling grommets from slipping off. As the vessel rotates from 0° (horizontal) to 90° (vertical), the load direction relative to the trunnion changes from pure transverse bending to axial shear. WRC Bulletins 537 and 297 evaluate local shell membrane and bending stresses at 8 cardinal positions (A, B, C, D on inside and outside shell surfaces) under coincident radial thrust ($P$), longitudinal moment ($M_L$), and circumferential moment ($M_C$).',
      expert: 'In heavy rigging kinematics, the trunnion reaction varies as: $R_{trunnion}(\\phi) = \\frac{W \\cdot (L_{CG} - L_{tail}) \\cdot \\cos\\phi}{2 \\cdot (L_{lift} - L_{tail}) \\cdot \\cos\\phi} + \\frac{W_{top}}{2}$, where $\\phi$ is the upending tilt angle. The trunnion pipe stub behaves as a cantilever beam subjected to bending moment $M = R \\cdot L_{proj}$ and shear $V = R$. Stress concentration factors at the trunnion-to-shell junction are determined from Bijlaard coefficients ($\\beta = 0.875 r_o/R_m$, $\\gamma = R_m/T$). Stresses must satisfy ASME Section VIII Division 2 (Part 5): $P_L \\le 1.5S$, $P_L + P_b \\le 1.5S$.'
    },

    overview: `
For **ultra-heavy vertical pressure vessels** (distillation towers, reactors, and cokers exceeding 100 to 1,000 metric tonnes), plate lifting lugs are inadequate due to high out-of-plane torsional loads during rigging upending. 
**Pipe trunnion supports** provide high section modulus in all radial directions, serving as heavy pivot pins for wire rope grommet slings.

The **Nova Trunnion Analysis Module** models the complete rigging envelope from horizontal lift-off to vertical foundation setting per **WRC Bulletins 537 & 297** and **ASME Section VIII Division 2 Part 5**.
    `,

    purpose: 'To ensure trunnion pipe bending strength, weld integrity, and vessel shell local resistance against plastic collapse during critical equipment upending.',

    parameters: [
      { name: 'shell_id / shell_thk', label: 'Vessel Shell ID & Thickness', symbol: 'D_i, t', unit: 'mm', required: true, source: 'Vessel Drawing', meaning: 'Inside diameter and thickness of vessel shell at trunnion level.', validation: 'Must be positive.', commonMistake: 'Entering radius.' },
      { name: 'trunnion_od', label: 'Trunnion Pipe Outside Diameter', symbol: 'OD_trun', unit: 'mm', required: true, source: 'Pipe Schedule', meaning: 'Outside diameter of trunnion pipe stub.', validation: 'Must be smaller than vessel OD.', commonMistake: 'Using thin-wall standard pipe instead of heavy wall (Sch 160 / XXS).' },
      { name: 'trunnion_thk', label: 'Trunnion Pipe Thickness', symbol: 't_trun', unit: 'mm', required: true, source: 'Pipe Schedule', meaning: 'Wall thickness of trunnion pipe.', validation: 'Must satisfy bending section modulus.', commonMistake: 'Neglecting beam bending stresses in the pipe stub.' },
      { name: 'proj_len', label: 'Projection Length', symbol: 'L_proj', unit: 'mm', required: true, source: 'Rigging Drawing', meaning: 'Distance from vessel outer surface to sling bearing center.', validation: 'Must provide clearance for sling grommets.', commonMistake: 'Making projection unnecessarily long, multiplying bending moments on shell.' },
      { name: 're_pad', label: 'Reinforcing Pad Toggled', symbol: 'Repad', unit: 'select', required: true, source: 'Drawing', meaning: 'Whether a heavy reinforcing pad plate is welded beneath trunnion.', validation: 'True / False.', commonMistake: 'Omitting repad on heavy vessels > 100 tonnes.' },
      { name: 'pad_od / pad_thk', label: 'Pad Dimensions', symbol: 'OD_pad, t_pad', unit: 'mm', required: false, source: 'Drawing', meaning: 'Diameter and plate thickness of circular reinforcing pad.', validation: 'Required if repad is True.', commonMistake: 'Pad thickness thinner than shell thickness.' },
      { name: 'bail_width / ring_od', label: 'Bail Ring Dimensions', symbol: 'W_bail, OD_ring', unit: 'mm', required: true, source: 'Drawing', meaning: 'Width and outer diameter of end keeper ring retaining the sling.', validation: 'Must prevent sling slippage.', commonMistake: 'Keeper ring too small, allowing sling to slide off trunnion tip.' },
      { name: 'lifting_load', label: 'Lifting Load per Trunnion', symbol: 'P_trun', unit: 'N', required: true, source: 'Rigging Plan', meaning: 'Maximum load carried by this individual trunnion during upending.', validation: 'Includes dynamic impact factor (1.5x).', commonMistake: 'Using total vessel weight instead of per-trunnion load.' }
    ],

    workedExample: {
      problemStatement: 'Verify a pair of NPS 12 (323.8 mm OD × 33.3 mm thk) trunnions supporting a 300-tonne vertical tower during upending.',
      givenData: {
        vesselID: '3000 mm (thickness t = 30 mm, SA-516 Gr. 70, S = 138 MPa)',
        trunnionPipe: 'NPS 12 Sch XXS (OD = 323.8 mm, t = 33.3 mm, SA-106 Gr. B, Sy = 240 MPa)',
        projectionLength: 'L_proj = 350 mm',
        repadDimensions: 'OD = 600 mm, thickness = 25 mm (SA-516 Gr. 70)',
        loadPerTrunnion: 'P = 850,000 N (850 kN / ~86.7 tonnes including 1.5x dynamic impact)',
        pullAngle: '30° maximum sling flare angle'
      },
      calculationSteps: [
        '1. Trunnion Cantilever Bending Moment: M = P · L_proj = 850,000 · 350 = 297,500,000 N·mm (297.5 kN·m).',
        '2. Trunnion Pipe Bending Section Modulus: Z = (π/32) · (OD⁴ - ID⁴) / OD = 2,240,000 mm³.',
        '3. Trunnion Pipe Bending Stress: σ_b = M / Z = 297.5e6 / 2.24e6 = 132.8 MPa. Allowable 0.75 · Sy = 0.75 · 240 = 180 MPa → TRUNNION PIPE PASS.',
        '4. WRC 537 Local Shell Stress: With 25 mm repad, effective shell thickness Teff = √(30² + 25²) = 39.0 mm. Beta = 0.875 · (161.9 / 1530) = 0.093. Gamma = 1530 / 39 = 39.2.',
        '5. 8 Cardinal Positions Stress Intensity: Point A inner: 148 MPa. Point A outer: 162 MPa. Point B outer: 171 MPa. Point C/D: 112 MPa.',
        '6. Stress Check: Maximum localized stress intensity = 171 MPa. Allowable 1.5 · S = 1.5 · 138 = 207 MPa. Margin = (207 - 171) / 207 = 17.4% → PASS.'
      ],
      conclusion: 'PASS. The heavy lift trunnion assembly safely sustains the 850 kN upending load with a governing safety margin of 17.4% at the trunnion-to-shell weld junction.'
    },

    verificationChecklist: [
      { id: 'repad_weld', label: 'Full penetration groove weld specified between trunnion pipe and shell with 100% UT inspection' },
      { id: 'keeper_check', label: 'Bail keeper ring outer diameter verified ≥ trunnion OD + 2 × sling rope diameter' },
      { id: 'kinematics_check', label: 'Rigging upending kinematics checked at 0°, 30°, 60°, and 90° tilt angles' },
      { id: 'ovality_check', label: 'Internal vessel temporary spider stiffeners installed if shell D/t > 150 to prevent shell ovalization during lift' }
    ],

    faqs: [
      { q: 'Why are trunnions preferred over lifting lugs for towers exceeding 150 tonnes?', a: 'During upending from horizontal to vertical, the sling cables rotate by 90 degrees around the attachment. Plate lifting lugs experience severe out-of-plane twisting moments that easily buckle flat plates sideways. A circular pipe trunnion possesses uniform polar and bending moments of inertia in every direction, providing safe, symmetric resistance throughout the entire upending arc.' }
    ],

    relatedTopics: ['lug-analysis', 'nozzle-analysis', 'asme-materials'],
    references: [
      { source: 'WRC Bulletin 537', topic: 'Local Stresses in Spherical and Cylindrical Shells' },
      { source: 'WRC Bulletin 297', topic: 'Local Stresses in Cylindrical Shells from External Loadings on Nozzles' },
      { source: 'ASME Section VIII Division 2', topic: 'Part 5: Design-by-Analysis' }
    ]
  }
];
