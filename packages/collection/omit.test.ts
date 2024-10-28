import { omit } from './omit'

describe('omit', () => {
  test('should omit the specified property', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = omit(object, 'foo')
    expect(result).toStrictEqual({ bar: 2, baz: 3 })
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; baz: 3 }>()
  })

  test('should omit the specified properties', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = omit(object, ['foo', 'bar', 'non-existent'])
    expect(result).toStrictEqual({ baz: 3 })
    expectTypeOf(result).toEqualTypeOf<{ baz: 3 }>()
  })

  test('should omit the properties using a predicator function', () => {
    const object = { bar: 2, baz: '3', foo: 1 } as const
    const callback = vi.fn((v: unknown) => typeof v === 'number') as unknown as (value: unknown) => value is number
    const result = omit(object, callback)
    expect(result).toStrictEqual({ baz: '3' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'foo', object)
    expect(callback).toHaveBeenCalledWith(2, 'bar', object)
    expect(callback).toHaveBeenCalledWith('3', 'baz', object)
    expectTypeOf(result).toEqualTypeOf<{ baz: '3' }>()
  })
})
