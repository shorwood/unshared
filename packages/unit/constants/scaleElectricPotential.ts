import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'

/** A map of electric potential units relative to a [volt](https://en.wikipedia.org/wiki/Volt). */
export const SCALE_ELECTRIC_POTENTIAL = {
  ...createScale('V', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('volts', { factors: FACTOR_BASE10_LONG }),
} as const
