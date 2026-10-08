/**
 * NOVA ENGINEERING DOCUMENTATION - REFERENCE & COMPLIANCE ARTICLES
 * 
 * Authoritative coverage for:
 * 1. Results & Engineering Report Generation (Stress categorization, Utilization, PDF export)
 * 2. Engineering Validation & Verification (V&V, ASME Section VIII benchmarks, mesh sensitivity)
 * 3. Standards Directory & Governing Codes (ASME, EJMA, WRC, API, TEMA, EN)
 * 4. Platform Release Notes & Version History (v2.4.0 to v2.0.0)
 * 5. Technical Support & Engineering Inquiry Protocol
 */

export const REFERENCE_ARTICLES = [
  {
    id: 'results-reports',
    slug: 'results-reports',
    title: 'Results Interpretation & Engineering Reports',
    category: 'Results',
    module: 'Reporting Engine',
    difficulty: 'Intermediate',
    discipline: 'General / QA',
    applicableStandards: ['ASME BPVC Section VIII Div 1 & 2', 'ASME Section VIII Div 2 Part 5 (Design by Analysis)'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '15 min',
    summary: 'Guidelines for interpreting primary membrane, local membrane, bending, and peak stresses; evaluating allowable stress margins and utilization ratios; and exporting professional PE-stamped engineering calculation reports.',
    tags: ['results', 'reports', 'utilization-ratio', 'stress-categorization', 'asme-margins', 'pdf-export', 'audit-trail'],

    technicalDepth: {
      beginner: 'Understand what the numbers and colors mean in Nova calculation outputs. Green indicates stresses fall within code allowables; yellow warns that utilization exceeds 90%; red indicates an overstressed condition. Learn how to export clean calculation packages for clients and regulatory inspectors.',
      engineer: 'Covers stress classification per ASME VIII-2 Part 5: General Primary Membrane ($P_m \\le S$), Local Primary Membrane ($P_L \\le 1.5S$), Primary Membrane plus Bending ($P_L + P_b \\le 1.5S$), and Total Primary plus Secondary ($P_L + P_b + Q \\le 3.0S$). Details calculation of Margin of Safety ($MS = \\frac{1}{UR} - 1$) and Utilization Ratio ($UR$).',
      expert: 'Addresses multi-axial stress invariants, von Mises equivalent stress vs. Tresca maximum shear stress theory, linearization across finite element paths (Stress Linearization on Classification Lines / SCL), 3S shakedown limit for cyclic thermal ratcheting, and cryptographic PDF timestamping for QA compliance under ASME NQA-1 / ISO 9001.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. Result Status & Stress Classification Overview',
        content: `Engineering analysis results in Nova are never presented as simple "Pass" or "Fail" values without mechanical context. Every calculation evaluates the computed stress state against the governing **Allowable Stress Limit** ($S_{allow}$) established by the referenced design code:

* **Utilization Ratio ($UR$):**
  $$UR = \\frac{\\sigma_{calculated}}{S_{allow}}$$

* **Margin of Safety ($MS$):**
  $$MS = \\frac{S_{allow}}{\\sigma_{calculated}} - 1 = \\frac{1}{UR} - 1$$

A condition is verified as **Code Compliant** when $UR \\le 1.00$ ($MS \\ge 0.00$).`
      },
      {
        id: 'stress-categories',
        title: '2. ASME Section VIII-2 Stress Intensity Limits',
        content: `When analyzing shell discontinuities, nozzles, lugs, or trunnions, computed stresses are partitioned into structural categories:

| Category | Description | Allowable Limit | Mechanical Meaning |
| :--- | :--- | :--- | :--- |
| **$P_m$** | General Primary Membrane Stress | $S$ | Average stress across solid section caused by internal pressure or mechanical weight. Exceeding this causes gross plastic collapse. |
| **$P_L$** | Local Primary Membrane Stress | $1.5S$ | Membrane stress in localized discontinuity (e.g., nozzle neck/shell junction) that redistributes to adjacent vessel shell. |
| **$P_b$** | Primary Bending Stress | $1.5S$ | Variable linear stress across section caused by external moments or self-weight bending without redistribution. |
| **$P_L + P_b$** | Combined Primary Stress | $1.5S$ | Combined membrane plus bending primary load intensity. |
| **$P_L + P_b + Q$** | Primary plus Secondary Stress | $3.0S$ | Includes self-equilibrating stresses (thermal gradients, local structural gross discontinuity bending). Governed by shakedown limit ($3S = 2S_y$). |
| **$F$** | Peak Stress | Governed by Fatigue Curve | Local notch concentrations, weld toe stress raisers, thermal shock surface stresses. Evaluated for cyclic fatigue life under Annex 3-F.`
      },
      {
        id: 'status-indicators',
        title: '3. Status Indicators & Color Coding Convention',
        content: `Nova applies strict industrial status coding:
* **COMPLIANT ($UR \\le 0.90$):** Green banner. Stresses comfortably within allowable design envelope.
* **WARNING ($0.90 < UR \\le 1.00$):** Yellow/Amber banner. Margins are slim ($< 10\\%$ reserve margin). Recommend reviewing thermal expansion loops or external nozzle piping loads.
* **NON-COMPLIANT ($UR > 1.00$):** Red banner. Calculated stress exceeds allowable code limit. Detailed failure mode flagged (e.g., *Governed by longitudinal compressive shell buckling at saddle horn*).
* **GEOMETRY / INPUT FAULT:** Purple banner. Incompatible geometrical constraints (e.g., nozzle outside diameter exceeds shell diameter).`
      },
      {
        id: 'report-generation',
        title: '4. Professional Engineering Report Export',
        content: `Every analysis provides instant export to:
1. **Certified PDF Calculation Dossier:** Includes executive summary, complete input tables, material specification certificates, 2D vector schematic diagrams, governing code references, stress utilization summary tables, and formal signature/review stamp blocks.
2. **ANSYS Mechanical APDL / Python Script:** Automated script generation to recreate the exact geometry, meshing parameters, and load steps in ANSYS Workbench for 3D FEA verification.
3. **JSON / CSV Data Package:** Complete machine-readable data tree for integration into client PLM or ERP document management systems.`
      }
    ],

    parameters: [
      {
        name: 'Project Name',
        symbol: 'Proj_Name',
        unit: 'Text',
        type: 'String',
        required: true,
        meaning: 'Client or plant identifier appearing in calculation dossier header',
        validation: 'Max 120 characters'
      },
      {
        name: 'Equipment Tag Number',
        symbol: 'Tag_No',
        unit: 'Text',
        type: 'String',
        required: true,
        meaning: 'Plant item equipment tag (e.g., V-101, E-204, C-302)',
        validation: 'Alphanumeric identifier'
      },
      {
        name: 'Prepared By / Engineer',
        symbol: 'Prep_By',
        unit: 'Text',
        type: 'String',
        required: true,
        meaning: 'Responsible calculation author name',
        validation: 'Text string'
      },
      {
        name: 'Checked By / PE Reviewer',
        symbol: 'Chk_By',
        unit: 'Text',
        type: 'String',
        required: false,
        meaning: 'Senior technical checker or Professional Engineer',
        validation: 'Text string'
      }
    ],

    commonMistakes: [
      'Accepting a result simply because the color is green, without verifying whether all external nozzle loads (shears and moments) were included in the calculation.',
      'Treating secondary thermal stresses ($Q$) with the same strict limit as primary membrane stresses ($S$), causing vessel walls to be needlessly over-thickened.',
      'Failing to verify whether the design temperature used matches the maximum coincident temperature during the governing pressure event.'
    ],

    faqs: [
      {
        q: 'Can Nova calculation reports be submitted directly to ASME Authorized Inspectors (AI)?',
        a: 'Yes. Nova reports are structured with the exact input tables, code clause citations, and mathematical formulas required by ASME Section VIII Authorized Inspection Agencies.'
      },
      {
        q: 'What is the Shakedown Limit ($3S$)?',
        a: 'The $3S$ limit ensures that after initial yielding during the first operating cycle, residual stresses develop such that all subsequent thermal-pressure cycles operate entirely in the elastic regime, preventing low-cycle progressive ratcheting.'
      }
    ],

    references: [
      { source: 'ASME', title: 'ASME BPVC Section VIII, Division 2, Part 5: Design by Analysis Requirements', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'WRC', title: 'WRC Bulletin 429: 3D Stress Criteria Guidelines for Applications', edition: 'WRC', link: 'https://www.forengineers.org' }
    ]
  },

  {
    id: 'engineering-validation',
    slug: 'engineering-validation',
    title: 'Verification & Validation (V&V) Guide',
    category: 'Validation',
    module: 'Quality Assurance',
    difficulty: 'Advanced',
    discipline: 'General / FEA',
    applicableStandards: ['ASME V&V 10 / V&V 20', 'ASME BPVC Section VIII Div 1 & 2', 'NQA-1 Quality Assurance'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '18 min',
    summary: 'Comprehensive methodology for software verification and engineering validation against closed-form theoretical solutions, empirical test data, WRC benchmarks, and 3D FEA convergence studies.',
    tags: ['validation', 'verification', 'qa', 'v-and-v', 'benchmarks', 'mesh-convergence', 'nqa-1'],

    technicalDepth: {
      beginner: 'How do you know Nova calculations are correct? This section explains how our engineering equations are rigorously checked against classic textbook formulas, official ASME examples, and independent finite element simulations before being deployed.',
      engineer: 'Follows ASME V&V 10 ("Standard for Verification and Validation in Computational Solid Mechanics"). Distinguishes Code Verification (confirming algorithms solve mathematical models correctly) from Calculation Verification (quantifying discretization errors) and Model Validation (comparing computational predictions with physical test specimens).',
      expert: 'Details rigorous verification test suites: Roark\'s Formulas for Stress and Strain closed-form solutions, WRC 107/537/297 tabular benchmarks, ASME Section VIII-2 Part 5 non-linear plastic collapse benchmark problems, Richardson extrapolation for Grid Convergence Index (GCI), and regression testing pipelines integrated into CI/CD.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. V&V Philosophy & Code Standards',
        content: `Pressure vessel design is life-critical engineering. The Nova Platform adheres to the verification and validation protocols defined in **ASME V&V 10 ("Standard for Verification and Validation in Computational Solid Mechanics")** and **ASME NQA-1 ("Quality Assurance Requirements for Nuclear Facility Applications")**.

Verification answers: *"Did we solve the engineering equations correctly?"*
Validation answers: *"Do the equations represent the physical pressure vessel accurately?"*`
      },
      {
        id: 'benchmark-suites',
        title: '2. Standard Benchmark Suites',
        content: `Every calculation module in Nova is subjected to continuous automated regression testing across standard test cases:

1. **Nozzle Local Stresses:**
   * Benchmarked against WRC Bulletin 107 numerical tables and WRC 537 non-dimensional shell stress parameters ($\beta, \gamma$).
   * Compared against 3D solid finite element models meshed with 20-node quadratic hexahedral elements (SOLID186 in ANSYS).

2. **Bellows Convolutions:**
   * Verified against EJMA Standards 11th Edition worked benchmark examples (Sections C-3 and C-4).
   * Spring rate, squirm pressure, and fatigue cycle benchmarks match physical testing within $\pm 3.2\\%$.

3. **Flange Bolting & Gaskets:**
   * Taylor-Forge / ASME Section VIII Div 1 Appendix 2 worked examples cross-checked with ASME PTB-4 (Section VIII-1 Example Design Manual).

4. **Saddle Supports:**
   * L.P. Zick original experimental strain gauge data (1951) and British Standard BS 5500 / PD 5500 Annex G formulations.`
      },
      {
        id: 'mesh-convergence',
        title: '3. Numerical FEA & Mesh Convergence Standards',
        content: `For modules utilizing numerical discretization or ACT FEA wizards, stress results must satisfy the **Grid Convergence Index (GCI)** per Roache:

$$GCI_{fine} = \\frac{1.25 \\cdot |e_a|}{r^p - 1}$$

Where:
* $r$ = Grid refinement ratio ($h_{coarse} / h_{fine} \\ge 1.3$)
* $p$ = Formal order of accuracy
* $e_a$ = Relative error between successive mesh densities

A mesh is deemed converged only when peak stresses in the structural classification plane vary by less than $2.5\\%$ upon subsequent element refinement.`
      }
    ],

    parameters: [],
    commonMistakes: [
      'Assuming that a visually appealing FEA colored stress contour plot guarantees mathematical accuracy without performing mesh convergence checks.',
      'Comparing thin-shell theory calculations against heavy-wall geometries where thick-wall Lame hoop stress distributions govern.',
      'Using experimental test data that did not account for residual welding stresses when validating elastic calculations.'
    ],

    faqs: [
      {
        q: 'Are Nova calculation modules verified by external Third-Party PE firms?',
        a: 'Yes. Major analytical routines are independently reviewed and benchmarked against commercial FEA codes (ANSYS Mechanical, Abaqus) and certified pressure vessel packages (COMPRESS, PV Elite).'
      },
      {
        q: 'How frequently are regression tests executed?',
        a: 'Automated test suites run on every code build to verify that allowable stress interpolations, mathematical functions, and unit conversions remain identical to certified benchmark outputs.'
      }
    ],

    references: [
      { source: 'ASME', title: 'ASME V&V 10: Standard for Verification and Validation in Computational Solid Mechanics', edition: 'ASME', link: 'https://www.asme.org' },
      { source: 'ASME', title: 'ASME PTB-4: ASME Section VIII-Division 1 Example Design Manual', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'WRC', title: 'WRC Bulletin 537: Precision Stress Analysis of Cylindrical Pressure Vessels', edition: 'WRC', link: 'https://www.forengineers.org' }
    ]
  },

  {
    id: 'standards-references',
    slug: 'standards-references',
    title: 'Governing Standards & Technical References',
    category: 'Standards',
    module: 'Regulatory Framework',
    difficulty: 'Intermediate',
    discipline: 'General / Standards',
    applicableStandards: ['ASME BPVC', 'EJMA', 'WRC', 'API', 'TEMA', 'EN 13445'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '14 min',
    summary: 'Master directory of international engineering codes, technical society standards, design bulletins, and regulatory references governing Nova analytical modules.',
    tags: ['standards', 'asme', 'ejma', 'wrc', 'api', 'tema', 'astm', 'en-13445', 'iso'],

    technicalDepth: {
      beginner: 'A clear guide to the major engineering codes referenced throughout the platform. Learn which standard governs nozzles (WRC/ASME), bellows (EJMA), flanges (B16.5), heat exchangers (TEMA), and materials (ASME II-D).',
      engineer: 'Detailed scope, edition applicability, and technical authority index for ASME BPVC Sections II, VIII Div 1, VIII Div 2, B16.5, B16.47, EJMA 11th Edition, WRC 107/297/537, API 579-1, and TEMA 10th Edition.',
      expert: 'Comparative analysis of safety margins between ASME VIII-1 (Design by Rule), ASME VIII-2 (Design by Analysis), European Standard EN 13445-3, and British Standard PD 5500. Explains jurisdictional code adoption, National Board registration, and standard revision tracking.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. Master Standards Authority Matrix',
        content: `The following international engineering standards provide the technical foundation for the Nova Platform:

| Standard Designation | Organization | Title / Scope | Implemented in Nova Modules |
| :--- | :--- | :--- | :--- |
| **ASME BPVC Section VIII Div 1** | ASME | Rules for Construction of Pressure Vessels | Nozzle reinforcement (UG-37), Flanges (App 2), Stiffeners (UG-29), Lugs & Supports |
| **ASME BPVC Section VIII Div 2** | ASME | Pressure Vessels: Alternative Rules (Design by Analysis) | Stress categorization, Annex 3-D Stress-Strain curves, Plastic collapse, Local PWHT |
| **ASME BPVC Section II Part D** | ASME | Materials: Properties (Metric & Customary) | Material selection, temperature allowable stresses ($S$), yield & tensile limits |
| **ASME B16.5 / B16.47** | ASME | Pipe Flanges and Flanged Fittings (NPS 1/2 through NPS 60) | Flange ratings, bolt circle dimensions, gasket facings, blind flange design |
| **EJMA Standards (11th Ed)** | EJMA | Standards of the Expansion Joint Manufacturers Association | Bellows convolution stresses, spring rates, fatigue life, squirm stability |
| **WRC Bulletin 537 / 107** | WRC | Local Stresses in Spherical and Cylindrical Shells due to External Loadings | Nozzle local stresses ($P_L + P_b$), Trunnion supports, local shell bending |
| **WRC Bulletin 297** | WRC | Local Stresses in Cylindrical Shells due to External Loadings on Nozzles | High $d/D$ nozzle flexibility factors and local shell boundary evaluations |
| **API 579-1 / ASME FFS-1** | API / ASME | Fitness-For-Service (Part 5 Plastic Collapse, Part 10 Creep) | Omega creep damage parameters, isochronous curves, remaining life |
| **TEMA Standards (10th Ed)** | TEMA | Standards of the Tubular Exchanger Manufacturers Association | Tubesheet ligament efficiency, tube pitch, floating head & fixed tubesheet rules |
| **AWS D1.1 / ASME IX** | AWS / ASME | Structural Welding Code / Welding Qualifications | Weld stress evaluations, throat thicknesses, allowable shear stresses |`
      },
      {
        id: 'revision-management',
        title: '2. Code Edition & Revision Tracking',
        content: `Engineering codes are published on strict revision cycles (e.g., ASME publishes new editions every two years in July, mandatory six months later on January 1).

In Nova, each calculation project records:
* **Governing Code Edition:** Explicitly selected in Project Settings (e.g., *2023 ASME BPVC* or *2021 ASME BPVC*).
* **Material Data Revision:** Locked to the coincident Section II-D addenda to prevent retroactive recalculation shifts.
* **Audit Trail:** Calculation reports permanently embed the code edition, ensuring legal validity during plant lifecycle inspections.`
      }
    ],

    parameters: [],
    commonMistakes: [
      'Applying ASME Section VIII Division 2 allowable stresses to an ASME Division 1 vessel without performing the required Division 2 User\'s Design Specification (UDS) and PE certification.',
      'Mixing metric (SI) and customary formulas from different standard editions where non-dimensional coefficients differ.',
      'Assuming API 650 (Atmospheric Storage Tanks) rules apply to ASME Section VIII pressure vessels operating above 15 psig.'
    ],

    faqs: [
      {
        q: 'Which edition of the ASME BPVC is currently implemented?',
        a: 'Nova is updated to the latest 2023 Edition of the ASME Boiler and Pressure Vessel Code, while maintaining backwards compatibility with 2021, 2019, and 2017 editions.'
      },
      {
        q: 'Can Nova be used for European CE / PED pressure vessels?',
        a: 'Yes. ASME Section VIII Division 1 and Division 2 are widely accepted under the European Pressure Equipment Directive (PED 2014/68/EU) via Particular Material Appraisals (PMA) and Essential Safety Requirements (ESR) compliance.'
      }
    ],

    references: [
      { source: 'ASME', title: 'ASME BPVC Codes & Standards Catalog', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'EJMA', title: 'EJMA Standards 11th Edition', edition: '11th Edition', link: 'https://www.ejma.org' },
      { source: 'TEMA', title: 'Standards of the Tubular Exchanger Manufacturers Association', edition: '10th Edition', link: 'https://www.tema.org' }
    ]
  },

  {
    id: 'release-notes',
    slug: 'release-notes',
    title: 'Platform Release Notes & Version History',
    category: 'General',
    module: 'Release History',
    difficulty: 'Beginner',
    discipline: 'General / Software',
    applicableStandards: ['ISO 9001 Software Quality Assurance'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '10 min',
    summary: 'Chronological changelog, newly validated engineering calculation modules, ANSYS ACT extension updates, database enhancements, and bug resolutions.',
    tags: ['release-notes', 'changelog', 'versioning', 'updates', 'features'],

    technicalDepth: {
      beginner: 'Review the latest updates, newly added analysis tools, and software enhancements across the Nova Engineering Platform.',
      engineer: 'Tracks engineering formulation updates, newly supported material grades in ASME Section II-D, ANSYS ACT extension releases, and numerical stability fixes.',
      expert: 'Detailed verification delta logs, algorithm modifications, precision refinements, and regression suite pass/fail metrics.'
    },

    sections: [
      {
        id: 'v240',
        title: 'Version 2.4.0 (Current Release - October 2025)',
        content: `* **NEW:** Unified Engineering Help & Documentation Platform launched with interactive diagrams, parameter explorers, unit converter, and command palette (\`Ctrl+K\`).
* **ENHANCEMENT:** Upgraded Stress-Strain Curve Generator to full ASME Section VIII-2 Annex 3-D modified Ramberg-Osgood formulation with Project Omega high-temperature creep isochronous curves.
* **ENHANCEMENT:** Hot Box Analysis verified for vertical skirt-to-bottom-head support junctions with mineral wool refractory temperature gradient solutions.
* **NEW:** One-click ANSYS ACT export for Multilinear Isotropic (MISO) and Kinematic (KINH) plastic hardening material cards.
* **FIX:** Resolved metric-to-customary rounding discrepancy in saddle horn circumferential bending stress evaluations.`
      },
      {
        id: 'v230',
        title: 'Version 2.3.0 (August 2025)',
        content: `* **NEW:** CAD AI generative assistant with parametric prompt-to-STEP solid geometry generation.
* **NEW:** Local PWHT temperature gradient validator based on ASME VIII-1 UW-40 soak band and heated band thermal modeling.
* **ENHANCEMENT:** Added over 600 stainless steel and nickel alloy specifications to the ASME Section II-D material catalog.
* **NEW:** Tubesheet Analysis module supporting fixed tubesheet configurations and TEMA ligament efficiency.`
      },
      {
        id: 'v220',
        title: 'Version 2.2.0 (May 2025)',
        content: `* **NEW:** Full_Nozzle.wbex and Shell_Nozzle.wbex ACT Wizards for automated ANSYS Mechanical Workbench workflows.
* **NEW:** Trunnion Analysis module with 3D coordinate system load vectors ($F_x, F_y, F_z, M_x, M_y, M_z$).
* **NEW:** Lifting Lug module with pin tear-out, weld shear, and net section tensile evaluation.`
      },
      {
        id: 'v200',
        title: 'Version 2.0.0 (January 2025)',
        content: `* **MAJOR:** Platform overhaul introducing glassmorphic high-performance user interface.
* **CORE MODULES:** Launched Nozzle, Bellows, Flange, Saddle, and Stiffener analysis engines with real-time browser calculation loops.`
      }
    ],

    parameters: [],
    commonMistakes: [],
    faqs: [
      {
        q: 'How do I know which version of Nova was used to generate an earlier calculation?',
        a: 'Every exported PDF calculation report embeds the exact software version, git commit hash, and engine build timestamp in the document metadata footer.'
      }
    ],

    references: [
      { source: 'Nova Engineering', title: 'Software Quality Assurance & Release Governance Plan', edition: 'Internal QA', link: '#' }
    ]
  },

  {
    id: 'contact-support',
    slug: 'contact-support',
    title: 'Technical Support & Engineering Inquiries',
    category: 'Support',
    module: 'Support Center',
    difficulty: 'Beginner',
    discipline: 'General / Support',
    applicableStandards: ['ISO 9001 Customer Service Standards'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '6 min',
    summary: 'Guidelines for submitting engineering technical support requests, reporting potential calculation anomalies, requesting new material grades, or consulting with our pressure equipment specialists.',
    tags: ['support', 'contact', 'help', 'bug-report', 'engineering-inquiry'],

    technicalDepth: {
      beginner: 'Need help with an analysis or encounter an error? Here is how to contact our engineering team directly and what information to provide.',
      engineer: 'Instructions for generating sanitized calculation diagnostics packages, anonymizing client proprietary geometry, and submitting technical review tickets.',
      expert: 'Formal procedure for reporting potential mathematical discrepancies, requesting code interpretation reviews with our PE advisory committee, and contributing validation benchmark cases.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. Support Channels & Scope',
        content: `Our engineering support team consists of licensed Professional Engineers (PE) and software documentation specialists available to assist with:

* **Software Guidance:** Assistance with navigation, input parameters, ACT extension loading, or unit conversions.
* **Calculation Inquiries:** Clarifications regarding formula implementation, governing code clauses, or warning messages.
* **Bug Reports:** Rapid triage of software exceptions or visual rendering anomalies.

*Note:* Technical support does not replace the legal responsibility of your project's Engineer of Record.`
      },
      {
        id: 'submitting-ticket',
        title: '2. Required Information for Rapid Resolution',
        content: `To ensure quick diagnosis without unnecessary back-and-forth, please include:
1. **Module Name:** (e.g., Nozzle Analysis, Saddle Analysis).
2. **Software Version:** Found in the user profile or documentation header (e.g., v2.4.0).
3. **Error Code:** If an error appeared (e.g., \`ERR_NOZZLE_LIMIT_02\`).
4. **Input Dataset:** Export the calculation to JSON or take a screenshot of your parameter inputs.
5. **Observed vs. Expected Behavior:** Specific technical description of the question or anomaly.`
      }
    ],

    parameters: [],
    commonMistakes: [
      'Sending proprietary client CAD models or confidential project drawings without anonymization.',
      'Reporting "the calculation failed" without specifying the input dimensions, material, or error message.'
    ],

    faqs: [
      {
        q: 'What is the typical response time for engineering support?',
        a: 'Standard support inquiries are addressed within 24 business hours. Critical calculation anomaly reports receive priority triage within 4 hours.'
      }
    ],

    references: [
      { source: 'Nova Platform', title: 'Support Portal & Knowledge Center', edition: 'v2.4.0', link: 'mailto:support@novaplatform.engineering' }
    ]
  }
];
