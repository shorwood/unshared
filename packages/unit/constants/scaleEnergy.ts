import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_SHORT } from './prefixes'

const PREFIX_EQUIVALENTS_SHORT = {
  k: 1e3,
  M: 1e6,
}

const PREFIX_EQUIVALENTS_LONG = {
  'thousand ': 1e3,
  'million ': 1e6,
}

// @see https:// www.convert-measurement-units.com/conversion-calculator.php?type=spannung

/** A map of energy units relative to a [joule](https://en.wikipedia.org/wiki/Joule). */
export const SCALE_ENERGY = {
  // --- SI units. (Joule)
  ...createScale('J', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('joule', { prefixes: PREFIX_BASE10_LONG }),

  // --- Electronvolt.
  ...createScale('eV', { prefixes: PREFIX_BASE10_SHORT, baseValue: 1.602176634e-19 }),
  ...createScale('electronvolt', { prefixes: PREFIX_BASE10_LONG, baseValue: 1.602176634e-19 }),

  // --- Watt-hour/second.
  ...createScale('N.m', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('Ws', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('Wh', { prefixes: PREFIX_BASE10_SHORT, baseValue: 3600 }),
  ...createScale('newton-meter', { prefixes: PREFIX_BASE10_LONG }),
  ...createScale('watt-second', { prefixes: PREFIX_BASE10_LONG }),
  ...createScale('watt-hour', { prefixes: PREFIX_BASE10_LONG, baseValue: 3600 }),

  // --- Energy equivalents. (Short)
  ...createScale('t', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 4.184e+9 }),
  ...createScale('toe', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tce', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 293071070000 }),
  ...createScale('tde', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tne', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 116415321826 }),
  ...createScale('tbde', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('tbee', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 41840000000 }),
  ...createScale('boe', { prefixes: PREFIX_EQUIVALENTS_SHORT, baseValue: 5861520000 }),
  ...createScale('tonne TNT equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonne oil equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonne coal equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 293071070000 }),
  ...createScale('tonne diesel equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonne natural gas equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 116415321826 }),
  ...createScale('tonne biodiesel equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('tonne bioethanol equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 41840000000 }),
  ...createScale('barrel oil equivalent', { prefixes: PREFIX_EQUIVALENTS_LONG, baseValue: 5861520000 }),

  // --- British thermal unit.
  'Btu': 1.05587e+3,
  'MMBtu': 1.05587e+12,
  'thm': 1.05587e+8,
  'quad': 1.05587e+18,

  // --- Foot-pound.
  'ft-lbf': 1.35582,
} as const
