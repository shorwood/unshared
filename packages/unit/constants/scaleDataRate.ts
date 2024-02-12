import { createScaleDerived } from '../utils/createScaleDerived'
import { SCALE_DATA_VOLUME_LONG, SCALE_DATE_VOLUME_SHORT } from './scaleDataVolume'
import { SCALE_TIME_SI_LONG, SCALE_TIME_SI_SHORT } from './scaleTime'

/** A map of data rate units relative to one [bit](https://en.wikipedia.org/wiki/Bit) per second. */
export const SCALE_DATA_RATE = {
  ...createScaleDerived(SCALE_DATE_VOLUME_SHORT, SCALE_TIME_SI_SHORT, { separator: '/' }),
  ...createScaleDerived(SCALE_DATE_VOLUME_SHORT, SCALE_TIME_SI_SHORT, { separator: 'p' }),
  ...createScaleDerived(SCALE_DATA_VOLUME_LONG, SCALE_TIME_SI_LONG, { separator: ' per ' }),
} as const
