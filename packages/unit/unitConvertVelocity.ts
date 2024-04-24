import { SCALE_VELOCITY } from './constants'
import { unitConvert } from './unitConvert'
import { UnitSymbol } from './utils/types'

/**
 * Convert a velocity from one unit to another.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @returns The converted length in the specified unit.
 * @example unitConvertVelocity(100, 'km/h', 'mile/h') // 62.13711922373339
 */
export function unitConvertVelocity(value: number, from: UnitSymbol<typeof SCALE_VELOCITY>, to?: UnitSymbol<typeof SCALE_VELOCITY>): number {
  return unitConvert(value, from, to, SCALE_VELOCITY)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert SI units to imperial units', () => {
    const result = unitConvertVelocity(100, 'km/h', 'mile/h')
    expect(result).toEqual(62.13711922373339)
  })
}
