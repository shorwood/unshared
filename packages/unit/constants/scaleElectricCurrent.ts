import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_LONG_BIG, PREFIX_BASE10_SHORT, PREFIX_BASE10_SHORT_BIG } from './prefixes'

/** A map of electric current units relative to an [ampere](https://en.wikipedia.org/wiki/Ampere). */
export const SCALE_ELECTRIC_CURRENT = {
  ...createScale('A', { prefixes: PREFIX_BASE10_SHORT_BIG }),
  ...createScale('C', { prefixes: PREFIX_BASE10_SHORT, baseValue: 1.602176634e-19 }),
  ...createScale('ampere', { prefixes: PREFIX_BASE10_LONG_BIG }),
  ...createScale('coulomb', { prefixes: PREFIX_BASE10_LONG, baseValue: 1.602176634e-19 }),
} as const
