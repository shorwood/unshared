import { Default } from '@unshared/types/Default'

/**
 * Defaut a value or object by another value or object. Meaning that if the
 * first value is `undefined` or `null`, the second value will be used instead.
 *
 * You can also defaults to nested objects by setting the `depth` to a
 * positive number.
 *
 * @param object The object to default.
 * @param defaults The object to default with.
 * @param depth If the object is nested, the depth to the defaults.
 * @returns The object with the default values applied.
 * @example defaults({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 */
export function defaults<T extends object = object>(object: Partial<T>, defaults: T, depth?: number): T
export function defaults<T extends object = object>(object: T, defaults: Partial<T>, depth?: number): T
export function defaults<T1, T2, N extends number = 0>(object: T1, defaults: T2, depth?: N): Default<T1, T2, N>
export function defaults(object: any, from: any, depth = 0): any {
  // --- Handle edge cases.
  if (typeof depth !== 'number')
    throw new TypeError('Expected depth to be a number')
  if (depth < 0)
    throw new RangeError('Expected depth to be a positive number')
  if (typeof object !== 'object' || object === null)
    return object ?? from
  if (!from) return { ...object }

  // --- Clone the object.
  object = Array.isArray(object)
    ? [...object]
    : { ...object }

  // --- Iterate over the object's properties.
  for (const key in from) {
    // --- If the value is nil, the default value.
    if (object[key] === undefined || object[key] === null)
      object[key] = from[key]

    // --- Apply defaults to nested objects.
    else if (typeof object[key] === 'object' && depth > 0)
      object[key] = defaults(object[key], from[key], depth - 1)
  }

  // --- Return the defaulted object.
  return object
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default object values to undefined properties', () => {
    const result = defaults({ a: 1 }, { a: 2, b: 3 })
    expect(result).toEqual({ a: 1, b: 3 })
    expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
  })

  it('should default object values to null properties', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = defaults({ a: null }, { a: 2, b: 3 })
    expect(result).toEqual({ a: 2, b: 3 })
    expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
  })

  it('should not default falsy object values', () => {
    const result = defaults({ a: 0 }, { a: 2, b: 3 })
    expect(result).toEqual({ a: 0, b: 3 })
    expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
  })

  it('should defaults nested objects', () => {
    const result = defaults({ a: { b: 1 } }, { a: { b: 2, c: 3 } }, 1)
    expect(result).toEqual({ a: { b: 1, c: 3 } })
    expectTypeOf(result).toEqualTypeOf<{ a: { b: number; c: number } }>()
  })

  it('should not default nested objects if depth is 0', () => {
    const result = defaults({ a: { b: 1 } }, { a: { b: 2, c: 3 } }, 0)
    expect(result).toEqual({ a: { b: 1 } })
    expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>()
  })

  it('should default array values to undefined properties', () => {
    const result = defaults([1], [2, 3])
    expect(result).toEqual([1, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should default array values to null properties', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = defaults([null], [2, 3])
    expect(result).toEqual([2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('should defaults a primitive and keep the value', () => {
    const result = defaults(1, '2')
    expect(result).toEqual(1)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should defaults a primitive and use the default', () => {
    const value = undefined as number | undefined
    const result = defaults(value, '2')
    expect(result).toEqual('2')
    expectTypeOf(result).toEqualTypeOf<number | string>()
  })
}
