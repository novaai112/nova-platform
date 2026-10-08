// Software Systems: Nova Website, Ansys ACT Wizard, and CAD AI

export const SOFTWARE_ARTICLES = [
  // ==========================================
  // NOVA WEBSITE
  // ==========================================
  {
    id: 'nova-website',
    slug: 'nova-website',
    title: 'Nova Website: Verified Application Features & Platform Workflows',
    category: 'Software',
    badge: 'Platform Reference',
    discipline: 'Web & Cloud Engineering',
    difficulty: 'Beginner',
    type: 'Guide',
    standard: 'Nova Platform Specification',
    version: 'Nova v2.4',
    readingTime: '14 min',
    lastReviewed: 'October 2026',
    summary: 'Comprehensive documentation of verified Nova Website features: Dashboard, Projects, Job submission, Credit consumption, Reporting, User settings, and Community.',
    
    depthContent: {
      beginner: 'The Nova Website is your browser-based engineering workspace. You can sign in, manage your credits, submit jobs across 10 engineering modules, view real-time calculation progress, and download certified PDF calculation reports.',
      engineer: 'Nova provides a unified user workflow: (1) Select analysis module, (2) Input validated geometric and design conditions, (3) System verifies credit balance (Basic, Pro, Max plans), (4) Calculation executes either via client-side high-precision JavaScript engines or remote headless ANSYS worker processes, (5) Results and stress intensities are compiled into downloadable engineering dossiers.',
      expert: 'The web client communicates with a Supabase PostgreSQL backend via JWT-secured REST APIs. State management handles route parsing (`/help/:topicId`, `/dashboard/job/:id`, `/materials/:id`, `/community`). Credit deduction occurs atomically via database RPC functions before job dispatch. PDF reports are generated client-side using `jsPDF` and `jspdf-autotable`, rendering vector tables, diagrams, and numerical audit trails.'
    },

    overview: `
The **Nova Website** is a modern, responsive web application engineered to give pressure equipment specialists immediate access to sophisticated analytical and numerical tools without requiring local software installations or license dongles.
    `,

    keyScreens: [
      { name: 'Home Landing Page', desc: 'Overview of platform capabilities, interactive 3D feature highlights, and subscription plan tiers.' },
      { name: 'Central Engineering Dashboard', desc: 'Real-time job queue, summary statistics, search and filtering tools, and direct "Submit New Job" triggers.' },
      { name: 'Parametric Submission Forms', desc: 'Dynamic forms with field-by-field validation, dependency evaluation, and interactive unit toggles across all 10 modules.' },
      { name: 'Interactive Results Viewer', desc: 'Color-coded stress utilization bars, SCL linearization plots, pass/fail verdicts, and raw JSON data inspector.' },
      { name: 'ASME Materials Explorer', desc: 'Searchable database of over 8,000 certified ASME Section II-D materials with temperature curve plots.' },
      { name: 'Stress-Strain Generator', desc: 'Real-time Chart.js graph generating Annex 3-D non-linear material curves for export into FEA.' },
      { name: 'Nova Community & Chat', desc: 'Technical discussion boards and direct messaging for peer review and engineering inquiries.' },
      { name: 'User Profile & Billing', desc: 'Account credentials, credit purchase gateway (Razorpay integration), and transaction history.' }
    ],

    relatedTopics: ['getting-started', 'dashboard-guide', 'ansys-act-wizard', 'cad-ai'],
    references: [
      { source: 'Nova Software Architecture Guide', topic: 'Web Frontend & Supabase Cloud Infrastructure' }
    ]
  },

  // ==========================================
  // ANSYS ACT WIZARD
  // ==========================================
  {
    id: 'ansys-act-wizard',
    slug: 'ansys-act-wizard',
    title: 'Ansys ACT Wizard: Workbench Extensions (.WBEX) & Automation Suite',
    category: 'Software',
    badge: 'FEA Automation',
    discipline: 'Finite Element Analysis',
    difficulty: 'Expert',
    type: 'Guide & Reference',
    standard: 'ANSYS ACT Customization Framework (v2023R2 – v2025R1)',
    version: 'ACT v2.4',
    readingTime: '24 min',
    lastReviewed: 'October 2026',
    summary: 'Complete guide to the Nova Ansys ACT Wizard suite: .WBEX architecture, Shell Nozzle Wizard, Head Nozzle Wizard, Full Nozzle Wizard, App Builder, and Extension Manager installation.',
    
    depthContent: {
      beginner: 'Ansys ACT (ANSYS Customization Toolkit) allows developers to build custom buttons, menus, and automated step-by-step "Wizards" inside ANSYS Mechanical and SpaceClaim. Instead of spending hours manually creating geometry, slicing volumes, meshing, and applying loads, the Nova ACT Wizard automates the entire process in a single click from a user-friendly toolbar.',
      engineer: 'The Nova ACT extensions are packaged as compiled `.wbex` files. They inject custom XML GUI definitions and IronPython script handlers directly into the ANSYS Mechanical tree. Nova offers four distinct ACT Wizards: (1) Shell Nozzle Wizard, (2) Head Nozzle Wizard, (3) Full Nozzle Wizard (combines vessel shell, formed heads, nozzles, and ASME B16.5 flanges), and (4) Stress-Strain Curve Wizard (injects multi-temperature Annex 3-D plastic material models into Engineering Data).',
      expert: 'The ACT architecture utilizes the ANSYS Mechanical API (`ExtAPI.DataModel`) and SpaceClaim API (`SpaceClaim.Api.V24`). An ACT extension consists of an XML definition file (`<extension name="...">`) and an IronPython script package (`main.py`). The extension hooks into Mechanical events: `OnPreSolve` automates hex-dominant sweep meshing and defines contact pairs; `OnPostSolve` automatically creates Stress Classification Lines (SCL) perpendicular to the mid-surface, performs stress linearization per ASME Section VIII Division 2 (Part 5), and generates an automated HTML/PDF compliance dossier.'
    },

    overview: `
The **ANSYS Customization Toolkit (ACT)** is the premier automation framework for the ANSYS simulation ecosystem. 
Official ANSYS documentation highlights ACT's suite of developer tools: **ACT Console**, **Extension Manager**, **Wizards launcher**, **ACT App Builder**, **ACT Debugger**, and **ACT Workflow Designer**.

Nova leverages this enterprise technology to provide turnkey **.WBEX Extensions** that eliminate manual preprocessing in pressure vessel FEA.
    `,

    wizardsCatalog: [
      {
        name: 'Shell Nozzle Ansys ACT Wizard',
        filename: 'Shell_Nozzle.wbex',
        desc: 'Specialized workflow for cylindrical and conical shell nozzles. Automates parametric CAD creation, reinforcing pad fillet welds, structured hex meshing, and ASME VIII-2 SCL stress linearization.',
        features: ['Cylindrical shell intersections', 'Radial & offset nozzles', 'Pad fillet weld modeling', 'Automatic local coordinate systems', 'SCL path linearization']
      },
      {
        name: 'Head Nozzle Ansys ACT Wizard',
        filename: 'Head_Nozzle.wbex',
        desc: 'Advanced parametric analysis for dished heads: 2:1 Ellipsoidal, Torispherical (F&D), and Hemispherical heads with oblique and radial nozzles.',
        features: ['Ellipsoidal & Torispherical heads', 'Knuckle transition stress paths', 'Off-center oblique nozzle angles', 'Automatic bonded weld contacts', 'Triaxial strain evaluation']
      },
      {
        name: 'Full Nozzle Ansys ACT Wizard',
        filename: 'Full_Nozzle.wbex',
        desc: 'Complete unified pressure vessel package combining cylindrical shells, formed heads, nozzles, standard ASME B16.5 flanges, blind covers, bolt pretension, and combined internal pressure + WRC piping reactions.',
        features: ['Integrated vessel + heads + nozzles', 'ANSI B16.5 flanged ends', 'Bolt pretension load steps', 'Full multi-load combinations', 'One-click executive report generation']
      },
      {
        name: 'Stress-Strain Curve Ansys ACT Wizard',
        filename: 'Stress_Strain_Curve.wbex',
        desc: 'Generates non-linear true stress-strain curves directly inside ANSYS Engineering Data: Multilinear Isotropic Hardening (MISO), Kinematic Hardening (KINH), and multi-temperature models per ASME VIII-2 Annex 3-D.',
        features: ['Direct Engineering Data injection', 'MISO and KINH plasticity models', 'Temperature-dependent curve families', 'Ramberg-Osgood power-law fitting']
      }
    ],

    installationProcedure: [
      'Step 1: Download the verified `.wbex` extension file from your Nova user dashboard.',
      'Step 2: Launch ANSYS Workbench (Run as Administrator recommended for initial setup).',
      'Step 3: In the top menu bar, click Extensions → Install Extension...',
      'Step 4: Browse to your downloaded `.wbex` file and click Open.',
      'Step 5: Click Extensions → Manage Extensions... In the dialog, check the box next to the Nova Wizard to activate it.',
      'Step 6: Open SpaceClaim or ANSYS Mechanical. A custom "NOVA Engineering" tab will appear on the top ribbon bar.'
    ],

    faqs: [
      { q: 'Which ANSYS versions are supported by Nova ACT Wizards?', a: 'Nova ACT extensions are compiled and tested against ANSYS Workbench releases 2023 R2, 2024 R1, 2024 R2, and 2025 R1.' },
      { q: 'Can the ACT Wizard generate reports automatically?', a: 'Yes. Upon solve completion, the Wizard automatically extracts SCL paths, tabulates membrane ($P_m, P_L$) and bending ($P_b$) stress values, compares them against material allowable stresses, and exports a standalone HTML and PDF engineering report.' }
    ],

    relatedTopics: ['nozzle-analysis', 'stress-strain-curve', 'results-reports'],
    references: [
      { source: 'Ansys Help Documentation', topic: 'ACT Developer Guide: Customizing ANSYS Mechanical with Python' },
      { source: 'Ansys ACT Reference Manual', topic: 'App Builder, Workflow Designer & Wizards API' },
      { source: 'ASME Section VIII Division 2', topic: 'Part 5: Design-by-Analysis (Stress Linearization)' }
    ]
  },

  // ==========================================
  // CAD AI
  // ==========================================
  {
    id: 'cad-ai',
    slug: 'cad-ai',
    title: 'CAD AI 3D Generator: Parametric Pressure Vessel Modeling & AI Workflows',
    category: 'Software',
    badge: 'Design Automation',
    discipline: 'CAD & 3D Geometry',
    difficulty: 'Intermediate',
    type: 'Guide',
    standard: 'ISO 10303 (STEP AP203/AP214) / ASME Y14.5',
    version: 'Nova v2.0',
    readingTime: '15 min',
    lastReviewed: 'October 2026',
    summary: 'Autonomous AI-assisted parametric 3D CAD modeling for pressure vessels and piping components: natural language prompts, constraint validation, STEP/IGES export, and engineering verification requirements.',
    
    depthContent: {
      beginner: 'CAD AI allows you to describe a pressure vessel or piping connection in simple plain English (for example: "Create a 2000 mm diameter vertical vessel with 2:1 ellipsoidal heads and two NPS 8 nozzles on the shell"). The AI interprets the prompt, calculates the geometry, validates the dimensions, and generates an accurate 3D CAD model that you can view in your browser and export to STEP or IGES format.',
      engineer: 'CAD AI bridges the gap between text design specifications and solid modeling CAD kernels. The prompt parser extracts key design parameters (diameters, head aspect ratios, nozzle orientations, saddle locations). It maps these into a boundary-representation (B-Rep) parametric geometry engine with topological constraints (tangency at head knuckles, watertight shell-to-nozzle boolean unions). The resulting solid model is exported in vendor-neutral STEP AP214 format for import into SolidWorks, Inventor, SpaceClaim, or Creo.',
      expert: 'The AI pipeline utilizes a domain-specific LLM trained on ASME vessel standards and parametric Python-OCC (OpenCASCADE) scripts. It enforces strict geometric sanity constraints before executing boolean operations: nozzle offsets must not intersect head knuckles, minimum nozzle-to-weld clearances must satisfy ASME UW-14, and pad widths must conform to UG-40 limits. Solid geometry is topologically verified for manifoldness (Euler-Poincaré characteristic: $V - E + F = 2$) and surface continuity ($G^1$ tangency across dished knuckles).'
    },

    overview: `
The **Nova CAD AI 3D Generator** enables engineers to generate production-ready 3D solid CAD models of pressure vessels, piping connections, and supports in seconds using natural language prompts or parametric tables.
    `,

    aiWorkflow: [
      { step: 1, title: 'Natural Language Prompt', desc: 'User describes equipment configuration (e.g., "Horizontal accumulator with 120° saddles, 16 mm shell, ellipsoidal heads, and manway").' },
      { step: 2, title: 'Parameter Extraction', desc: 'AI extracts explicit dimensions and applies standard ASME defaults for unstated parameters.' },
      { step: 3, title: 'Constraint & Code Validation', desc: 'Geometric engine checks opening ratios, weld clearances, and knuckle blend tangencies.' },
      { step: 4, title: 'Solid Model Generation', desc: 'B-Rep geometry kernel builds watertight solids, fillet welds, and chamfers.' },
      { step: 5, title: 'Interactive 3D WebGL Preview', desc: 'User inspects, rotates, pans, and measures the 3D model directly in the browser.' },
      { step: 6, title: 'Engineering Review & Export', desc: 'Model is downloaded in STEP, IGES, or Parasolid format for FEA simulation or manufacturing detailing.' }
    ],

    engineeringLimitations: `
**CRITICAL AI VERIFICATION RULES:**
1. **AI Output Is NOT Automatic Proof of Structural Safety:** An AI-generated 3D CAD model proves geometric feasibility, NOT pressure containment strength. The model must always be checked using Nova analysis modules or FEA.
2. **Dimension Verification:** The engineer must verify all wall thicknesses, flange bolt patterns, and nozzle projections against the official piping and instrument diagrams (P&ID) and mechanical equipment data sheet.
3. **No Substitute for Professional Judgment:** AI geometry automation accelerates repetitive CAD drafting, but ultimate design certification rests solely with a qualified engineer.
    `,

    faqs: [
      { q: 'What CAD formats can CAD AI export?', a: 'CAD AI exports standard ISO 10303 STEP files (AP203 and AP214), IGES (.igs), and STL surface meshes for 3D printing.' },
      { q: 'Can I import the generated STEP model directly into ANSYS?', a: 'Yes. The exported STEP files are clean, watertight solid bodies specifically designed for direct import into ANSYS SpaceClaim, DesignModeler, or Mechanical without geometry repair or healing.' }
    ],

    relatedTopics: ['nozzle-analysis', 'ansys-act-wizard', 'nova-website'],
    references: [
      { source: 'ISO 10303-214', topic: 'Industrial Automation Systems – Product Data Representation (STEP AP214)' },
      { source: 'ASME Y14.5', topic: 'Dimensioning and Tolerancing' }
    ]
  }
];
