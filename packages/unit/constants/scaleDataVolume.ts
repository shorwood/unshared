import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG_BIG, FACTOR_BASE10_SHORT_BIG, FACTOR_BASE2_LONG, FACTOR_BASE2_SHORT } from './factors'

/** A map of data volume units relative to one [bit](https://en.wikipedia.org/wiki/Bit) of information. */
export const SCALE_DATE_VOLUME_SHORT = {
  ...createScale(['b'], { factors: FACTOR_BASE10_SHORT_BIG }),
  ...createScale(['B', 'iB', 'o', 'io'], { factors: FACTOR_BASE2_SHORT }),
}

/** A map of data volume units relative to one [bit](https://en.wikipedia.org/wiki/Bit) of information. */
export const SCALE_DATA_VOLUME_LONG = {
  ...createScale(['bit'], { factors: FACTOR_BASE10_LONG_BIG }),
  ...createScale(['byte', 'octet'], { factors: FACTOR_BASE2_LONG }),
} as const

/** A map of data volume units relative to one [bit](https://en.wikipedia.org/wiki/Bit) of information. */
export const SCALE_DATA_VOLUME = {
  ...SCALE_DATE_VOLUME_SHORT,
  ...SCALE_DATA_VOLUME_LONG,
} as const
