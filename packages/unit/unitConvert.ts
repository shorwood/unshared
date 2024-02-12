/* eslint-disable sonarjs/cognitive-complexity */
import { UnitFactor, UnitMap, UnitSymbol, UnitValue } from './utils/types'

/**
 * Convert a value from one unit to another.
 *
 * @param value The value to convert.
 * @param to The unit to convert to. (Defaults to the base unit.)
 * @param scale A map of units and their scale.
 * @returns The converted value.
 * @example unitConvert(1, 'cm', { m: 1, cm: 0.01 }) // 100
 */
export function unitConvert<T extends UnitMap>(value: UnitValue<T>, to: UnitSymbol<T> | undefined, scale: T): number {
  // --- Parse value and unit.
  let from: string | undefined
  if (typeof value === 'string') {
    const match = value.match(/^(?<pValue>[+-]?\d+\.?\d*) *(?<pFrom>\w*)$/)
    if (!match) throw new SyntaxError(`Invalid unit value: ${value}`)
    const { pValue, pFrom } = match.groups as { pValue: string; pFrom: string }
    value = Number.parseFloat(pValue)
    from = pFrom || undefined
  }

  // --- Handle edge cases.
  if (Number.isFinite(value) === false)
    throw new TypeError('Expected value to convert to be a finite number.')
  if (typeof scale !== 'object' && scale !== null)
    throw new TypeError('Expected scale to be an object.')
  if (from !== undefined && from in scale === false)
    throw new TypeError(`Unknown unit to convert from: ${from}`)
  if (to !== undefined && to in scale === false)
    throw new TypeError(`Unknown unit to convert to: ${to}`)

  // --- Convert to base unit.
  const scaleFrom = from ? scale[from] : 1
  const baseValue = typeof scaleFrom === 'object'
    ? (typeof scaleFrom.to === 'function' ? scaleFrom.to(value) : scaleFrom.to * value)
    : (typeof scaleFrom === 'function' ? scaleFrom(value) : scaleFrom * value)

  // --- Convert to target unit.
  const scaleTo: UnitFactor = to ? scale[to] : 1

  if (typeof scaleTo === 'object') {
    return typeof scaleTo.from === 'function'
      ? scaleTo.from(baseValue)
      : baseValue / scaleTo.from
  }

  return typeof scaleTo === 'function'
    ? scaleTo(baseValue)
    : baseValue / scaleTo
}

/** c8 ignore next */
if (import.meta.vitest) {
  const scale = {
    m: 1,
    cm: 0.01,
    km: (value: number) => value * 1000,
    yard: {
      to: (value: number) => value * 0.9144,
      from: (value: number) => value / 0.9144,
    },
  }

  it('should convert a number', () => {
    const result = unitConvert(1, 'cm', scale)
    expect(result).toEqual(100)
  })

  it('should convert a suffixed string number', () => {
    const result = unitConvert('1cm', 'm', scale)
    expect(result).toEqual(0.01)
  })

  it('should convert a suffixed string number with spaces', () => {
    const result = unitConvert('1 cm', 'm', scale)
    expect(result).toEqual(0.01)
  })

  it('should convert a suffixed string number a dot', () => {
    const result = unitConvert('1.0cm', 'm', scale)
    expect(result).toEqual(0.01)
  })

  it('should convert a suffixed string number with a negative sign', () => {
    const result = unitConvert('-1cm', 'm', scale)
    expect(result).toEqual(-0.01)
  })

  it('should convert a suffixed string number with a positive sign', () => {
    const result = unitConvert('+1cm', 'm', scale)
    expect(result).toEqual(0.01)
  })

  it('should convert a number to base unit', () => {
    const result = unitConvert(1, undefined, scale)
    expect(result).toEqual(1)
  })

  it('should convert a suffixed string number to base unit using a function', () => {
    const result = unitConvert('1km', undefined, scale)
    expect(result).toEqual(1000)
  })

  it('should convert a suffixed string number to base unit from bi-directional functions', () => {
    const result = unitConvert('1yard', undefined, scale)
    expect(result).toEqual(0.9144)
  })

  it('should convert a suffixed string number to base unit to bi-directional functions', () => {
    const result = unitConvert(1, 'yard', scale)
    expect(result).toEqual(1.0936132983377078)
  })

  it('should convert a suffixed string number to base unit', () => {
    const result = unitConvert('1cm', undefined, scale)
    expect(result).toEqual(0.01)
  })

  it('should throw an error if value is not suffixed with a unit', () => {
    // @ts-expect-error: ignore
    const shoudThrow = () => unitConvert('foo', 'cm', scale)
    expect(shoudThrow).toThrowError(/value/i)
  })

  it('should throw an error if scale is not provided', () => {
    // @ts-expect-error: ignore
    const shoudThrow = () => unitConvert(1, 'cm', 'scale')
    expect(shoudThrow).toThrowError(/scale/i)
  })

  it('should throw an error if "from" is not in scale', () => {
    // @ts-expect-error: ignore
    const shoudThrow = () => unitConvert('1m', 'cm', { cm: 1 })
    expect(shoudThrow).toThrowError(/from/)
  })

  it('should throw an error if "to" is not in scale', () => {
    // @ts-expect-error: ignore
    const shoudThrow = () => unitConvert(1, 'cm', { m: 1 })
    expect(shoudThrow).toThrowError(/to/)
  })
}
