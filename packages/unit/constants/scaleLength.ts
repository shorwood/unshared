import { createScale } from '../utils/createScale'
import { createScaleAlias } from '../utils/createScaleAlias'
import { createScaleDerived } from '../utils/createScaleDerived'
import { PREFIX_BASE10_LONG, PREFIX_BASE10_SHORT } from './prefixes'
import { SCALE_TIME } from './scaleTime'

/** A map of length units relative to 1 [meter](https://en.wikipedia.org/wiki/Meter). */
export const SCALE_LENGTH = {
  ...createScale('m', { prefixes: PREFIX_BASE10_SHORT }),
  ...createScale(['metre', 'meter'], { prefixes: PREFIX_BASE10_LONG }),

  // --- Astronomical units (Unicode).
  ...createScaleDerived({ 'l': 299792458, 'light-': 299792458 }, SCALE_TIME, { separator: '' }),
  ...createScaleAlias(['au', 'ua', 'astronomical unit'], 1.495978707e11),
  ...createScaleAlias(['pc', 'parsec'], 3.0856775814672e16),

  // // --- Bodies of the Solar System.
  ...createScaleAlias(['R⊙', 'Rsun'], 6.957e8),
  ...createScaleAlias(['R⊕', 'Rearth'], 6.371e6),
  ...createScaleAlias(['R☿', 'Rmoon'], 1.737e6),
  ...createScaleAlias(['R☿', 'Rmercury'], 2.4397e6),
  ...createScaleAlias(['R♀', 'Rvenus'], 6.0518e6),
  ...createScaleAlias(['R♂', 'Rmars'], 3.3962e6),
  ...createScaleAlias(['R♃', 'Rjupiter'], 7.1492e7),
  ...createScaleAlias(['R♄', 'Rsaturn'], 6.0268e7),
  ...createScaleAlias(['R♅', 'Ruranus'], 2.5559e7),
  ...createScaleAlias(['R♆', 'Rneptune'], 2.4746e7),
  ...createScaleAlias(['R♇', 'Rpluto'], 1.188e6),

  // --- Imperial units. (short)
  ...createScaleAlias(['th', 'thou', 'twip'], 0.0000254),
  ...createScaleAlias(['barleycorn'], 0.0003429),
  ...createScaleAlias(['in', 'inch'], 0.0254),
  ...createScaleAlias(['hh', 'hand'], 0.1016),
  ...createScaleAlias(['ft', 'foot', 'feet'], 0.3048),
  ...createScaleAlias(['yd', 'yard'], 0.9144),
  ...createScaleAlias(['ch', 'chain'], 20.1168),
  ...createScaleAlias(['fur', 'furlong'], 201.168),
  ...createScaleAlias(['mi', 'mile'], 1609.344),
  ...createScaleAlias(['lea', 'league'], 4828.032),

  // --- Nautical units.
  ...createScaleAlias(['ftm', 'fathom'], 1.8288),
  ...createScaleAlias(['nmi', 'nautical mile'], 1852),
  cable: 185.2,

  // --- Atomic units.
  lP: 1.616252e-35,

  // --- Gunter's survey units.
  link: 0.201168,
  rod: 5.0292,

  // --- Chinese units (PRC).
  毫: 3.333333333333333e-5,
  釐: 3.333333333333333e-4,
  市分: 3.333333333333333e-3,
  市寸: 3.333333333333333e-2,
  市尺: 3.333333333333333e-1,
  市丈: 3.333333333333333,
  引: 3.333333333333333e1,
  市里: 500,

} as const
