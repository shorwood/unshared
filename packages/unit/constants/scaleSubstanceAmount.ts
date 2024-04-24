import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'

/** A map of amount of substance units relative to a [mole](https://en.wikipedia.org/wiki/Mole_(unit)). */
export const SCALE_SUBSTANCE_AMOUNT = {
  // --- Mole (SI)
  ...createScale('mol', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('mole', { factors: FACTOR_BASE10_LONG }),

  // --- Avogadro constant
  ...createScale(['Na', 'L'], { factors: FACTOR_BASE10_SHORT, baseValue: 6.02214076e23 }),

  // --- Pound-mole
  ...createScale('lbmol', { factors: FACTOR_BASE10_SHORT, baseValue: 453.59237 }),
  ...createScale('pound-mole', { factors: FACTOR_BASE10_LONG, baseValue: 453.59237 }),
} as const
