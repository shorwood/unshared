import { SCALE_TIME } from './constants/scaleTime'
import { unitConvert } from './unitConvert'
import { UnitSymbol } from './utils/types'

/**
 * Convert a time from one unit to another.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @returns The converted time.
 * @example unitConvertTime(60, 'sec', 'min') // 1
 */
export function unitConvertTime(value: number, from: UnitSymbol<typeof SCALE_TIME>, to?: UnitSymbol<typeof SCALE_TIME>): number {
  return unitConvert(value, from, to, SCALE_TIME)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert 60 seconds to minutes', () => {
    const result = unitConvertTime(60, 'sec', 'min')
    expect(result).toEqual(1)
  })
}
