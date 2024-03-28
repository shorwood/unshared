import { createScale } from '../utils/createScale'
import { createScaleAlias } from '../utils/createScaleAlias'
import { createScaleDerived } from '../utils/createScaleDerived'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'
import { SCALE_TIME } from './scaleTime'

/** A map of frequency units relative to an [hertz](https://en.wikipedia.org/wiki/Hertz). */
export const SCALE_FREQUENCY = {
  // --- Hertz (SI)
  ...createScale('Hz', { factors: FACTOR_BASE10_SHORT }),
  ...createScale('hertz', { factors: FACTOR_BASE10_LONG }),

  // --- Per X
  // eslint-disable-next-line quote-props
  ...createScaleDerived({ '1': 1 }, SCALE_TIME),

  // --- Planck frequency
  ...createScaleAlias(['wP', 'planck frequency'], 1.854858e+43),
} as const
