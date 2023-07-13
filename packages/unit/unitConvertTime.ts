import { SCALE_TIME } from './constants/scaleTime'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a time from one unit to another.
 *
 * @param value The value to convert. (Default unit is seconds.)
 * @param unit The unit to convert to. (Defaults to seconds.)
 * @returns The converted time.
 * @example unitConvertTime(60, 'min') // 1
 */
export function unitConvertTime(value: UnitValue<typeof SCALE_TIME>, unit: UnitSymbol<typeof SCALE_TIME>): number {
  return unitConvert(value, unit, SCALE_TIME)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert 60 seconds to minutes', () => {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    const result = unitConvertTime(60, 'min')
    expect(result).toEqual(1)
  })
}
