/* eslint-disable sonarjs/cognitive-complexity */
import { UnitFactor, UnitMap, UnitSymbol } from './utils/types'

/**
 * Convert a value from one unit to another.
 *
 * @param value The value to convert.
 * @param from The unit to convert from.
 * @param to The unit to convert to.
 * @param scale A map of units and their scale.
 * @returns The converted value.
 * @example unitConvert(1, 'cm', { m: 1, cm: 0.01 }) // 100
 */
export function unitConvert<T extends UnitMap>(value: number, from: UnitSymbol<T>, to: UnitSymbol<T> | undefined, scale: T): number {
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
  const scaleFrom = scale[from]
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

/* v8 ignore start */
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

  it('should convert from base unit', () => {
    const result = unitConvert(1, 'm', 'cm', scale)
    expect(result).toEqual(100)
  })

  it('should convert to base unit', () => {
    const result = unitConvert(1, 'cm', 'm', scale)
    expect(result).toEqual(0.01)
  })

  it('should convert from base unit using a function', () => {
    const result = unitConvert(1, 'm', 'km', scale)
    expect(result).toEqual(0.001)
  })

  it('should convert to base unit using a function', () => {
    const result = unitConvert(1, 'km', 'm', scale)
    expect(result).toEqual(1000)
  })

  it('should convert to base unit from bi-directional functions', () => {
    const result = unitConvert(1, 'yard', 'm', scale)
    expect(result).toEqual(0.9144)
  })

  it('should convert a suffixed string number to base unit to bi-directional functions', () => {
    const result = unitConvert(1, undefined, 'yard', scale)
    expect(result).toEqual(1.0936132983377078)
  })

  it('should convert a suffixed string number to base unit', () => {
    const result = unitConvert(1, 'm', undefined, scale)
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
