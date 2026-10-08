// Troubleshooting & Application Error Codes Database
// Verified against Nova Platform web frontend, ANSYS Mechanical ACT solver, and ASME calculation engines

export const ERROR_CODES = [
  {
    code: 'ERR_NOZZLE_GEO_01',
    title: 'Missing or Invalid Nozzle Dimensions',
    module: 'Nozzle Analysis',
    severity: 'Blocking Error',
    cause: 'Nozzle outside diameter (N_OD) is smaller than or equal to the finished bore (N_ID), or neck thickness is less than or equal to zero.',
    resolution: 'Open Geometry → Nozzle Parameters. Ensure N_OD > (N_ID + 2 × Corrosion Allowance) and neck thickness (N_THK) is strictly positive.',
    verification: 'Verify that nozzle bore matches standard pipe schedule dimensions (e.g. ASME B36.10M).'
  },
  {
    code: 'ERR_NOZZLE_LIMIT_02',
    title: 'Nozzle Opening Exceeds Appendix 1-7 Limits',
    module: 'Nozzle Analysis',
    severity: 'Code Violation Warning',
    cause: 'The opening diameter exceeds one-half of the vessel diameter (d > 0.5 × D), or d > 500 mm (20 in) on cylindrical vessels.',
    resolution: 'Standard UG-37 area replacement is not sufficient. In the analysis settings, switch to ASME Section VIII Div 1 Appendix 1-7 (Large Openings) or run Finite Element Analysis (DBA Part 5).',
    verification: 'Check ratio d/D. If d/D > 0.7, a rigorous 3D solid FEA with SCL linearization is mandatory.'
  },
  {
    code: 'ERR_BELLOW_SQUIRM_03',
    title: 'Column Squirm Instability Exceeded',
    module: 'Bellows Analysis',
    severity: 'Structural Failure',
    cause: 'Internal operating pressure exceeds the EJMA Column Squirm limit pressure (P_sc), causing the bellows expansion joint to bow laterally like a buckled Euler column.',
    resolution: 'Reduce the number of convolutions (Nc), install internal sleeve liners with external limit rods, increase bellows wall thickness (tn), or switch to a multi-ply configuration.',
    verification: 'Verify that P_design ≤ P_sc / 2.25 per EJMA Section C criteria.'
  },
  {
    code: 'ERR_FLANGE_RIGIDITY_04',
    title: 'Flange Rigidity Index J > 1.0',
    module: 'Flange Analysis',
    severity: 'Code Failure',
    cause: 'The calculated rigidity index J exceeds 1.0 (or J > 0.2 for full face gaskets), indicating excessive flange ring rotation under bolt make-up.',
    resolution: 'Increase flange thickness (T), enlarge hub small end (g0), or lengthen the tapered hub transition (hL).',
    verification: 'Recalculate Appendix 2 rigidity equations. Check that J ≤ 1.00 for both operating and gasket seating conditions.'
  },
  {
    code: 'ERR_PWHT_GRAD_05',
    title: 'Steep Axial Thermal Gradient in Local PWHT',
    module: 'Local PWHT',
    severity: 'Thermal Stress Risk',
    cause: 'Insulation Band (IB) or Heating Band (HB) width is too narrow, creating severe thermal gradients that induce harmful secondary residual stresses exceeding material yield.',
    resolution: 'Increase the Insulation Band width (IB) to at least 2 × √(R × t) on each side of the weld per WRC Bulletin 452 recommendations.',
    verification: 'Review thermocouple recordings. Ensure the temperature gradient beyond the soak band does not exceed 100°C over 450 mm.'
  },
  {
    code: 'ERR_SADDLE_HORN_06',
    title: 'Excessive Circumferential Bending at Saddle Horn (S3 > Allowable)',
    module: 'Saddle Analysis',
    severity: 'Structural Overstress',
    cause: 'Saddle contact angle (θ) is too small (< 120°), or saddles are located too far from vessel head tangent lines (A > 0.2 × L) without a reinforcing wear plate.',
    resolution: 'Increase saddle wrap angle to 120° or 150°, move saddles closer to heads (A ≤ 0.2 × L to take advantage of head stiffening), or add a welded wear plate with angle θ + 10°.',
    verification: 'Check Zick horn stress equation: S3 ≤ 1.25 × S (or 1.5 × S with wear plate).'
  },
  {
    code: 'ERR_HOTBOX_JUNCT_07',
    title: 'High Thermal Gradient at Skirt-to-Head Crotch',
    module: 'Hot Box Analysis',
    severity: 'Thermal Fatigue Alert',
    cause: 'Insulation support ring is placed too close to the weld junction, or fluid temperature causes extreme temperature divergence between skirt and head.',
    resolution: 'Relocate the insulation support ring further down the skirt (e.g. 500 mm below junction). Increase refractory insulation thickness to smooth out the axial temperature decay profile.',
    verification: 'Check steady-state thermal FEA results. Confirm temperature gradient along the first 300 mm of skirt length does not exceed 0.5°C/mm.'
  },
  {
    code: 'ERR_STIFF_BUCKLE_08',
    title: 'Stiffening Ring Moment of Inertia Below ASME Requirement',
    module: 'Stiffener Analysis',
    severity: 'Buckling Risk',
    cause: 'Available moment of inertia of the ring composite section (Is) is less than the required inertia (Is_req) calculated per ASME UG-29.',
    resolution: 'Increase ring web height, increase flange width/thickness, or decrease ring spacing (Ls) by adding an additional stiffener ring.',
    verification: 'Check Is_available ≥ Is_req. Ensure ring cross-section satisfies local flange buckling width-to-thickness limits.'
  },
  {
    code: 'ERR_TUBESHEET_LIG_09',
    title: 'Ligament Efficiency Below Minimum Code Limit',
    module: 'Tubesheet Analysis',
    severity: 'Geometric Error',
    cause: 'Tube pitch (p) is too close to tube outside diameter (do), resulting in ligament width (p - do) < 0.2 × do or < 3 mm.',
    resolution: 'Increase tube pitch spacing or reduce tube outer diameter. In drilling fabrication, verify minimum ligament tolerance after tube hole reaming.',
    verification: 'Check ligament efficiency μ = (p - do) / p. Ensure μ is sufficient to provide required bending stiffness in equivalent solid plate analysis.'
  },
  {
    code: 'ERR_LUG_TEAROUT_10',
    title: 'Lifting Lug Pin Hole Tear-Out / Shear Failure',
    module: 'Lug Analysis',
    severity: 'Safety Critical',
    cause: 'Edge distance from pin hole center to lug plate top boundary is too small for the applied sling tension load.',
    resolution: 'Increase Lug Top Radius (lug_top_rad) so that edge distance e ≥ 1.5 × pin_hole_dia, or increase Lug Thickness (lug_thk).',
    verification: 'Verify shear tear-out stress τ = P_sling / (2 × (e - dh/2) × t) ≤ 0.4 × Sy per AISC / ASME B30.20.'
  },
  {
    code: 'ERR_TRUNNION_MOMENT_11',
    title: 'Excessive Local Shell Stress Intensity at Trunnion Base',
    module: 'Trunnion Analysis',
    severity: 'FEA Stress Overlimit',
    cause: 'Heavy bending moment induced during vertical upending exceeds shell local allowable stress at the 8 cardinal points.',
    resolution: 'Add a full encircling reinforcing pad or heavy rectangular repad beneath the trunnion stub. Increase trunnion OD to spread load over a larger shell footprint.',
    verification: 'Verify combined primary local membrane plus secondary bending stress (PL + Pb) ≤ 1.5 × S per ASME Section VIII Div 2 Part 5.'
  },
  {
    code: 'ERR_ACT_WBEX_12',
    title: 'Ansys ACT Extension Fails to Load in Mechanical',
    module: 'Ansys ACT Wizard',
    severity: 'Integration Failure',
    cause: 'WBEX extension version incompatibility with ANSYS Workbench release (e.g. running 2023R2 script on 2025R1), or extension not checked in Extension Manager.',
    resolution: 'Open ANSYS Workbench → Extensions → Manage Extensions. Ensure checkmark is enabled. Verify IronPython script execution permissions in Workbench settings.',
    verification: 'Check ACT Console inside ANSYS Mechanical for traceback errors.'
  }
];

