import { SCALE_DATA_VOLUME } from './constants/scaleDataVolume'
import { unitConvert } from './unitConvert'
import { UnitSymbol } from './utils/types'

/**
 * Convert a data volume to another unit.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @returns The converted value.
 * @example unitConvertDataVolume(1024, 'kB') // 1
 */
export function unitConvertDataVolume(value: number, from: UnitSymbol<typeof SCALE_DATA_VOLUME>, to?: UnitSymbol<typeof SCALE_DATA_VOLUME>): number {
  return unitConvert(value, from, to, SCALE_DATA_VOLUME)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert 1024 bit to kilobyte', () => {
    const result = unitConvertDataVolume(1024, 'b', 'kB')
    expect(result).toEqual(1)
  })
}
