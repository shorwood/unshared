import { SCALE_DATA_VOLUME } from './constants/scaleDataVolume'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a data volume to another unit.
 *
 * @param value The value to convert.
 * @param unit The unit to convert to.
 * @returns The converted value.
 * @example unitConvertDataVolume(1024, 'kB') // 1
 */
export function unitConvertDataVolume(value: UnitValue<typeof SCALE_DATA_VOLUME>, unit?: UnitSymbol<typeof SCALE_DATA_VOLUME>): number {
  return unitConvert(value, unit, SCALE_DATA_VOLUME)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert 1024 bit to kilobyte', () => {
    const result = unitConvertDataVolume('1024kB')
    expect(result).toEqual(1)
  })
}
