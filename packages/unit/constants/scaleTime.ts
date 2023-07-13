import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_SHORT, PREFIX_YEAR_LONG, PREFIX_YEAR_SHORT } from './prefixes'

function key<P extends string, U extends string>(prefix: P, unit: U) {
  const unitCapitalized = unit.length > 0
    ? unit.charAt(0).toUpperCase() + unit.slice(1)
    : unit.toUpperCase()
  return `${prefix}${unitCapitalized}` as `${P}${Capitalize<U>}`
}

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME = {
  // --- SI units.
  ...createScale('s', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale('second', { prefixes: PREFIX_BASE10_LONG }),

  // --- Year types.
  ...createScale('', { prefixes: { ...PREFIX_YEAR_SHORT, ...PREFIX_YEAR_LONG } }),
  ...createScale('leap', { prefixes: PREFIX_YEAR_LONG, baseValue: 366 / 365, key }),
  ...createScale('julian', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.25 / 365, key }),
  ...createScale('tropical', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.24219 / 365, key }),
  ...createScale('gregorian', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.2425 / 365, key }),
  ...createScale('gaussian', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.259645 / 365, key }),
  ...createScale('sidereal', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.256363004 / 365, key }),
  ...createScale('lunar', { prefixes: PREFIX_YEAR_LONG, baseValue: 29.530588853 / 365, key }),
  ...createScale('anomalistic', { prefixes: PREFIX_YEAR_LONG, baseValue: 365.259636 / 365, key }),

  // --- Planck time.
  tP: 5.3912476e-44,
} as const
