import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'

/** A map of electric current units relative to an [ampere](https://en.wikipedia.org/wiki/Ampere). */
export const SCALE_ELECTRIC_CURRENT_SHORT = {
  ...createScale('A', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('C', { factors: FACTOR_BASE10_SHORT, baseValue: 1.602176634e-19 }),
} as const

/** A map of electric current units relative to an [ampere](https://en.wikipedia.org/wiki/Ampere). */
export const SCALE_ELECTRIC_CURRENT_LONG = {
  ...createScale('ampere', { factors: FACTOR_BASE10_LONG }),
  ...createScale('coulomb', { factors: FACTOR_BASE10_LONG, baseValue: 1.602176634e-19 }),
} as const

/** A map of electric current units relative to an [ampere](https://en.wikipedia.org/wiki/Ampere). */
export const SCALE_ELECTRIC_CURRENT = {
  ...SCALE_ELECTRIC_CURRENT_SHORT,
  ...SCALE_ELECTRIC_CURRENT_LONG,
} as const
