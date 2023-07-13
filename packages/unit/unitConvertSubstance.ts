import { SCALE_SUBSTANCE_AMOUNT } from './constants/scaleSubstanceAmount'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a data volume to another unit.
 *
 * @param value The value to convert.
 * @param unit The unit to convert to. (Defaults to the base unit.)
 * @returns The converted value.
 * @example unitConvertSubstance(1, 'mmol') // 1000
 */
export function unitConvertSubstance(value: UnitValue<typeof SCALE_SUBSTANCE_AMOUNT>, unit?: UnitSymbol<typeof SCALE_SUBSTANCE_AMOUNT>): number {
  return unitConvert(value, unit, SCALE_SUBSTANCE_AMOUNT)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert mol to avogadro constant', () => {
    const result = unitConvertSubstance(1, 'Na')
    expect(result).toEqual(6.2415090744607635)
  })
}
