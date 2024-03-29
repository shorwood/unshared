import { SCALE_MASS } from './constants/scaleMass'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a mass from one unit to another.
 *
 * @param value The value to convert. (Default unit is kilogram)
 * @param unit The unit to convert to. (Defaults to kilogram)
 * @returns The converted value.
 * @example unitConvertMass(1, 'mg') // 0.001
 */
export function unitConvertMass(value: UnitValue<typeof SCALE_MASS>, unit: UnitSymbol<typeof SCALE_MASS>): number {
  return unitConvert(value, unit, SCALE_MASS)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert SI units to imperial units', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertMass(1, 'pound')
    expect(result).toEqual(2.2046226218487757)
  })
}
