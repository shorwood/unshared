import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_SHORT } from './prefixes'

/** A map of amount of substance units relative to a [mole](https://en.wikipedia.org/wiki/Mole_(unit)). */
export const SCALE_SUBSTANCE_AMOUNT = {
  // --- Mole (SI)
  ...createScale('mol', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('mole', { prefixes: PREFIX_BASE10_LONG }),

  // --- Avogadro constant
  ...createScale(['Na', 'L'], { prefixes: PREFIX_BASE10_SHORT, baseValue: 6.02214076e23 }),

  // --- Pound-mole
  ...createScale('lbmol', { prefixes: PREFIX_BASE10_SHORT, baseValue: 453.59237 }),
  ...createScale('pound-mole', { prefixes: PREFIX_BASE10_LONG, baseValue: 453.59237 }),
} as const
