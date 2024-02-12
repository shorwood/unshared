import { SCALE_LENGTH } from './constants/scaleLength'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a length from one unit to another.
 *
 * @param value The value to convert. By default, this is assumed to be in SI units (metres).
 * @param unit The unit to convert to. By default, this is assumed to be in SI units (metres).
 * @returns The converted length in the specified unit.
 * @example unitConvertLength(1, 'cm') // 100
 */
export function unitConvertLength(value: UnitValue<typeof SCALE_LENGTH>, unit?: UnitSymbol<typeof SCALE_LENGTH>): number {
  return unitConvert(value, unit, SCALE_LENGTH)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert SI units to imperial units', () => {
    const result = unitConvertLength(1, 'inch')
    expect(result).toEqual(39.37007874015748)
  })
}
