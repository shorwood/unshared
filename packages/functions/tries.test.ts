import { tries } from './tries'

describe('tries', () => {
  test('should return the first result that does not throw', () => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => number
    const fn2 = vi.fn(() => 'Hello, World!') as () => string
    const fn3 = vi.fn(() => 1) as () => number
    const result = tries(fn1, fn2, fn3)
    expect(result).toBe('Hello, World!')
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn3).not.toHaveBeenCalled()
    expectTypeOf(result).toEqualTypeOf<number | string | void>()
  })

  test('should return a promise if the result is a promise after the first function throws', async() => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => Promise<number>
    const fn2 = vi.fn(() => Promise.resolve(1)) as () => Promise<number>
    const result = tries(fn1, fn2)
    await expect(result).resolves.toBe(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<Promise<number> | Promise<void>>()
  })

  test('should return a promise if a previous function rejects', async() => {
    const fn1 = vi.fn(() => Promise.reject(new Error('Error'))) as () => Promise<number>
    const fn2 = vi.fn(() => 1) as () => number
    const result = tries(fn1, fn2)
    await expect(result).resolves.toBe(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<Promise<number> | Promise<void>>()
  })

  test('should return undefined if all functions throw or return undefined', () => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => void
    const fn2 = vi.fn(() => {}) as () => void
    const result = tries(fn1, fn2)
    expect(result).toBeUndefined()
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<void>()
  })

  test('should only call each function once when switching to a promise', async() => {
    const fn1 = vi.fn(() => { throw new Error('Error') })
    const fn2 = vi.fn(() => { throw new Error('Error') })
    const fn3 = vi.fn(() => Promise.resolve(1))
    const result = tries(fn1, fn2, fn3)
    await expect(result).resolves.toBe(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn3).toHaveBeenCalledOnce()
  })

  test('should return undefined if no functions are provided', () => {
    const result = tries()
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<void>()
  })

  test('should override the return type using the generic', () => {
    const result = tries<'foo'>(() => 'not-foo')
    expect(result).toBe('not-foo')
    expectTypeOf(result).toEqualTypeOf<'foo'>()
  })
})
