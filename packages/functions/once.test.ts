import { once } from './once'

describe('once', () => {
  test('should only call the function once', () => {
    const fn = vi.fn()
    const wrapped = once(fn)
    wrapped()
    wrapped()
    wrapped()
    expect(fn).toHaveBeenCalledOnce()
  })

  test('should always return the same result', () => {
    const wrapped = once(Math.random)
    const resultFirst = wrapped()
    const resultSecond = wrapped()
    const resultThird = wrapped()
    expect(resultFirst).toStrictEqual(resultSecond)
    expect(resultSecond).toStrictEqual(resultThird)
    expectTypeOf(wrapped).toEqualTypeOf<(() => number) & { reset: () => void }>()
  })

  test('should take parameters but ignore them after the first call', () => {
    const fn = vi.fn((n: number) => n)
    const wrapped = once(fn)
    const resultFirst = wrapped(1)
    const resultSecond = wrapped(2)
    const resultThird = wrapped(3)
    expect(resultFirst).toBe(1)
    expect(resultSecond).toBe(1)
    expect(resultThird).toBe(1)
    expect(fn).toHaveBeenCalledExactlyOnceWith(1)
  })

  test('should call the function again after reset', () => {
    const fn = vi.fn()
    const wrapped = once(fn)
    wrapped()
    wrapped.reset()
    wrapped()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('should preserve the `this` context when calling the function', () => {
    const context = { value: 42 }
    const fn = vi.fn(function(this: typeof context) {
      return this.value
    })
    const wrapped = once(fn)
    const result = wrapped.call(context)
    expect(result).toBe(42)
  })

  test('should return different results for different `this` contexts', () => {
    const wrapped = once(Math.random)
    const result1 = wrapped.call({})
    const result2 = wrapped.call({})
    expect(result1).not.toStrictEqual(result2)
  })
})
