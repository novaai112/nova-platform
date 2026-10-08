// Engineering Units Data & Conversion Engine
// Verified against NIST Special Publication 811 & ASME Section II-D Metric / Customary Conventions

export const UNIT_CATEGORIES = [
  {
    id: 'length',
    name: 'Length & Dimensions',
    symbol: 'L',
    description: 'Vessel shell diameter, nozzle projection, plate thickness, bolt dimensions, and weld sizes.',
    baseUnit: 'mm',
    units: [
      { id: 'mm', label: 'Millimeter (mm)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'cm', label: 'Centimeter (cm)', toBase: 10, fromBase: 0.1, system: 'Metric' },
      { id: 'm', label: 'Meter (m)', toBase: 1000, fromBase: 0.001, system: 'SI Metric' },
      { id: 'in', label: 'Inch (in)', toBase: 25.4, fromBase: 1 / 25.4, system: 'US Customary' },
      { id: 'ft', label: 'Foot (ft)', toBase: 304.8, fromBase: 1 / 304.8, system: 'US Customary' }
    ],
    example: '1 in = 25.4 mm (Exact)'
  },
  {
    id: 'pressure',
    name: 'Pressure & Design Pressures',
    symbol: 'P',
    description: 'Internal design pressure, external vacuum pressure, hydrotest pressure, and MAWP.',
    baseUnit: 'MPa',
    units: [
      { id: 'MPa', label: 'Megapascal (MPa)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'bar', label: 'Bar (bar)', toBase: 0.1, fromBase: 10, system: 'Metric' },
      { id: 'psi', label: 'Pounds per square inch (psi)', toBase: 0.006894757, fromBase: 145.0377, system: 'US Customary' },
      { id: 'kPa', label: 'Kilopascal (kPa)', toBase: 0.001, fromBase: 1000, system: 'SI Metric' },
      { id: 'Pa', label: 'Pascal (Pa / N/m²)', toBase: 1e-6, fromBase: 1e6, system: 'SI Metric' },
      { id: 'kgf_cm2', label: 'Kilogram-force/cm² (kgf/cm²)', toBase: 0.0980665, fromBase: 10.19716, system: 'Technical' }
    ],
    example: '100 psi = 0.689476 MPa (approx. 6.895 bar)'
  },
  {
    id: 'stress',
    name: 'Stress & Strength',
    symbol: 'σ, S',
    description: 'Membrane stress, bending stress, allowable design stress (S), yield strength (Sy), and ultimate tensile strength (Su).',
    baseUnit: 'MPa',
    units: [
      { id: 'MPa', label: 'Megapascal (MPa = N/mm²)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'ksi', label: 'Kilopounds per square inch (ksi)', toBase: 6.894757, fromBase: 0.1450377, system: 'US Customary' },
      { id: 'psi', label: 'Pounds per square inch (psi)', toBase: 0.006894757, fromBase: 145.0377, system: 'US Customary' },
      { id: 'Pa', label: 'Pascal (Pa)', toBase: 1e-6, fromBase: 1e6, system: 'SI Metric' }
    ],
    example: '20 ksi = 137.895 MPa (SA-516 Gr. 70 ambient allowable stress)'
  },
  {
    id: 'force',
    name: 'Mechanical Force & Piping Reactions',
    symbol: 'F, P, V',
    description: 'Radial thrust force, longitudinal and circumferential shears, lifting load, and bolt pretension.',
    baseUnit: 'N',
    units: [
      { id: 'N', label: 'Newton (N)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'kN', label: 'Kilonewton (kN)', toBase: 1000, fromBase: 0.001, system: 'SI Metric' },
      { id: 'lbf', label: 'Pound-force (lbf)', toBase: 4.448222, fromBase: 0.224809, system: 'US Customary' },
      { id: 'kgf', label: 'Kilogram-force (kgf)', toBase: 9.80665, fromBase: 0.101972, system: 'Technical' }
    ],
    example: '10 kN = 10,000 N = 2,248.09 lbf'
  },
  {
    id: 'moment',
    name: 'Bending & Torsional Moments',
    symbol: 'M',
    description: 'Longitudinal, circumferential, and torsional nozzle moments, flange design moments, saddle bending moments.',
    baseUnit: 'N_mm',
    units: [
      { id: 'N_mm', label: 'Newton-millimeter (N·mm)', toBase: 1, fromBase: 1, system: 'SI FEA Standard' },
      { id: 'N_m', label: 'Newton-meter (N·m)', toBase: 1000, fromBase: 0.001, system: 'SI Metric' },
      { id: 'kN_m', label: 'Kilonewton-meter (kN·m)', toBase: 1e6, fromBase: 1e-6, system: 'SI Metric' },
      { id: 'lbf_in', label: 'Pound-force inch (lbf·in)', toBase: 112.9848, fromBase: 0.00885075, system: 'US Customary' },
      { id: 'lbf_ft', label: 'Pound-force foot (lbf·ft)', toBase: 1355.818, fromBase: 0.000737562, system: 'US Customary' }
    ],
    example: '1 kN·m = 1,000 N·m = 1,000,000 N·mm = 737.562 lbf·ft'
  },
  {
    id: 'temperature',
    name: 'Temperature & Thermal Fields',
    symbol: 'T',
    description: 'Design temperature, operating temperature, PWHT soaking temperature, and MDMT limits.',
    baseUnit: 'C',
    isSpecial: true,
    units: [
      { id: 'C', label: 'Degrees Celsius (°C)', system: 'Metric / SI' },
      { id: 'F', label: 'Degrees Fahrenheit (°F)', system: 'US Customary' },
      { id: 'K', label: 'Kelvin (K)', system: 'SI Thermodynamic' }
    ],
    convert: (val, from, to) => {
      let cVal = val;
      if (from === 'F') cVal = (val - 32) * (5 / 9);
      else if (from === 'K') cVal = val - 273.15;
      
      if (to === 'C') return cVal;
      if (to === 'F') return (cVal * 9) / 5 + 32;
      if (to === 'K') return cVal + 273.15;
      return cVal;
    },
    example: '200°C = 392°F = 473.15 K'
  },
  {
    id: 'mass',
    name: 'Mass & Equipment Weight',
    symbol: 'm, W',
    description: 'Vessel dry empty weight, hydrostatic water test weight, operating fluid inventory.',
    baseUnit: 'kg',
    units: [
      { id: 'kg', label: 'Kilogram (kg)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'g', label: 'Gram (g)', toBase: 0.001, fromBase: 1000, system: 'SI Metric' },
      { id: 'lb', label: 'Pound mass (lb / lbm)', toBase: 0.4535924, fromBase: 2.204623, system: 'US Customary' },
      { id: 'tonne', label: 'Metric Ton (t / 1,000 kg)', toBase: 1000, fromBase: 0.001, system: 'Metric' }
    ],
    example: '1 tonne = 1,000 kg = 2,204.62 lb'
  },
  {
    id: 'density',
    name: 'Density & Specific Weight',
    symbol: 'ρ',
    description: 'Steel material density, internal fluid inventory density, refractory insulation density.',
    baseUnit: 'kg_m3',
    units: [
      { id: 'kg_m3', label: 'Kilogram/cubic meter (kg/m³)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'kg_mm3', label: 'Kilogram/cubic millimeter (kg/mm³)', toBase: 1e9, fromBase: 1e-9, system: 'SI FEA mm' },
      { id: 'g_cm3', label: 'Gram/cubic centimeter (g/cm³)', toBase: 1000, fromBase: 0.001, system: 'Metric' },
      { id: 'lb_in3', label: 'Pounds/cubic inch (lb/in³)', toBase: 27679.9, fromBase: 0.0000361273, system: 'US Customary' }
    ],
    example: 'Carbon steel: 7,850 kg/m³ = 7.85 g/cm³ = 7.85e-9 tonne/mm³ = 0.2836 lb/in³'
  },
  {
    id: 'modulus',
    name: 'Modulus of Elasticity (Young’s Modulus)',
    symbol: 'E',
    description: 'Material stiffness at ambient and operating temperatures per ASME Section II-D Table TM-1.',
    baseUnit: 'GPa',
    units: [
      { id: 'GPa', label: 'Gigapascal (GPa)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'MPa', label: 'Megapascal (MPa = N/mm²)', toBase: 0.001, fromBase: 1000, system: 'SI FEA mm' },
      { id: 'ksi', label: 'Kilopounds per square inch (ksi)', toBase: 0.006894757, fromBase: 145.0377, system: 'US Customary' },
      { id: 'Mpsi', label: 'Million psi (10⁶ psi)', toBase: 6.894757, fromBase: 0.1450377, system: 'US Customary' }
    ],
    example: 'Carbon steel at 20°C: 200 GPa = 200,000 MPa = 29.0 Mpsi'
  },
  {
    id: 'thermal_expansion',
    name: 'Coefficient of Thermal Expansion',
    symbol: 'α',
    description: 'Instantaneous and mean thermal expansion rate per ASME Section II-D Table TE-1.',
    baseUnit: 'um_m_C',
    units: [
      { id: 'um_m_C', label: 'Microstrain/°C (10⁻⁶/°C or µm/m·°C)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'per_C', label: 'Per degree Celsius (1/°C)', toBase: 1e6, fromBase: 1e-6, system: 'SI' },
      { id: 'um_m_F', label: 'Microstrain/°F (10⁻⁶/°F or µin/in·°F)', toBase: 1.8, fromBase: 1 / 1.8, system: 'US Customary' }
    ],
    example: 'Carbon steel at 200°C: 12.8 × 10⁻⁶ /°C = 7.11 × 10⁻⁶ /°F'
  },
  {
    id: 'thermal_conductivity',
    name: 'Thermal Conductivity',
    symbol: 'k',
    description: 'Material heat conduction coefficient per ASME Section II-D Table TCD-1 for Hot Box and thermal FEA.',
    baseUnit: 'W_mK',
    units: [
      { id: 'W_mK', label: 'Watt/(meter·Kelvin) (W/m·K)', toBase: 1, fromBase: 1, system: 'SI Metric' },
      { id: 'W_mmC', label: 'Watt/(mm·°C) (W/mm·°C)', toBase: 1000, fromBase: 0.001, system: 'SI FEA mm' },
      { id: 'Btu_hr_ft_F', label: 'Btu/(hour·foot·°F) (Btu/h·ft·°F)', toBase: 1.730735, fromBase: 0.577789, system: 'US Customary' }
    ],
    example: 'Carbon steel at 100°C: 50.0 W/m·K = 28.9 Btu/(h·ft·°F) = 0.05 W/mm·°C'
  },
  {
    id: 'poisson',
    name: 'Poisson’s Ratio',
    symbol: 'ν',
    description: 'Ratio of transverse contraction to longitudinal extension under unconstrained axial load.',
    baseUnit: 'dimensionless',
    units: [
      { id: 'dimensionless', label: 'Dimensionless (–)', toBase: 1, fromBase: 1, system: 'Universal' }
    ],
    example: 'Structural Steel: 0.30 | Stainless Steel 304/316: 0.31 | Concrete: 0.15'
  }
];

export const UNITS_DATA = UNIT_CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = {
    ...cat,
    units: cat.units.map(u => ({
      ...u,
      symbol: u.id,
      name: u.label
    }))
  };
  return acc;
}, {});

export function convertUnit(value, fromUnitId, toUnitId, categoryId) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  if (fromUnitId === toUnitId) return Number(num.toFixed(4)).toString();

  const cat = UNIT_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return Number(num.toFixed(4)).toString();

  if (cat.isSpecial && cat.convert) {
    const res = cat.convert(num, fromUnitId, toUnitId);
    return typeof res === 'number' 
      ? (Math.abs(res) < 0.0001 || Math.abs(res) > 99999 ? res.toExponential(4) : Number(res.toFixed(4)).toString())
      : String(res);
  }

  const fromUnit = cat.units.find(u => u.id === fromUnitId);
  const toUnit = cat.units.find(u => u.id === toUnitId);

  if (!fromUnit || !toUnit) return Number(num.toFixed(4)).toString();

  const baseValue = num * fromUnit.toBase;
  const result = baseValue * toUnit.fromBase;
  return Math.abs(result) < 0.0001 || Math.abs(result) > 99999 
    ? result.toExponential(4) 
    : Number(result.toFixed(4)).toString();
}

export const CONSISTENT_UNIT_SYSTEMS = [
  {
    name: 'Standard FEA Engineering System (Recommended for Nova)',
    length: 'mm',
    force: 'N',
    mass: 'tonne (10³ kg)',
    time: 's',
    stress: 'MPa (N/mm²)',
    energy: 'mJ (N·mm)',
    density: 'tonne/mm³ (7.85e-9 for steel)',
    acceleration: 'mm/s² (9,806.65 mm/s²)',
    notes: 'Direct 1:1 compatibility with ANSYS Mechanical and Abaqus standard mm-t-s-N models. Stress is directly in MPa without conversion factors.'
  },
  {
    name: 'Standard SI Metric (MKS)',
    length: 'm',
    force: 'N',
    mass: 'kg',
    time: 's',
    stress: 'Pa (N/m²)',
    energy: 'J (N·m)',
    density: 'kg/m³ (7,850 for steel)',
    acceleration: 'm/s² (9.80665 m/s²)',
    notes: 'Thermodynamically rigorous. Stresses are very large numbers (e.g. 200,000,000 Pa), requiring division by 10⁶ for engineering MPa.'
  },
  {
    name: 'US Customary Engineering System',
    length: 'in',
    force: 'lbf',
    mass: 'lbm or slinch (lbf·s²/in)',
    time: 's',
    stress: 'psi or ksi (1,000 psi)',
    energy: 'lbf·in',
    density: 'lb/in³ (0.2836 for steel)',
    acceleration: 'in/s² (386.088 in/s²)',
    notes: 'Governs ASME VIII-1 Section II-D Customary tables. Requires gravitational constant gc = 386.088 in/s² for dynamic simulations.'
  }
];
