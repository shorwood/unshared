import { SCALE_ELECTRIC_CURRENT } from './constants/scaleElectricCurrent'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a data volume to another unit.
 *
 * @param value The value to convert.
 * @param unit The unit to convert to. (Defaults to the base unit.)
 * @returns The converted value.
 * @example unitConvertIntensity('1mA', 'A') // 0.001
 */
export function unitConvertIntensity(value: UnitValue<typeof SCALE_ELECTRIC_CURRENT>, unit?: UnitSymbol<typeof SCALE_ELECTRIC_CURRENT>): number {
  return unitConvert(value, unit, SCALE_ELECTRIC_CURRENT)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert ampere to exacoulomb', () => {
    const result = unitConvertIntensity(1, 'exacoulomb')
    expect(result).toEqual(6.2415090744607635)
  })
}
