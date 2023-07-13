import { createScale } from '../utils/createScale'
import { createScaleAlias } from '../utils/createScaleAlias'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_LONG_BIG, PREFIX_BASE10_SHORT, PREFIX_BASE10_SHORT_BIG } from './prefixes'

/** A map of mass units relative to a [kilogram](https://en.wikipedia.org/wiki/Gram). */
export const SCALE_MASS = {
  // --- SI
  ...createScale('g', { baseValue: 1e-3, prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('t', { baseValue: 1e+3, prefixes: PREFIX_BASE10_SHORT_BIG }),
  ...createScale('gram', { baseValue: 1e-3, prefixes: PREFIX_BASE10_LONG }),
  ...createScale('tonne', { baseValue: 1e+3, prefixes: PREFIX_BASE10_LONG_BIG }),

  // --- Electron volt per c².
  ...createScale('eV/c²', { baseValue: 1.782661845e-36, prefixes: PREFIX_BASE10_SHORT_BIG }),

  // --- Atomic mass unit.
  ...createScale(['Da', 'amu', 'u'], { baseValue: 1.6605390666e-27, prefixes: PREFIX_BASE10_SHORT_BIG }),
  ...createScale('dalton', { baseValue: 1.6605390666e-27, prefixes: PREFIX_BASE10_LONG_BIG }),

  // --- Imperial units. (Avoirdupois)
  ...createScaleAlias(['gr', 'grain'], 6.479891e-5),
  ...createScaleAlias(['dr', 'dram', 'drachm'], 1.7718451953125e-3),
  ...createScaleAlias(['oz', 'ounce'], 2.8349523125e-2),
  ...createScaleAlias(['lb', 'pound'], 0.45359237),
  ...createScaleAlias(['st', 'stone'], 6.35029318),
  ...createScaleAlias(['cwt', 'hundredweight'], 50.80234544),
  ...createScaleAlias(['ton'], 1016.0469088),
  ...createScaleAlias(['slug'], 14.5939029372064),

  // --- Imperial units. (Troy)
  // ...createScaleAlias(['grt', 'grain troy'], 6.479891e-5),
  // ...createScaleAlias(['drt', 'dram troy'], 1.7718451953125e-3),
  // ...createScaleAlias(['ozt', 'ounce troy'], 3.1103475e-2),
  // ...createScaleAlias(['lbt', 'pound troy'], 0.3732417216),
  // ...createScaleAlias(['stt', 'stone troy'], 6.35029318 * 12),
  // ...createScaleAlias(['cwtt', 'hundredweight troy'], 50.80234544 * 12),
  // ...createScaleAlias(['tont', 'ton troy'], 1016.0469088 * 12),
  // ...createScaleAlias(['slgt', 'slug troy'], 14.5939029372064 * 12),
  // ...createScaleAlias(['qr', 'quarter'], 1016.0469088 * 12 * 4),

  // --- Diamond.
  ...createScaleAlias(['ct', 'carat'], 2e-4),

  // --- Celestial bodies.
  ...createScaleAlias(['M⊙', 'Msun'], 1.98847e+30),
  ...createScaleAlias(['M⊕', 'Mearth'], 5.97237e+24),
  ...createScaleAlias(['M☽', 'Mmoon'], 7.34767309e+22),
  ...createScaleAlias(['M☿', 'Mmercury'], 3.3011e+23),
  ...createScaleAlias(['M♀', 'Mvenus'], 4.8675e+24),
  ...createScaleAlias(['M♂', 'Mmars'], 6.4171e+23),
  ...createScaleAlias(['M♃', 'Mjupiter'], 1.8986e+27),
  ...createScaleAlias(['M♄', 'Msaturn'], 5.6834e+26),
  ...createScaleAlias(['M♅', 'Muranus'], 8.681e+25),
  ...createScaleAlias(['M♆', 'Mneptune'], 1.0243e+26),
  ...createScaleAlias(['M♇', 'Mpluto'], 1.303e+22),

  // --- Planck mass.
  mP: 2.17643424e-8, // Planck mass

  // --- Chinese units (PRC).
  市厘: 5e-5,
  市分: 5e-4,
  市錢: 5e-3,
  市兩: 5e-2,
  市斤: 5e-1,
  市擔: 5e+1,
} as const
