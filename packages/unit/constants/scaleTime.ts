import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT, FACTOR_YEAR_LONG, FACTOR_YEAR_SHORT } from './factors'

function key<P extends string, U extends string>(prefix: P, unit: U) {
  const unitCapitalized = unit.length > 0
    ? unit.charAt(0).toUpperCase() + unit.slice(1)
    : unit.toUpperCase()
  return `${prefix}${unitCapitalized}` as `${P}${Capitalize<U>}`
}

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME_SI_SHORT = {
  ...createScale('s', { factors: FACTOR_BASE10_SHORT }),
  ...FACTOR_YEAR_SHORT,
}

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME_SI_LONG = {
  ...createScale('second', { factors: FACTOR_BASE10_LONG }),
  ...FACTOR_YEAR_LONG,
}

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME_PLANCK = {
  ...createScale('planck', { factors: FACTOR_BASE10_LONG, baseValue: 5.3912476e-44 }),
  ...createScale('tP', { factors: FACTOR_BASE10_SHORT, baseValue: 5.3912476e-44 }),
} as const

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME_YEAR = {
  ...createScale('leap', { factors: FACTOR_YEAR_LONG, baseValue: 366 / 365, key }),
  ...createScale('julian', { factors: FACTOR_YEAR_LONG, baseValue: 365.25 / 365, key }),
  ...createScale('tropical', { factors: FACTOR_YEAR_LONG, baseValue: 365.24219 / 365, key }),
  ...createScale('gregorian', { factors: FACTOR_YEAR_LONG, baseValue: 365.2425 / 365, key }),
  ...createScale('gaussian', { factors: FACTOR_YEAR_LONG, baseValue: 365.259645 / 365, key }),
  ...createScale('sidereal', { factors: FACTOR_YEAR_LONG, baseValue: 365.256363004 / 365, key }),
  ...createScale('lunar', { factors: FACTOR_YEAR_LONG, baseValue: 29.530588853 / 365, key }),
  ...createScale('anomalistic', { factors: FACTOR_YEAR_LONG, baseValue: 365.259636 / 365, key }),
} as const

/** A map of duration units relative to a [second](https://en.wikipedia.org/wiki/Second). */
export const SCALE_TIME = {
  ...SCALE_TIME_SI_SHORT,
  ...SCALE_TIME_SI_LONG,
  ...SCALE_TIME_YEAR,
  ...SCALE_TIME_PLANCK,
} as const
