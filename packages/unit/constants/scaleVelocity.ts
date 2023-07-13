import { createScaleDerived } from '../utils/createScaleDerived'
import { SCALE_LENGTH } from './scaleLength'
import { SCALE_TIME } from './scaleTime'

/** A derived map of velocity units relative to a [meter per second](https://en.wikipedia.org/wiki/Metre_per_second). */
export const SCALE_VELOCITY = {
  ...createScaleDerived(SCALE_LENGTH, SCALE_TIME),

  // --- Knot
  kn: 0.514773,
  knot: 0.514773,

  // --- Speed of light
  c: 299792458,

  // --- Speed of sound
  mach: 340.29,
} as const
