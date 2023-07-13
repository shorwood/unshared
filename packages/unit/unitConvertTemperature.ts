import { SCALE_TEMPERATURE } from './constants/scaleTemperature'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a temperature from one unit to another.
 *
 * @param value The value to convert. (Default unit is kelvin)
 * @param unit The unit to convert to. (Defaults to kelvin)
 * @returns The converted value.
 * @example unitConvertMass(1, 'mg') // 0.001
 */
export function unitConvertTemperature(value: UnitValue<typeof SCALE_TEMPERATURE>, unit?: UnitSymbol<typeof SCALE_TEMPERATURE>): number {
  return unitConvert(value, unit, SCALE_TEMPERATURE)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert Kelvin to Celsius', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature(0, 'C')
    expect(result).toEqual(-273.15)
  })

  it('should convert Kelvin to Fahrenheit', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature(273.15, 'F')
    expect(result).toEqual(32)
  })

  it('should convert Kelvin to Delisle', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature(0, 'De')
    expect(result).toEqual(409.72499999999997)
  })

  it('should convert Celsius to Kelvin', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature('0C', 'K')
    expect(result).toEqual(273.15)
  })

  it('should convert Celsius to Fahrenheit', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature('0C', 'F')
    expect(result).toEqual(32)
  })

  it('should clamp values lower than absolute zero', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTemperature('-1000C')
    expect(result).toEqual(0)
  })
}
