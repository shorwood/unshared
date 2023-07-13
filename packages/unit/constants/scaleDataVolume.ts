import { createScale } from '../utils/createScale'
import { PREFIX_BASE10_LONG_BIG, PREFIX_BASE10_SHORT_BIG, PREFIX_BASE2_LONG, PREFIX_BASE2_SHORT } from './prefixes'

/** A map of data volume units relative to one [bit](https://en.wikipedia.org/wiki/Bit) of information. */
export const SCALE_DATA_VOLUME = {
  ...createScale(['bit'], { prefixes: PREFIX_BASE10_LONG_BIG }),
  ...createScale(['b', 'bit'], { prefixes: PREFIX_BASE10_SHORT_BIG }),
  ...createScale(['byte', 'octet'], { prefixes: PREFIX_BASE2_LONG }),
  ...createScale(['B', 'iB', 'o', 'io'], { prefixes: PREFIX_BASE2_SHORT }),
} as const
