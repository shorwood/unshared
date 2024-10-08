export interface Resolvable<T = unknown> extends Promise<T> {

  /**
   * Whether the promise is still pending. This is `true` until the promise is
   * either resolved or rejected and becomes `false`.
   *
   * @example
   * const resolvable = createResolvable()
   * resolvable.isPending // => true
   *
   * // Resolving the promise
   * resolvable.resolve()
   * resolvable.isPending // => false
   */
  isPending: boolean

  /**
   * Whether the promise has been rejected. This is `true` after the promise has
   * been rejected and becomes `false` when the promise is reset.
   *
   * @example
   * const resolvable = createResolvable()
   * resolvable.reject('reason')
   * resolvable.isRejected // => true
   *
   * // Reset the promise
   * resolvable.reset()
   * resolvable.isRejected // => false
   */
  isRejected: boolean

  /**
   * Whether the promise has been resolved. This is `true` after the promise has
   * been resolved and becomes `false` when the promise is reset.
   *
   * @example
   * const resolvable = createResolvable()
   * resolvable.resolve()
   * resolvable.isResolved // => true
   *
   * // Reset the promise
   * resolvable.reset()
   * resolvable.isResolved // => false
   */
  isResolved: boolean

  /**
   * The resolvable promise. This is the promise instance that is currently
   * being resolved or rejected until `resolve` or `reject` is called.
   *
   * @example
   * const resolvable = createResolvable()
   * resolvable.promise // => Promise { <pending> }
   *
   * // Resolving the promise
   * resolvable.resolve('resolved')
   * resolvable.promise // => Promise { 'resolved' }
   */
  promise: Promise<T>

  /**
   * Reject the promise with a cause. This will mark the promise as rejected and
   * set the reason for the rejection.
   *
   * @param cause The reason for the rejection.
   * @example
   * const resolvable = createResolvable()
   * resolvable.reject('reason')
   * resolvable.isRejected // => true
   */
  reject: (cause?: any) => void

  /**
   * Resolve the promise with a value. This will mark the promise as resolved and
   * set the value that the promise is resolved with.
   *
   * @param value The value to resolve the promise with.
   * @example
   * const resolvable = createResolvable()
   * resolvable.resolve('resolved')
   *
   * // The promise is now resolved
   * resolvable.isResolved // => true
   * resolvable.promise // => Promise { 'resolved' }
   */
  resolve: unknown extends T
    ? (value?: PromiseLike<T> | T) => void
    : (value: PromiseLike<T> | T) => void

  /**
   * Reset the promise to its initial state. This will internally instantiate a
   * new promise that can be resolved or rejected from outside the promise.
   *
   * @returns The `this` instance.
   * @example
   * const resolvable = createResolvable()
   * resolvable.resolve('resolved')
   * resolvable.reset()
   *
   * // The promise is now pending again
   * resolvable.isPending // => true
   */
  reset: () => void
}

/**
 * Creates a new resolvable `Promise` object that can be resolved or rejected
 * manually from outside the promise. This is useful for creating a promise
 * that can be resolved or rejected from an external scope without having to
 * wrap the whole logic in a promise.
 *
 * @returns A new resolvable object
 * @example
 * const state = createResolvable()
 * eventEmitter.on('event', state.resolve)
 * await state
 */
export function createResolvable<T>(): Resolvable<T> {
  const state = {} as Resolvable

  // --- Define lifecycle.
  state.reset = () => {
    state.isResolved = false
    state.isRejected = false
    state.isPending = true

    // --- Create a new promise that can be resolved or rejected from outside.
    // --- Before resolving or rejecting, update the internal state.
    state.promise = new Promise((resolve, reject) => {
      state.resolve = (value: unknown) => {
        state.isResolved = true
        state.isRejected = false
        state.isPending = false
        resolve(value)
      }
      state.reject = (value: Error) => {
        state.isResolved = false
        state.isRejected = true
        state.isPending = false
        reject(value)
      }
    })

    // --- Bind the promise methods to the state object.
    // eslint-disable-next-line unicorn/no-thenable
    state.then = state.promise.then.bind(state.promise)
    state.catch = state.promise.catch.bind(state.promise)
    state.finally = state.promise.finally.bind(state.promise)
  }

  // --- Set prototype chain to promise so that it can be detected as a promise
  // --- by other libraries or functions. Then initalize instance and return it.
  state.reset()
  Object.setPrototypeOf(state, Promise.prototype)
  return state as Resolvable<T>
}

/* v8 ignore next */
if (import.meta.vitest) {
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    result.finally(callback)
    result.resolve()
    await result
    expect(callback).toHaveBeenCalledWith()
  })
}
