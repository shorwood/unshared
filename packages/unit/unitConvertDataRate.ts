import { SCALE_DATA_RATE } from './constants'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a data rate to another unit.
 *
 * @param value The value to convert.
 * @param unit The unit to convert to.
 * @returns The converted value.
 * @example unitConvertDataRate(1024, 'kBps') // 1
 */
export function unitConvertDataRate(value: UnitValue<typeof SCALE_DATA_RATE>, unit?: UnitSymbol<typeof SCALE_DATA_RATE>): number {
  return unitConvert(value, unit, SCALE_DATA_RATE)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert 1024 bit per second to kilobyte per second', () => {
    const result = unitConvertDataRate(1024, 'kBps')
    expect(result).toEqual(1)
  })
}
