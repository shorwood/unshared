import { unbind } from './unbind'

describe('unbind', () => {
  test('should unbind the "toFixed" method', () => {
    const toFixed = unbind(Number.prototype, 'toFixed')
    const result = toFixed(1, 2)
    expect(result).toBe('1.00')
  })

  test('should unbind the "toUpperCase" method', () => {
    const toUpperCase = unbind(String.prototype, 'toUpperCase')
    const result = toUpperCase('a')
    expect(result).toBe('A')
  })

  test('should infer the type of the unbound function', () => {
    const toFixed = unbind(Number.prototype, 'toFixed')
    expectTypeOf(toFixed).toEqualTypeOf<(value: InstanceType<NumberConstructor>, fractionDigits?: number) => string>()
  })
})
