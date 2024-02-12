import { SCALE_SUBSTANCE_AMOUNT } from './constants/scaleSubstanceAmount'
import { unitConvert } from './unitConvert'
import { UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a substance amount to another unit.
 *
 * @param value The value to convert.
 * @param unit The unit to convert to. (Defaults to the base unit.)
 * @returns The converted value.
 * @example unitConvertSubstanceAmount(1, 'Na') // 1000
 */
export function unitConvertSubstanceAmount(value: UnitValue<typeof SCALE_SUBSTANCE_AMOUNT>, unit?: UnitSymbol<typeof SCALE_SUBSTANCE_AMOUNT>): number {
  return unitConvert(value, unit, SCALE_SUBSTANCE_AMOUNT)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert 1 mol to avogadro constant', () => {
    const result = unitConvertSubstanceAmount(1, 'Na')
    expect(result).toEqual(1.6605390671738466e-24)
  })
}
