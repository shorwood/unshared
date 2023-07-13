import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_SHORT } from './prefixes'

/** A map of electric potential units relative to a [volt](https://en.wikipedia.org/wiki/Volt). */

export const SCALE_ELECTRIC_POTENTIAL = {
  ...createScale('V', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('volt', { prefixes: PREFIX_BASE10_LONG }),
} as const
