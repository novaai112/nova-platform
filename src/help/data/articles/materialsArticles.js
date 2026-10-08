/**
 * NOVA ENGINEERING DOCUMENTATION - MATERIALS ARTICLES
 * 
 * Authoritative coverage for:
 * 1. ASME BPVC Section II Part D Materials Database & Property Interpolation
 * 2. True / Engineering / Isochronous Stress-Strain Curve Generator (ASME VIII-2 Annex 3-D)
 */

export const MATERIALS_ARTICLES = [
  {
    id: 'asme-materials',
    slug: 'asme-materials',
    title: 'ASME Section II-D Materials Database',
    category: 'Materials',
    module: 'Materials Database',
    difficulty: 'Intermediate',
    discipline: 'Materials',
    applicableStandards: ['ASME BPVC Section II Part D', 'ASME BPVC Section VIII Div 1 & 2', 'ASME Section IX (P-Nos)'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-04',
    readingTime: '16 min',
    summary: 'Comprehensive guide to ASME Section II Part D materials specification, allowable stress tables (Table 1A, 1B, 5A, 5B), P-Number/Group-Number welding classifications, temperature-dependent strength derating, and brittle fracture impact test exemption rules (UCS-66).',
    tags: ['materials', 'asme-ii-d', 'allowable-stress', 'p-number', 'tensile-strength', 'yield-strength', 'ucs-66', 'mdmt'],
    
    technicalDepth: {
      beginner: 'ASME materials provide certified physical properties for pressure vessel steel. As metals get hotter, their strength drops. Nova provides temperature-dependent allowable stresses, minimum yield, and tensile strengths straight from ASME Section II-D tables so you never undersize vessel walls.',
      engineer: 'Covers ASME BPVC Section II Part D allowable stresses ($S$), yield strength ($S_y$), tensile strength ($S_u$), elastic modulus ($E$), and thermal expansion ($\alpha$) indexed against design temperature. Includes linear temperature interpolation between tabular grid nodes, P-No/Group-No identification for weld qualification, and UCS-66 Curve assignment (Curves A, B, C, D) for Minimum Design Metal Temperature (MDMT) verification.',
      expert: 'In-depth treatment of ASME Section II Part D design margins: Division 1 ($3.5$ on tensile, $2/3$ or $90\\%$ on yield for austenitic) vs. Division 2 Class 1 & 2 ($2.4$ and $3.0$ on tensile). Governs time-dependent creep stress regimes (indicated by italicized/shaded values in Sec II-D), external pressure charts (Subpart 3 charts for buckling analysis), and cryogenic toughness impact testing under UCS-66 / UHA-51.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. Overview & Code Authority',
        content: `ASME Boiler and Pressure Vessel Code (BPVC) Section II, Part D ("Properties (Customary and Metric)") serves as the mandatory metallurgical reference for all Section I, Section III, Section IV, Section VIII, and Section XII construction.

In the Nova Platform, the materials engine queries a comprehensive database of over **2,400 certified material specifications** spanning:
* **Carbon and Low-Alloy Steels** (e.g., SA-516 Gr 70, SA-106 Gr B, SA-333 Gr 6, SA-387 Gr 11/22)
* **High-Alloy and Stainless Steels** (e.g., SA-240 Types 304, 304L, 316, 316L, 321, 347, Duplex 2205)
* **Non-Ferrous Alloys** (Nickel alloys SB-409 Alloy 800H, SB-168 Inconel 600, Titanium, Copper alloys)
* **Bolting Materials** (SA-193 B7, SA-194 2H, SA-320 L7, SA-453 660)`
      },
      {
        id: 'property-structure',
        title: '2. Database Property Architecture',
        content: `Every material record in Nova's metallurgical repository adheres to a strict schema mirroring ASME II-D:

1. **Base Metallurgical Metadata:**
   * **Specification & Grade:** Nominal standard designation (e.g., SA-516 Grade 70).
   * **Nominal Composition:** Metallurgical chemical archetype (e.g., *Carbon-Manganese-Silicon*).
   * **Product Form:** Manufacturing method (Plate, Seamless Pipe, Forging, Welded Tube, Bar).
   * **P-Number & Group-Number:** ASME Section IX welding grouping for Procedure Qualification Records (PQR) and Welding Procedure Specifications (WPS).

2. **Mechanical Tensile Properties:**
   * **Minimum Specified Tensile Strength ($S_u$ / UTS):** Guaranteed room-temperature minimum ultimate strength (e.g., 485 MPa / 70 ksi for SA-516-70).
   * **Minimum Specified Yield Strength ($S_y$ / YS):** Guaranteed room-temperature 0.2% offset yield stress (e.g., 260 MPa / 38 ksi for SA-516-70).

3. **Temperature-Dependent Allowable Stress Array ($S$ vs. $T$):**
   * Allowable maximum membrane stress tabulated from $-29^\\circ\\text{C}$ ($-20^\\circ\\text{F}$) up to the metallurgical limit ($538^\\circ\\text{C}$ for CS, $815^\\circ\\text{C}$ for austenitic alloys).`
      },
      {
        id: 'temperature-interpolation',
        title: '3. Temperature Interpolation & Creep Regimes',
        content: `When your design temperature falls between ASME II-D tabular grid points (which typically increment by $25^\\circ\\text{C}$ or $50^\\circ\\text{F}$), Nova executes strict linear interpolation in accordance with Mandatory Appendix 1 of Section II-D:

$$S(T) = S_1 + \\frac{T - T_1}{T_2 - T_1} \\cdot (S_2 - S_1)$$

Where:
* $T_1, T_2$ = Adjacent lower and upper temperatures in the certified table
* $S_1, S_2$ = Tabulated allowable stresses at $T_1$ and $T_2$

**Important Note on Creep:**
At elevated temperatures (typically $> 370^\\circ\\text{C} / 700^\\circ\\text{F}$ for carbon steel, $> 427^\\circ\\text{C} / 800^\\circ\\text{F}$ for low alloy, and $> 538^\\circ\\text{C} / 1000^\\circ\\text{F}$ for austenitic stainless), allowable stresses are governed by **creep rate** (1% in 100,000 hours) or **creep rupture strength** (average stress to cause rupture in 100,000 hours multiplied by 0.67). In this range, cyclic plastic ratcheting and creep-fatigue interaction become governing failure mechanisms.`
      },
      {
        id: 'ucs66-toughness',
        title: '4. Brittle Fracture & UCS-66 Impact Test Exemption',
        content: `For carbon and low-alloy vessels designed under ASME VIII-1, brittle fracture prevention requires verifying the **Minimum Design Metal Temperature (MDMT)** against **Figure UCS-66**:

* **Curve A:** As-rolled carbon steels (e.g., SA-283, SA-285, non-killed SA-515, pipe SA-53). Highest risk of low-temperature cleavage; worst impact properties.
* **Curve B:** Fine-grain practice steels, normalized plates not in Curve C/D, or as-rolled SA-516 not killed.
* **Curve C:** Normalized fine-grain SA-516, SA-537, SA-662 steels produced to fine-grain practice and normalized.
* **Curve D:** Quenched and tempered steels (e.g., SA-517, SA-533, SA-543) or normalized fine-grain steels with verified Charpy V-Notch (CVN) testing.

If the coincident ratio of governing stress is lower than 1.0, ASME Figure UCS-66.1 allows a temperature reduction ($\Delta T_{reduction}$ up to $78^\\circ\\text{C} / 140^\\circ\\text{F}$) without mandatory impact testing.`
      }
    ],

    parameters: [
      {
        name: 'Material Name',
        symbol: 'Mat',
        unit: 'None',
        type: 'String',
        required: true,
        meaning: 'Designation matching ASME Section II-D specification and grade',
        validation: 'Must exist in certified material repository (e.g., SA-516-Gr-70)'
      },
      {
        name: 'Design Temperature',
        symbol: 'T',
        unit: '°C / °F',
        type: 'Float',
        required: true,
        meaning: 'Coincident metal temperature used to look up allowable stress',
        validation: 'Cannot exceed the ASME maximum allowable temperature limit for the specification'
      },
      {
        name: 'Minimum Specified Tensile Strength',
        symbol: 'S_u',
        unit: 'MPa / ksi',
        type: 'Float',
        required: true,
        meaning: 'Room-temperature minimum ultimate tensile strength',
        validation: 'Positive numerical value certified by mill test report (MTR)'
      },
      {
        name: 'Minimum Specified Yield Strength',
        symbol: 'S_y',
        unit: 'MPa / ksi',
        type: 'Float',
        required: true,
        meaning: 'Room-temperature minimum 0.2% offset yield stress',
        validation: 'Positive numerical value strictly less than Tensile Strength'
      },
      {
        name: 'Allowable Stress',
        symbol: 'S',
        unit: 'MPa / psi',
        type: 'Float',
        required: true,
        meaning: 'Maximum permissible membrane stress at design temperature',
        validation: 'Interpolated from ASME II-D Table 1A or Table 5A'
      }
    ],

    commonMistakes: [
      'Assuming room-temperature allowable stress applies at elevated operating temperatures (e.g., using 138 MPa for SA-516-70 at 350°C where allowable drops to 118 MPa).',
      'Confusing ASME Section VIII Division 1 Table 1A allowable stress (SF = 3.5 on tensile) with Division 2 Class 2 Table 5A allowable stress (SF = 3.0 on tensile).',
      'Failing to verify impact testing exemption when specifying normalized fine grain steel under UCS-66 Curve C vs Curve D.',
      'Using dual-certified 304/304L stainless steel allowable stresses from 304L at temperatures above 425°C where carbon content restricts high-temperature use.'
    ],

    faqs: [
      {
        q: 'What is the difference between Table 1A and Table 1B in Section II-D?',
        a: 'Table 1A contains allowable stresses for ferrous materials (carbon, alloy, and stainless steels) used in Section I, Section III Class 2/3, and Section VIII Division 1. Table 1B contains allowable stresses for non-ferrous materials (aluminum, copper, nickel, titanium, zirconium alloys).'
      },
      {
        q: 'Can I extrapolate material allowable stresses above the maximum tabulated temperature?',
        a: 'No. ASME Section II Part D strictly prohibits extrapolation above the maximum listed temperature. Doing so invalidates the ASME code stamp and is unsafe due to accelerated creep rupture.'
      },
      {
        q: 'How does Nova handle P-Numbers and Group-Numbers?',
        a: 'P-Numbers (P-No 1 through 15E) classify base metals to reduce the number of welding procedure qualifications required under Section IX. Group-Numbers further classify P-No materials when impact testing is mandatory.'
      }
    ],

    references: [
      { source: 'ASME', title: 'ASME BPVC Section II, Part D: Materials - Properties (Metric & Customary)', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'ASME', title: 'ASME BPVC Section VIII, Division 1: Rules for Construction of Pressure Vessels (Part UCS & UHA)', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'ASME', title: 'ASME BPVC Section IX: Welding, Brazing, and Fusing Qualifications', edition: '2023 Edition', link: 'https://www.asme.org' }
    ]
  },

  {
    id: 'stress-strain',
    slug: 'stress-strain',
    title: 'Stress-Strain Curve Generator (ASME VIII-2 Annex 3-D)',
    category: 'Materials',
    module: 'Stress-Strain Generator',
    difficulty: 'Advanced',
    discipline: 'Materials / FEA',
    applicableStandards: ['ASME BPVC Section VIII Div 2 Part 3 (Annex 3-D)', 'API 579-1 / ASME FFS-1 Part 5', 'WRC Bulletin 537'],
    softwareVersion: 'v2.4.0',
    lastReviewed: '2025-10-06',
    readingTime: '22 min',
    summary: 'Mathematical formulation, numerical algorithms, and ANSYS Mechanical export workflows for multi-linear kinematic/isotropic hardening (MISO/KINH) and isochronous creep stress-strain curves according to ASME BPVC Section VIII Division 2 Annex 3-D.',
    tags: ['stress-strain', 'annex-3d', 'true-stress', 'true-strain', 'plasticity', 'miso', 'kinh', 'ansys-export', 'isochronous-creep', 'tangent-modulus'],

    technicalDepth: {
      beginner: 'Standard structural analysis assumes metals stretch like springs (elastic linear behavior). When stresses exceed yield, real metal deforms permanently (plastic behavior). The Stress-Strain Generator computes the exact curved path of plastic deformation for your metal and temperature, letting you export material cards directly into Ansys FEA.',
      engineer: 'Generates True Stress vs. True Plastic Strain ($\sigma_{true}$ vs. $\varepsilon_{p,true}$) curves per ASME Section VIII-2 Annex 3-D using yield stress ($S_y$), ultimate tensile strength ($S_u$), and elastic modulus ($E_y$). Supports Bilinear (Tangent Modulus), Multi-linear Isotropic Hardening (MISO), Multi-linear Kinematic Hardening (KINH), and Omega Creep-Damage Isochronous curves.',
      expert: 'Implements the full modified Ramberg-Osgood formulation of ASME VIII-2 paragraph 3-D.1 with hardening exponents $m_1, m_2$, transitional hyperbolic tangent switching functions $H$, and Project Omega parameter sets ($A_0 \dots A_4, B_0 \dots B_4$) for high-temperature time-dependent relaxation and ratcheting assessment under API 579-1 / ASME FFS-1.'
    },

    sections: [
      {
        id: 'overview',
        title: '1. Engineering Purpose & FEA Plasticity',
        content: `In non-linear finite element analysis (FEA)—such as **Elastic-Plastic Stress Analysis** for Protection Against Plastic Collapse (ASME Section VIII Div 2 Paragraph 5.2.4) or Local Failure (Paragraph 5.3.3)—using linear elastic material models results in artificially infinite stress concentrations at notches and nozzle junctions.

To calculate true plastic deformation, limit load capacity, and residual stress states, the solver requires a continuous multi-linear hardening curve representing the true constitutive relationship of the metal.

Nova implements the analytical formulations of **ASME Section VIII Division 2, Annex 3-D ("Strength Parameters and Stress-Strain Curves for Numerical Analysis")** to compute continuous, thermodynamically consistent stress-strain curves.`
      },
      {
        id: 'engineering-vs-true',
        title: '2. Engineering Stress vs. True Stress Conversion',
        content: `Standard unaxial tensile testing measures **Engineering Stress** ($S$) and **Engineering Strain** ($e$), computed using the initial undeformed cross-sectional area ($A_0$) and initial gauge length ($L_0$):

$$S = \\frac{F}{A_0}, \\quad e = \\frac{\\Delta L}{L_0}$$

Because ductile specimens neck down and experience continuous cross-sectional area reduction during tensile yielding, continuum mechanics and large-deflection FEA formulations require **True Stress** ($\sigma_{true}$) and **True Total Strain** ($\varepsilon_{true}$):

$$\\sigma_{true} = S \\cdot (1 + e)$$

$$\\varepsilon_{true} = \\ln(1 + e)$$

The **True Plastic Strain** ($\varepsilon_{p,true}$)—which is the primary input variable required by ANSYS Mechanical and Abaqus for multi-linear plasticity tables—is obtained by subtracting the elastic strain:

$$\\varepsilon_{p,true} = \\varepsilon_{true} - \\frac{\\sigma_{true}}{E}$$`
      },
      {
        id: 'annex-3d-math',
        title: '3. ASME Section VIII-2 Annex 3-D Formulation',
        content: `ASME Annex 3-D establishes a two-regime piecewise continuous equation connected by a hyperbolic tangent switching function:

1. **Strength Ratio ($R$):**
   $$R = \\frac{S_y}{S_u}$$

2. **Transition Factor ($K$):**
   $$K = 1.5 R^{1.5} - 0.5 R^{2.5} - R^{3.5}$$

3. **Strain Hardening Exponents ($m_1, m_2$):**
   $$m_1 = \\frac{\\ln(R) + (\\varepsilon_p - e_{ys})}{\\ln\\left(\\frac{\\ln(1 + \\varepsilon_p)}{\\ln(1 + e_{ys})}\\right)}$$
   $$m_2 = C_2 \\cdot (1 - R)$$
   Where $e_{ys} = 0.002$ (0.2% offset strain) and $C_2$ is the curve fitting factor (typically 0.60 to 0.75).

4. **Strength Coefficients ($A_1, A_2$):**
   $$A_1 = \\frac{S_y (1 + e_{ys})}{\\left[\\ln(1 + e_{ys})\\right]^{m_1}}$$
   $$A_2 = \\frac{S_u \\cdot \\exp(m_2)}{m_2^{m_2}}$$

5. **Hyperbolic Switching Function ($H$):**
   $$H = \\frac{2 \\left[\\sigma_{true} - \\left(S_y + K(S_u - S_y)\\right)\\right]}{K(S_u - S_y)}$$

This formulation guarantees smooth $C^1$ continuity of the tangent modulus across the proportional limit into the plastic strain plateau without artificial numerical discontinuities that cause solver divergence.`
      },
      {
        id: 'isochronous-creep',
        title: '4. High-Temperature Isochronous Curves (Omega Method)',
        content: `For vessels operating in the creep regime, stress relaxation and creep strain accumulation occur over operating duration ($t$ in hours). Nova incorporates the **Materials Properties Council (MPC) Project Omega** methodology:

$$\\ln(\\dot{\\varepsilon}_{co}) = -\\left(A_0 + \\frac{A_1}{T} + \\frac{A_2 \\cdot \\sigma}{T} + \\frac{A_3 \\cdot \\sigma^2}{T} + \\frac{A_4 \\cdot \\sigma^3}{T}\\right)$$

$$\\Omega_n = B_0 + \\frac{B_1}{T} + \\frac{B_2 \\cdot \\sigma}{T} + \\frac{B_3 \\cdot \\sigma^2}{T} + \\frac{B_4 \\cdot \\sigma^3}{T}$$

Where $T$ is absolute temperature ($K$), $\sigma$ is stress (MPa), and coefficients $A_0 \dots A_4, B_0 \dots B_4$ are verified metallurgical constants calibrated for 24 major alloy families (Carbon Steels, 1.25Cr-0.5Mo, 2.25Cr-1Mo, 9Cr-1Mo-V, Type 304, Type 316, Alloy 800H/HT).`
      },
      {
        id: 'ansys-export',
        title: '5. ANSYS ACT & Engineering Data Export Workflow',
        content: `Once generated, Nova exports stress-strain data in formats directly ingestible by ANSYS Workbench:

* **MISO (Multilinear Isotropic Hardening):** Tabulated pairs of Plastic Strain vs. True Stress starting at $(0.0, S_y)$. Best suited for monotonic loading and gross plastic collapse evaluations.
* **KINH (Multilinear Kinematic Hardening):** Incorporates the Bauschinger effect for cyclic thermal-mechanical fatigue and ratcheting assessments under ASME VIII-2 Part 5.5.
* **ANSYS Engineering Data XML / CSV:** Formatted with comment headers, temperature markers, and unit tags (\`MPa, mm/mm\`) for one-click drag-and-drop into ANSYS Engineering Data.`
      }
    ],

    parameters: [
      {
        name: 'Yield Stress',
        symbol: 'S_y',
        unit: 'MPa / ksi',
        type: 'Float',
        required: true,
        meaning: '0.2% offset yield strength at operating temperature',
        validation: 'Must be positive and strictly less than Ultimate Tensile Stress'
      },
      {
        name: 'Ultimate Tensile Stress',
        symbol: 'S_u',
        unit: 'MPa / ksi',
        type: 'Float',
        required: true,
        meaning: 'Maximum engineering tensile strength at operating temperature',
        validation: 'Must exceed Yield Stress by at least 15%'
      },
      {
        name: 'Modulus of Elasticity',
        symbol: 'E_y',
        unit: 'GPa / msi',
        type: 'Float',
        required: true,
        meaning: 'Young\'s modulus at design temperature',
        validation: 'Typically 180–215 GPa for steel at 20°C; decreases with temperature'
      },
      {
        name: 'End Point Strain',
        symbol: 'ε_{max}',
        unit: '%',
        type: 'Float',
        required: true,
        meaning: 'Maximum total true strain plotted on horizontal axis',
        validation: 'Typically 2% to 20%'
      },
      {
        name: 'Curve Fitting Exponent Factor',
        symbol: 'm_2 / fact',
        unit: 'Dimensionless',
        type: 'Float',
        required: false,
        meaning: 'Multiplier on Annex 3-D plastic exponent m2',
        validation: 'Default 0.60 to 0.75'
      },
      {
        name: 'Time (Creep Isochronous)',
        symbol: 't',
        unit: 'Hours',
        type: 'Float',
        required: false,
        meaning: 'Operating service life for isochronous creep evaluation',
        validation: 'Typically 100 to 300,000 hours'
      }
    ],

    commonMistakes: [
      'Inputting Engineering Stress directly into ANSYS as True Stress, leading to unconservative plastic strain calculations at high deformation.',
      'Starting the plastic strain table at a non-zero value. ANSYS Mechanical requires that the first row of plastic strain must be exactly 0.0 with stress equal to yield stress.',
      'Assuming room-temperature tensile and yield strengths apply during elevated temperature FEA (e.g., using 485 MPa UTS at 400°C where true UTS has decreased).',
      'Using Isotropic Hardening (MISO) for cyclic shake-down or ratcheting assessments where Kinematic Hardening (KINH) is required to capture reverse yield and cyclic hardening.'
    ],

    faqs: [
      {
        q: 'Why does the true stress-strain curve continue upward beyond UTS?',
        a: 'In an engineering stress-strain curve, necking causes the load to drop because cross-sectional area decreases rapidly. In a true stress-strain curve, true stress is force divided by actual instantaneous area, which increases monotonically until ductile fracture.'
      },
      {
        q: 'Can this curve be used in ANSYS Workbench Engineering Data?',
        a: 'Yes. Use the "Export to Ansys" button in the curve generator. It downloads a formatted text file compatible with ANSYS Mechanical APDL commands (TB,PLAS,,,,MISO) and Engineering Data CSV imports.'
      },
      {
        q: 'What is the Tangent Modulus option?',
        a: 'Bilinear kinematic hardening requires two values: Yield Stress ($S_y$) and Tangent Modulus ($E_t$). Nova calculates the optimal $E_t$ representing the post-yield slope up to ultimate tensile strength.'
      }
    ],

    references: [
      { source: 'ASME', title: 'ASME BPVC Section VIII, Division 2, Annex 3-D: Strength Parameters and Stress-Strain Curves for Numerical Analysis', edition: '2023 Edition', link: 'https://www.asme.org' },
      { source: 'API / ASME', title: 'API 579-1 / ASME FFS-1: Fitness-For-Service, Part 5 (Assessment of Plastic Collapse)', edition: '2021 Edition', link: 'https://www.api.org' },
      { source: 'WRC', title: 'WRC Bulletin 537: Precision Stress Analysis of Cylindrical Pressure Vessels', edition: 'WRC', link: 'https://www.forengineers.org' }
    ]
  }
];
