import type { Resolvable } from './createResolvable'
import { createResolvable } from './createResolvable'

describe('createResolvable', () => {
  test('should initialize a resolvable promise', () => {
    const result = createResolvable()
    expect(result.isPending).toBe(true)
    expect(result.isResolved).toBe(false)
    expect(result.isRejected).toBe(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result).toEqualTypeOf<Resolvable<unknown>>()
  })

  test('should be an instance of Promise', () => {
    const result = createResolvable()
    expect(result).toBeInstanceOf(Promise)
  })

  test('should be resolved after resolve is called', async() => {
    const result = createResolvable<string>()
    result.resolve('test')
    await expect(result.promise).resolves.toBe('test')
    expect(result.isPending).toBe(false)
    expect(result.isResolved).toBe(true)
    expect(result.isRejected).toBe(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })

  test('should reject a value after reject is called', async() => {
    const result = createResolvable<string>()
    result.reject(new Error('test'))
    await expect(result.promise).rejects.toThrow('test')
    expect(result.isPending).toBe(false)
    expect(result.isResolved).toBe(false)
    expect(result.isRejected).toBe(true)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })

  test('should be resolved after reset is called if already resolved', () => {
    const result = createResolvable()
    result.resolve()
    result.reset()
    expect(result.isPending).toBe(true)
    expect(result.isResolved).toBe(false)
    expect(result.isRejected).toBe(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<unknown>>()
  })

  test('should be pending after reset is called if already rejected', async() => {
    const result = createResolvable<void>()
    result.reject(new Error('test'))
    await expect(result.promise).rejects.toThrow('test')
    result.reset()
    expect(result.isPending).toBe(true)
    expect(result.isResolved).toBe(false)
    expect(result.isRejected).toBe(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<void>>()
  })

  test('should return an awaitable object that resolves to the value', async() => {
    const result = createResolvable<string>()
    result.resolve('test')
    const value = await result
    expect(value).toBe('test')
  })

  test('should return an awaitable object that rejects with the reason', async() => {
    const result = createResolvable<string>()
    result.reject(new Error('test'))
    await expect(result).rejects.toThrow('test')
  })

  test('should call the finally method when the promise is resolved', async() => {
    const result = createResolvable()
    const callback = vi.fn()
    // oxlint-disable-next-line @typescript-eslint/no-floating-promises
    result.finally(callback)
    result.resolve()
    await result
    expect(callback).toHaveBeenCalledWith()
  })
})
