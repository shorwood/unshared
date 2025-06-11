import { castObjectToArray } from './castObjectToArray'

describe('castObjectToArray', () => {
  it('should cast an object with number keys to an array', () => {
    const object = { 0: 'foo', 1: 'bar', 2: 'baz' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual(['foo', 'bar', 'baz'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle sparse objects with missing keys', () => {
    const object = { 0: 'foo', 2: 'baz', 4: 'qux' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual(['foo', undefined, 'baz', undefined, 'qux'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle objects with non-sequential keys', () => {
    const object = { 5: 'five', 1: 'one', 3: 'three' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual([undefined, 'one', undefined, 'three', undefined, 'five'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle empty object', () => {
    const object = {}
    const result = castObjectToArray(object)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<unknown[]>()
  })

  it('should handle object with no numeric keys', () => {
    const object = { foo: 'bar', baz: 'qux' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle object with mixed key types', () => {
    const object = { 0: 'zero', 1: 'one', foo: 'bar', 2: 'two' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual(['zero', 'one', 'two'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle object with negative number keys', () => {
    const object = { '-1': 'negative', '0': 'zero', '1': 'one' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual(['zero', 'one'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })

  it('should handle null input', () => {
    // @ts-expect-error: invalid input type
    const result = castObjectToArray(null)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<unknown[]>()
  })

  it('should handle undefined input', () => {
    // @ts-expect-error: invalid input type
    const result = castObjectToArray(undefined)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<unknown[]>()
  })

  it('should handle object with number values', () => {
    const object = { 0: 100, 1: 200, 3: 400 }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual([100, 200, undefined, 400])
    expectTypeOf(result).toEqualTypeOf<Array<number | undefined>>()
  })

  it('should handle object with string number keys', () => {
    const object = { 0: 'first', 2: 'third', 1: 'second' }
    const result = castObjectToArray(object)
    expect(result).toStrictEqual(['first', 'second', 'third'])
    expectTypeOf(result).toEqualTypeOf<Array<string | undefined>>()
  })
})
