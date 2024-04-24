import { SCALE_DATA_RATE } from './constants'
import { unitConvert } from './unitConvert'
import { UnitSymbol } from './utils/types'

/**
 * Convert a data rate to another unit.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @returns The converted value.
 * @example unitConvertDataRate(1024, 'kbps', 'MBps') // 1
 */
export function unitConvertDataRate(value: number, from: UnitSymbol<typeof SCALE_DATA_RATE>, to?: UnitSymbol<typeof SCALE_DATA_RATE>): number {
  return unitConvert(value, from, to, SCALE_DATA_RATE)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert 1024 bit per second to kilobyte per second', () => {
    const result = unitConvertDataRate(1024, 'kbps', 'MBps')
    expect(result).toEqual(1)
  })
}
