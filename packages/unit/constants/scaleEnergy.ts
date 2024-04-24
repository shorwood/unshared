import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'

const FACTOR_EQUIVALENTS_SHORT = {
  k: 1e3,
  M: 1e6,
}

const FACTOR_EQUIVALENTS_LONG = {
  'thousand ': 1e3,
  'million ': 1e6,
}

// @see https:// www.convert-measurement-units.com/conversion-calculator.php?type=spannung

/** A map of energy units relative to a [joule](https://en.wikipedia.org/wiki/Joule). */
export const SCALE_ENERGY = {
  // --- SI units. (Joule)
  ...createScale('J', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('joules', { factors: FACTOR_BASE10_LONG }),

  // --- Electronvolt.
  ...createScale('eV', { factors: FACTOR_BASE10_SHORT, baseValue: 1.602176634e-19 }),
  ...createScale('electronvolts', { factors: FACTOR_BASE10_LONG, baseValue: 1.602176634e-19 }),

  // --- Watt-hour/second.
  ...createScale('N.m', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('Ws', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('Wh', { factors: FACTOR_BASE10_SHORT, baseValue: 3600 }),
  ...createScale('newton-meters', { factors: FACTOR_BASE10_LONG }),
  ...createScale('newton-metres', { factors: FACTOR_BASE10_LONG }),
  ...createScale('watt-seconds', { factors: FACTOR_BASE10_LONG }),
  ...createScale('watt-hours', { factors: FACTOR_BASE10_LONG, baseValue: 3600 }),

  // --- Energy equivalents. (Short)
  ...createScale('t', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 4.184e+9 }),
  ...createScale('toe', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tce', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 293071070000 }),
  ...createScale('tde', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tne', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 116415321826 }),
  ...createScale('tbde', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tbee', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('boe', { factors: FACTOR_EQUIVALENTS_SHORT, baseValue: 5861520000 }),
  ...createScale('tonnes TNT equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonnes oil equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonnes coal equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 293071070000 }),
  ...createScale('tonnes diesel equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonnes natural gas equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 116415321826 }),
  ...createScale('tonnes biodiesel equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonnes bioethanol equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('barrels oil equivalent', { factors: FACTOR_EQUIVALENTS_LONG, baseValue: 5861520000 }),

  // --- British thermal unit.
  'Btu': 1.05587e+3,
  'MMBtu': 1.05587e+12,
  'thm': 1.05587e+8,
  'quad': 1.05587e+18,

  // --- Foot-pound.
  'ft-lbf': 1.35582,
} as const
