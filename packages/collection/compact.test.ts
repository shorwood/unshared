import { compact } from './compact'

describe('compact', () => {
  test('should filter out undefined values', () => {
    const result = compact([true, undefined, true])
    expect(result).toStrictEqual([true, true])
    expectTypeOf(result).toEqualTypeOf<boolean[]>()
  })

  test('should filter out null values', () => {
    const result = compact([true, null, true])
    expect(result).toStrictEqual([true, true])
    expectTypeOf(result).toEqualTypeOf<boolean[]>()
  })

  test('should not filter out falsy values', () => {
    const result = compact([false, 0, 0n, ''])
    expect(result).toStrictEqual([false, 0, 0n, ''])
    expectTypeOf(result).toEqualTypeOf<Array<bigint | boolean | number | string>>()
  })

  test('should infer the type of the result if the input is a tuple', () => {
    const result = compact([1, undefined] as [1, undefined])
    expect(result).toStrictEqual([1])
    expectTypeOf(result).toEqualTypeOf<Array<1>>()
  })
})
