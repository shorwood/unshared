import { SCALE_LENGTH } from './constants/scaleLength'
import { unitConvert } from './unitConvert'
import { UnitSymbol } from './utils/types'

/**
 * Convert a length from one unit to another.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @returns The converted length in the specified unit.
 * @example unitConvertLength(1, 'm', 'ft') // 3.280839895013123
 */
export function unitConvertLength(value: number, from: UnitSymbol<typeof SCALE_LENGTH>, to?: UnitSymbol<typeof SCALE_LENGTH>): number {
  return unitConvert(value, from, to, SCALE_LENGTH)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert SI units to imperial units', () => {
    const result = unitConvertLength(1, 'meter', 'feet')
    expect(result).toEqual(3.280839895013123)
  })
}
