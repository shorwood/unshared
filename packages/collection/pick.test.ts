import { pick } from './pick'

describe('pick', () => {
  test('should pick the specified property', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = pick(object, 'foo')
    expect(result).toStrictEqual({ foo: 1 })
    expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
  })

  test('should pick the specified properties', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = pick(object, ['foo', 'bar', 'non-existent'])
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; foo: 1 }>()
  })

  test('should pick the properties using a predicator function', () => {
    const object = { bar: 2, baz: '3', foo: 1 } as const
    const callback = vi.fn((v: unknown) => typeof v === 'number') as unknown as (value: unknown) => value is number
    const result = pick(object, callback)
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'foo', object)
    expect(callback).toHaveBeenCalledWith(2, 'bar', object)
    expect(callback).toHaveBeenCalledWith('3', 'baz', object)
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; foo: 1 }>()
  })
})
