import { createScaleDerived } from '../utils/createScaleDerived'
import { SCALE_DATA_VOLUME } from './scaleDataVolume'
import { SCALE_TIME } from './scaleTime'

/** A map of data rate units relative to one [bit](https://en.wikipedia.org/wiki/Bit) per second. */
export const SCALE_DATA_RATE = createScaleDerived(SCALE_DATA_VOLUME, SCALE_TIME)
