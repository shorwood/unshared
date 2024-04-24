import { SCALE_ELECTRIC_CURRENT } from './constants/scaleElectricCurrent'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a data volume to another unit.
 *
 * @param value The value to convert. By default, this is assumed to be in SI units (amperes).
 * @param unit The unit to convert to. By default, this is assumed to be in SI units (amperes).
 * @returns The converted value.
 * @example unitConvertIntensity('1mA', 'A') // 0.001
 */
export function unitConvertIntensity(value: UnitValue<typeof SCALE_ELECTRIC_CURRENT>, unit?: UnitSymbol<typeof SCALE_ELECTRIC_CURRENT>): number {
  return unitConvert(value, unit, SCALE_ELECTRIC_CURRENT)
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should convert 1 ampere to coulomb', () => {
    const result = unitConvertIntensity(1, 'coulomb')
    expect(result).toEqual(6.2415090744607635)
  })
}
