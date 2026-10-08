// Getting Started & Platform Foundation Articles

export const GETTING_STARTED_ARTICLES = [
  {
    id: 'getting-started',
    slug: 'getting-started',
    title: 'Getting Started: The Nova Engineering Platform',
    category: 'Getting Started',
    badge: 'Platform Introduction',
    discipline: 'Pressure Vessel & Mechanical',
    difficulty: 'Beginner',
    type: 'Guide',
    standard: 'ASME / EJMA / WRC',
    version: 'Nova v2.4',
    readingTime: '12 min',
    lastReviewed: 'October 2026',
    summary: 'Master the core architecture, cloud solving pipeline, 10-step engineering analysis workflow, and verification principles of the Nova Platform.',
    
    // 3 Technical Depth Views
    depthContent: {
      beginner: 'The Nova Platform is a web-based engineering environment designed for pressure vessel, piping, and heat exchanger engineers. Instead of manually writing finite element scripts or solving complex empirical equations by hand, Nova provides dedicated modules (Nozzles, Bellows, Flanges, Saddles, Tubesheets, PWHT, Lugs, Trunnions, and Materials) with verified parametric input fields and automated cloud-based FEA solvers.',
      engineer: 'Nova integrates ASME Boiler & Pressure Vessel Code (Section VIII Divisions 1 & 2), EJMA 11th Edition, and WRC Bulletins (107, 537, 297, 452) into structured browser input screens. When you submit a job, the geometry, material properties from ASME Section II-D, and boundary conditions are mapped into ANSYS Mechanical ACT scripts, executing automated hex-dominant meshing, non-linear contact, and stress linearization along Stress Classification Lines (SCL).',
      expert: 'Nova implements a decoupled microservices architecture: a React 19 frontend captures validated engineering parameters; an orchestration layer checks token credits and provisions dedicated GPU/CPU compute nodes running headless ANSYS Mechanical sessions via the ANSYS Customization Toolkit (.WBEX). Stress tensors are extracted at Gaussian integration points, linearized across wall thicknesses per ASME VIII-2 Annex 5-A, and returned with complete safety margins against plastic collapse, local failure, and cyclic fatigue.'
    },

    overview: `
The **Nova Platform** is a professional engineering software ecosystem created specifically for mechanical, piping, and pressure vessel engineers. It bridges the gap between traditional closed-form Design-by-Rule (DBR) calculations and computationally intensive 3D Finite Element Analysis Design-by-Analysis (DBA).

Every engineering calculation in Nova is grounded in verified authoritative standards—including **ASME BPVC Section VIII**, **ASME Section II Part D**, **EJMA 11th Edition**, **TEMA 10th Edition**, and **Welding Research Council (WRC) Bulletins**.
    `,

    purpose: 'To provide rapid, verified, and repeatable engineering design, local stress evaluation, and compliance reporting for pressure equipment components without manual FEA preprocessing overhead.',

    whyRequired: `
In heavy process industries (refineries, petrochemical plants, power generation, nuclear facilities, and chemical manufacturing), pressure equipment operates under extreme temperatures, corrosive fluids, and high cyclic pressures. 
Catastrophic failure of a pressure vessel nozzle, expansion joint bellows, or support saddle can cause hazardous loss of containment, massive capital damage, and human casualties. 

Traditional spreadsheet calculations often oversimplify localized 3D stress concentrations, while generic FEA packages require hours of tedious CAD defeaturing, manual hexahedral slicing, contact pairing, and post-processing stress linearization. Nova automates these multi-hour workflows into 5-minute verified pipelines.
    `,

    tenStepWorkflow: [
      { step: 1, title: 'Create Project / Select Scope', desc: 'Define your vessel project designation, customer tags, and design conditions.' },
      { step: 2, title: 'Select Engineering Module', desc: 'Choose from Nozzle, Bellows, Flange, Saddle, Tubesheet, Stiffener, Hot Box, PWHT, Lug, or Trunnion.' },
      { step: 3, title: 'Define Units System', desc: 'Choose standard FEA Metric (mm, MPa, N, °C) or US Customary (in, psi, lbf, °F). Ensure dimensional consistency.' },
      { step: 4, title: 'Input Component Geometry', desc: 'Enter vessel diameter, wall thickness, corrosion allowance, and component-specific dimensions.' },
      { step: 5, title: 'Select Verified ASME Material', desc: 'Choose certified ASME Section II-D materials (e.g. SA-516 Gr 70, SA-106 B, SA-240 316L) to automatically populate temperature-dependent allowables.' },
      { step: 6, title: 'Apply Design Loads & Piping Reactions', desc: 'Enter internal/external pressure, design temperature, and 6-DOF WRC piping forces/moments.' },
      { step: 7, title: 'Run Automated Validation Check', desc: 'Nova verifies all geometric limits (e.g. d/D opening ratio, ligament pitch, edge distance) prior to execution.' },
      { step: 8, title: 'Execute Analysis / Cloud Solve', desc: 'Run closed-form analytical code checks or launch the ANSYS ACT automated FEA mesher and solver.' },
      { step: 9, title: 'Review Results & Stress Linearization', desc: 'Inspect membrane (Pm, PL), bending (Pb), secondary (Q), and peak (F) stresses against ASME allowable margins.' },
      { step: 10, title: 'Generate Audit-Ready PDF Report', desc: 'Export stamped engineering calculation dossiers complete with parameter audit trails, 3D diagrams, and code citations.' }
    ],

    engineeringCaution: `
**CRITICAL PROFESSIONAL RESPONSIBILITY NOTICE:**
The documentation, calculations, and software tools provided by the Nova Platform are intended as engineering aids and technical references. 
They do NOT replace the independent engineering judgment, calculations, and review of a registered Professional Engineer (PE) or Chartered Engineer (CEng). 
All pressure equipment designs must be independently verified against the specific project engineering specifications, customer mechanical data sheets, applicable local jurisdictional laws, and the governing edition of the ASME / EJMA Boiler and Pressure Vessel Code.
    `,

    faqs: [
      {
        q: 'Do I need ANSYS installed on my local computer to use Nova?',
        a: 'No. The Nova web platform runs cloud-based solvers on high-performance remote servers. However, if you possess local ANSYS Workbench licenses, you can download our proprietary .WBEX ACT Wizards to run the identical automated workflows directly inside your local ANSYS Mechanical environment.'
      },
      {
        q: 'How does Nova handle material allowable stress at high temperatures?',
        a: 'Nova queries an internal verified database of over 8,000 ASME Section II-D material specifications. When you input a design temperature (e.g. 350°C), Nova interpolates allowable stress (S), yield strength (Sy), tensile strength (Su), and elastic modulus (E) directly from Section II-D Table 1A and Table TM-1.'
      },
      {
        q: 'What is the credit cost per analysis run?',
        a: 'Basic analyses (Nozzle, Bellows, Saddle, Local PWHT) consume between 125 and 300 credits. Advanced modules (Flange, Hot Box, Stiffener, Lug, Trunnion, Tubesheet) consume 75 to 250 credits depending on whether non-linear FEA or transient thermal simulation is requested.'
      }
    ],

    relatedTopics: ['website-overview', 'dashboard-guide', 'units-conventions', 'nozzle-analysis', 'asme-materials'],
    references: [
      { source: 'ASME BPVC Section VIII Division 1', topic: 'Rules for Construction of Pressure Vessels' },
      { source: 'ASME BPVC Section VIII Division 2', topic: 'Alternative Rules – Design by Analysis (Part 5)' },
      { source: 'ASME BPVC Section II Part D', topic: 'Properties (Metric & Customary)' },
      { source: 'EJMA Standards 11th Edition', topic: 'Standards of the Expansion Joint Manufacturers Association' }
    ]
  },
  {
    id: 'website-overview',
    slug: 'website-overview',
    title: 'Nova Website Ecosystem & Software Architecture',
    category: 'Website Overview',
    badge: 'Platform Architecture',
    discipline: 'Full-Stack Engineering',
    difficulty: 'Beginner',
    type: 'Guide',
    standard: 'SaaS Platform Architecture',
    version: 'Nova v2.4',
    readingTime: '10 min',
    lastReviewed: 'October 2026',
    summary: 'In-depth tour of the Nova Platform frontend, dashboard features, credit wallet, Supabase backend integration, and analysis job lifecycle.',
    
    depthContent: {
      beginner: 'The Nova Website consists of an interactive home landing page, a central engineering dashboard, dedicated parametric analysis submission forms, a global ASME materials explorer, a community discussion forum, and a technical help center.',
      engineer: 'The web application is built on React 19, Tailwind CSS, and Vite, integrating real-time user authentication and job persistence via Supabase PostgreSQL. Job submission workflows validate client-side input parameters before dispatching asynchronous simulation requests to cloud worker nodes.',
      expert: 'The frontend architecture utilizes optimistic UI updates with resilient error boundaries and local caching for material properties. Job states transition across: Pending → Validated → Queued → Solving → Linearizing → Completed. Calculation outputs are stored as structured JSON alongside high-resolution SVG/PNG stress contour snapshots and compiled client-side into PDF dossiers using jsPDF and autoTable.'
    },

    overview: `
The **Nova Engineering Platform** provides a unified web portal for pressure vessel and piping engineering. It eliminates fragmented spreadsheets and disjointed CAD/FEA scripts by consolidating all vessel analysis disciplines under a single cohesive interface.
    `,

    keyFeatures: [
      { name: 'Engineering Dashboard', desc: 'Real-time overview of active, completed, and draft calculation jobs with search, filtering, and metric widgets.' },
      { name: '10 Specialized Analysis Modules', desc: 'Dedicated parameter-by-parameter forms for Nozzles, Bellows, Flanges, Saddles, PWHT, Hot Box, Stiffeners, Tubesheets, Lugs, and Trunnions.' },
      { name: 'ASME Materials Explorer', desc: 'Searchable database containing thousands of ASME Section II-D material grades with temperature-dependent allowable stress curves.' },
      { name: 'Stress-Strain Curve Generator', desc: 'Interactive generator for True Stress-Strain, Cyclic, Isochronous, and Tangent Modulus curves per ASME Section VIII-2 Annex 3-D.' },
      { name: 'CAD AI 3D Generator', desc: 'Natural language and parametric 3D CAD geometry builder exporting standard STEP and IGES files.' },
      { name: 'Nova Community & Chat', desc: 'Peer-to-peer technical exchange platform for pressure vessel design engineers to share insights, code interpretations, and design reviews.' },
      { name: 'Credit Wallet & Tiered Subscriptions', desc: 'Flexible on-demand credit consumption with Basic, Pro, and Max tier feature gates.' }
    ],

    faqs: [
      { q: 'Is my proprietary project data encrypted?', a: 'Yes. All project inputs, geometry, loads, and calculation reports are stored in isolated encrypted database partitions accessible only via authenticated user sessions.' },
      { q: 'Can I re-run a previous calculation with minor modifications?', a: 'Yes. From the Dashboard, click "Duplicate & Edit" on any completed job to open a pre-filled form with all previous geometric and loading parameters.' }
    ],

    relatedTopics: ['getting-started', 'dashboard-guide', 'user-account-preferences', 'projects-guide'],
    references: [
      { source: 'Nova Software Documentation', topic: 'Frontend & Cloud Solver Architecture' }
    ]
  },
  {
    id: 'dashboard-guide',
    slug: 'dashboard-guide',
    title: 'Dashboard Guide & Job Lifecycle Management',
    category: 'Dashboard Guide',
    badge: 'User Guide',
    discipline: 'Operations & Management',
    difficulty: 'Beginner',
    type: 'Guide',
    standard: 'Workflow Management',
    version: 'Nova v2.4',
    readingTime: '9 min',
    lastReviewed: 'October 2026',
    summary: 'How to monitor calculation statuses, filter past jobs, download certified PDF reports, and manage multi-discipline engineering calculations.',
    
    depthContent: {
      beginner: 'The Dashboard is your operational command center in Nova. It displays all your current and past analysis jobs, total credits remaining, subscription status, and quick-action buttons to launch new analyses.',
      engineer: 'The dashboard provides powerful filtering by module type (Nozzle, Bellows, Saddle, etc.), date range, pass/fail status, and keyword search. Each job row displays key metadata: Project ID, Client Tag, Component Description, Governing Stress Ratio, Solver Status, and Timestamp.',
      expert: 'Job statuses follow a deterministic state machine: `Draft` (unsubmitted local edits) → `Queued` (waiting for solver worker allocation) → `Meshing` (SpaceClaim/Ansys hex mesh execution) → `Solving` (Mechanical sparse matrix solver) → `Linearizing` (SCL stress integration) → `Completed` (results ready) or `Failed` (geometric convergence error or negative Jacobian with diagnostic traceback).'
    },

    overview: `
The **Nova Dashboard** gives engineers immediate visibility into their calculation workload. Whether analyzing a single nozzle penetration or managing dozens of heat exchanger tubesheets across a petrochemical plant expansion, the dashboard centralizes all engineering data.
    `,

    lifecycleStates: [
      { status: 'Draft', color: 'slate', desc: 'User has entered parameters into the form but has not yet committed credits for cloud execution.' },
      { status: 'Queued', color: 'amber', desc: 'Parameters verified; calculation is prioritized in the solver queue awaiting compute node allocation.' },
      { status: 'Solving', color: 'blue', desc: 'Headless FEA or analytical solver is executing geometry generation, contact iteration, or matrix decomposition.' },
      { status: 'Completed', color: 'emerald', desc: 'Calculation finished successfully. Stress linearization ratios, pass/fail verdicts, and PDF reports are available.' },
      { status: 'Failed', color: 'rose', desc: 'Calculation stopped due to non-convergence, extreme geometric distortion, or boundary condition conflict. Diagnostic logs provided.' }
    ],

    relatedTopics: ['getting-started', 'results-reports', 'troubleshooting'],
    references: [
      { source: 'Nova Operations Manual', topic: 'Cloud Job Scheduler & Lifecycle Management' }
    ]
  },
  {
    id: 'navigation-guide',
    slug: 'navigation-guide',
    title: 'Navigation Guide, Keyboard Shortcuts & Command Palette',
    category: 'Navigation Guide',
    badge: 'UI & Shortcuts',
    discipline: 'User Experience',
    difficulty: 'Beginner',
    type: 'Guide',
    standard: 'Web Accessibility & UX',
    version: 'Nova v2.4',
    readingTime: '7 min',
    lastReviewed: 'October 2026',
    summary: 'Keyboard shortcuts (Ctrl+K), deep linking URL structures, mobile drawer navigation, and rapid search navigation across the Help Center.',
    
    depthContent: {
      beginner: 'Navigate Nova using the left sidebar, the top global search bar, or the quick-action breadcrumbs located at the top of every page. You can jump directly to any documentation topic using the command palette.',
      engineer: 'Nova provides URL-driven state management. Bookmarking or sharing `/help/nozzle-analysis` or `/help/flange-analysis` immediately opens the exact documentation page and synchronizes browser history without full page reloads.',
      expert: 'The platform implements WAI-ARIA accessible keyboard navigation. Pressing `Ctrl + K` (Windows/Linux) or `Cmd + K` (macOS) triggers the Command Palette modal, allowing fuzzy matching across all 30+ documentation topics, 70+ glossary terms, and all parameter definitions.'
    },

    shortcutsTable: [
      { key: 'Ctrl + K / Cmd + K', action: 'Open Global Command Palette & Search' },
      { key: 'Esc', action: 'Close any active modal, search palette, or image lightbox' },
      { key: 'Ctrl + P / Cmd + P', action: 'Print current documentation page in clean, distraction-free PDF format' },
      { key: 'Arrow Up / Arrow Down', action: 'Navigate through search suggestions and command palette results' },
      { key: 'Enter', action: 'Select active search result or execute command' },
      { key: 'Tab / Shift + Tab', action: 'Accessible keyboard focus cycling across all interactive controls' }
    ],

    relatedTopics: ['website-overview', 'getting-started'],
    references: [
      { source: 'W3C WAI-ARIA 1.2', topic: 'Accessible Rich Internet Applications Navigation Guidelines' }
    ]
  },
  {
    id: 'units-conventions',
    slug: 'units-conventions',
    title: 'Units & Engineering Conventions: Dimensional Consistency',
    category: 'Units & Conventions',
    badge: 'Dimensional Mechanics',
    discipline: 'Physics & Standards',
    difficulty: 'Beginner',
    type: 'Reference',
    standard: 'NIST SP 811 / ASME Section II-D',
    version: 'Nova v2.4',
    readingTime: '11 min',
    lastReviewed: 'October 2026',
    summary: 'Why consistent unit systems are safety-critical in engineering FEA, conversion mathematical factors, and standard SI versus Imperial conventions.',
    
    depthContent: {
      beginner: 'In pressure vessel design, mixing inches with millimeters, or bars with megapascals, can lead to dangerous errors. Always ensure all inputs use consistent units before running an analysis.',
      engineer: 'In finite element analysis, the solver has no built-in knowledge of units—it only solves numerical equations. If length is in millimeters (mm) and force is in Newtons (N), then stress is automatically in Megapascals (MPa = N/mm²), and Elastic Modulus must be entered in Megapascals (e.g. 200,000 MPa, NOT 200 GPa). Entering E = 200 causes a 1,000-fold error in calculated displacements and stresses.',
      expert: 'Newtonian mechanics requires that Force = Mass × Acceleration ($F = m \\cdot a$). In the SI metric system ($m, kg, s$), 1 N = 1 kg·m/s². In the standard FEA millimeter system ($mm, N, s$), mass must be expressed in metric tonnes ($1\\text{ tonne} = 10^3\\text{ kg}$), and steel density must be entered as $7.85 \\times 10^{-9}\\text{ tonne/mm}^3$ to satisfy $1\\text{ N} = 1\\text{ tonne} \\cdot 1\\text{ mm/s}^2$. In US Customary units ($in, lbf, s$), mass is in "slinches" ($lbf \\cdot s^2/in$), where gravitational acceleration is $386.088\\text{ in/s}^2$.'
    },

    overview: `
The history of engineering contains numerous catastrophic failures caused by unit confusion—from the Mars Climate Orbiter loss to industrial vessel overpressure events. 
Nova enforces strict input unit validation and provides dynamic bidirectional conversion tools to eliminate dimensional discrepancy risks.
    `,

    consistencyMatrix: [
      {
        system: 'Standard FEA System (Nova Default)',
        length: 'mm',
        force: 'N',
        mass: 'tonne (1000 kg)',
        stress: 'MPa (N/mm²)',
        energy: 'mJ (N·mm)',
        density: '7.85e-9 tonne/mm³',
        gravity: '9,806.65 mm/s²'
      },
      {
        system: 'SI Metric (Scientific MKS)',
        length: 'm',
        force: 'N',
        mass: 'kg',
        stress: 'Pa (N/m²)',
        energy: 'J (N·m)',
        density: '7,850 kg/m³',
        gravity: '9.80665 m/s²'
      },
      {
        system: 'US Customary Engineering',
        length: 'in',
        force: 'lbf',
        mass: 'lbm or slinch',
        stress: 'psi or ksi',
        energy: 'in·lbf',
        density: '0.2836 lb/in³',
        gravity: '386.088 in/s²'
      }
    ],

    faqs: [
      {
        q: 'Can I enter pressure in bar instead of MPa?',
        a: 'Yes. Nova input forms allow selecting "bar" or "psi" from the unit dropdown next to the input field. Nova automatically normalizes the value into MPa (e.g. 10 bar = 1.0 MPa) prior to calculation execution.'
      },
      {
        q: 'How does Nova convert temperature for material property lookup?',
        a: 'If you enter design temperature in °F, Nova applies $T_{°C} = (T_{°F} - 32) \\times 5/9$ to query the metric ASME Section II-D property tables, or queries the customary table directly if US customary is selected.'
      }
    ],

    relatedTopics: ['units-reference', 'getting-started', 'nozzle-analysis'],
    references: [
      { source: 'NIST Special Publication 811', topic: 'Guide for the Use of the International System of Units (SI)' },
      { source: 'ASME Section II Part D', topic: 'Mandatory Appendix 7: Guidelines on Selection of Metric/Customary Units' }
    ]
  },
  {
    id: 'analysis-comparison',
    slug: 'analysis-comparison',
    title: 'Analysis Workflows & Cross-Module Comparison Matrix',
    category: 'Analysis Workflows',
    badge: 'Engineering Selection Guide',
    discipline: 'Pressure Vessel Design',
    difficulty: 'Intermediate',
    type: 'Guide',
    standard: 'ASME / EJMA / WRC / TEMA',
    version: 'Nova v2.4',
    readingTime: '13 min',
    lastReviewed: 'October 2026',
    summary: 'A complete comparative breakdown of all 10 analysis modules: purpose, typical inputs, governing failure modes, and code references.',
    
    depthContent: {
      beginner: 'Not sure which analysis module to use? This guide compares all 10 engineering modules side-by-side, helping you select the appropriate tool for nozzles, expansion joints, flanges, vessel supports, stiffeners, heat exchangers, or lifting attachments.',
      engineer: 'Pressure vessel engineering requires distinct failure mode verifications for different vessel features: shell openings require reinforcement and piping load checks (Nozzle Module); piping thermal growth requires bellows flexure and squirm checks (Bellows Module); flanged joints require gasket seating and rigidity checks (Flange Module); and horizontal vessels require twin saddle beam bending and horn stress checks (Saddle Module).',
      expert: 'The modules span different analytical and numerical methodologies: closed-form empirical Design-by-Rule (e.g. ASME VIII-1 UG-37, Appendix 2, Zick 1951), semi-empirical shell flexure solutions (WRC 107/537/297/452), and continuum 3D finite element Design-by-Analysis (ASME VIII-2 Part 5). This guide details governing stress categories (Pm, PL, Pb, Q, F), shakedown limits (3S), and buckling bifurcation factors.'
    },

    overview: `
Selecting the correct engineering module is critical for ensuring compliance with client specifications and governing safety codes. 
The table below contrasts all 10 core analysis modules available on the Nova Platform.
    `,

    relatedTopics: ['nozzle-analysis', 'bellows-analysis', 'flange-analysis', 'saddle-analysis', 'tubesheet-analysis'],
    references: [
      { source: 'ASME Boiler & Pressure Vessel Code', topic: 'Section VIII Divisions 1 & 2' },
      { source: 'EJMA Standards 11th Edition', topic: 'Expansion Joint Design' },
      { source: 'TEMA 10th Edition', topic: 'Standards of Tubular Exchanger Manufacturers Association' }
    ]
  }
];
