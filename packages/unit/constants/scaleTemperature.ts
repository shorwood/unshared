import { createScale } from '../utils/createScale'
import { FACTOR_BASE10_LONG, FACTOR_BASE10_SHORT } from './factors'

const baseValueKelvin = (value: number) => Math.max(value, 0)

const baseValueCelsius = {
  to: (value: number) => Math.max(value + 273.15, 0),
  from: (value: number) => Math.max(value - 273.15, -273.15),
}

const baseValueFahrenheit = {
  to: (value: number) => Math.max((value - 32) / 1.8 + 273.15, 0),
  from: (value: number) => Math.max((value - 273.15) * 1.8 + 32, -459.67),
}

const baseValueDelisle = {
  to: (value: number) => Math.max(0, 373.15 - value / 1.5),
  from: (value: number) => Math.min(559.725, 373.15 - value * 1.5),
}

export const SCALE_TEMPERATURE = {
  // --- SI units
  ...createScale('K', { factors: FACTOR_BASE10_SHORT, baseValue: baseValueKelvin }),
  ...createScale('C', { factors: FACTOR_BASE10_SHORT, baseValue: baseValueCelsius }),
  ...createScale(['kelvin'], { factors: FACTOR_BASE10_LONG, baseValue: baseValueKelvin }),
  ...createScale(['celsius', 'centigrade'], { factors: FACTOR_BASE10_LONG, baseValue: baseValueCelsius }),

  // --- Imperial units.
  ...createScale('F', { factors: FACTOR_BASE10_SHORT, baseValue: baseValueFahrenheit }),
  ...createScale('fahrenheit', { factors: FACTOR_BASE10_LONG, baseValue: baseValueFahrenheit }),

  // --- Delisle units.
  De: baseValueDelisle,
  delisle: baseValueDelisle,

  // --- Rankine units.
  rankine: (value: number) => Math.max(value * 1.8, 0),
  newton: (value: number) => Math.max(value * 100 / 33, 0),

  // --- Atomic units.
  TP: (value: number) => Math.max(value * 1.416808e32, 0), // Planck temperature
}