export const TROUBLESHOOTING_MATRIX = [
  {
    category: 'Input & Geometry Errors',
    problem: 'Negative wall thickness calculated in nozzle or shell results',
    cause: 'Design pressure or corrosion allowance exceeds material allowable stress (P > S·E).',
    solution: 'Verify design pressure units (e.g. entered 200 bar instead of 2.0 MPa). Check joint efficiency (E) and corrosion allowance values.',
    verification: 'Check that S·E - 0.6·P remains positive in UG-27 denominator.'
  },
  {
    category: 'Input & Geometry Errors',
    problem: 'Mesh generation failure at nozzle crotch radius',
    cause: 'Fillet weld or transition radius is too sharp relative to global body mesh sizing.',
    solution: 'Reduce local junction refinement size (e.g. 5 mm) or adjust transition blend radius in SpaceClaim/DesignModeler.',
    verification: 'Preview mesh before solving. Check skewness < 0.85 and orthogonal quality > 0.20.'
  },
  {
    category: 'Material & Property Errors',
    problem: 'Allowable stress displays as "0" or "Out of Range"',
    cause: 'Design temperature exceeds maximum temperature limit defined in ASME Section II-D Table 1A.',
    solution: 'Review material specification. Carbon steels (e.g. SA-516 Gr. 70) are limited to 538°C (1000°F). For higher temperatures, select chrome-moly or austenitic stainless steels.',
    verification: 'Check ASME Section II-D Table 1A temperature cut-off curve for the selected specification.'
  },
  {
    category: 'Material & Property Errors',
    problem: 'Elastic-plastic FEA fails to converge beyond yield point',
    cause: 'True stress-strain curve has negative slope (strain softening) or missing ultimate tensile stress data.',
    solution: 'Regenerate true stress-strain curve using Annex 3-D monotonic model. Ensure plastic strain hardening slope (Et) is non-negative.',
    verification: 'Plot tangent modulus versus true plastic strain; ensure smooth asymptotic behavior toward ultimate strength.'
  },
  {
    category: 'Units & Conversion Pitfalls',
    problem: 'Calculated stress is 1,000 times higher or lower than expected',
    cause: 'Unit inconsistency: Mixing Elastic Modulus in GPa with geometry in mm and loads in N.',
    solution: 'Use consistent FEA units: Length in mm, Force in N, Modulus in MPa (N/mm²), Pressure in MPa.',
    verification: '1 GPa = 1,000 MPa = 1,000 N/mm². Always input E = 200,000 MPa, never 200.'
  },
  {
    category: 'Solver Convergence Issues',
    problem: 'Contact penetration or chattering at flange gasket interface',
    cause: 'Normal contact stiffness factor (FKN) too low, or bolt pretension applied in a single abrupt substep.',
    solution: 'Enable auto contact stiffness adjustment. Ramp bolt pretension load over at least 5 substeps in load step 1 before introducing internal pressure.',
    verification: 'Check contact status tool: Verify "Closed" with penetration < 0.01 mm.'
  },
  {
    category: 'Solver Convergence Issues',
    problem: 'Non-linear geometry (NLGEOM) divergence in bellows deflection',
    cause: 'Large lateral offset creates high local rotation causing convolution geometric collapse.',
    solution: 'Turn on Large Deflection (NLGEOM, ON). Use Arc-Length method or reduce initial substep size to 0.01.',
    verification: 'Inspect force-deflection reaction curves for smooth continuity without negative eigenvalues.'
  },
  {
    category: 'Report & Export Errors',
    problem: 'PDF report generation hangs or cuts off diagrams',
    cause: 'Browser hardware acceleration conflict or canvas resolution exceeding memory limits.',
    solution: 'Reduce diagram DPI scale to 2x. Ensure browser print layout background graphics are enabled.',
    verification: 'Open generated PDF; verify all parameter tables, pass/fail badges, and stress plots are visible.'
  },
  {
    category: 'Ansys ACT Integration',
    problem: 'Custom toolbar icon does not appear in SpaceClaim / Mechanical',
    cause: 'Extension installed in user folder with restricted permissions or XML path syntax error.',
    solution: 'Right-click Workbench → Run as Administrator. Install extension globally to %APPDATA%\\Ansys\\v252\\ACT\\extensions.',
    verification: 'Launch ACT Console; type `ExtAPI.ExtensionManager.GetExtensions()` to confirm loaded status.'
  }
];
