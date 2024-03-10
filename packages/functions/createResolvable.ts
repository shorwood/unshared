export interface Resolvable<T = unknown> extends Promise<T> {
  /** Whether the promise has been resolved. */
  resolved: boolean
  /** Whether the promise has been rejected. */
  rejected: boolean
  /** Whether the promise is still pending. */
  pending: boolean
  /** The resolvable promise. */
  promise: Promise<T>
  /**
   * Resolve the promise with a value.
   *
   * @param value The value to resolve the promise with.
   */
  resolve: T extends unknown ? (value?: PromiseLike<T> | T) => void : (value: PromiseLike<T> | T) => void
  /**
   * Reject the promise with a value.
   *
   * @param reason The reason for the rejection.
   */
  reject: (reason?: any) => void
  /**
   * Reset the promise to its initial state.
   *
   * @returns The `this` instance.
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
 * const state = resolvable()
 * eventEmitter.on('event', state.resolve)
 * await state
 */
export function createResolvable<T>(): Resolvable<T> {
  const state = {} as Resolvable

  // --- Define lifecycle.
  state.reset = () => {
    state.resolved = false
    state.rejected = false
    state.pending = true

    // --- Create a new promise that can be resolved or rejected from outside.
    // --- Before resolving or rejecting, update the internal state.
    state.promise = new Promise((resolve, reject) => {
      state.resolve = (value: unknown) => {
        state.resolved = true
        state.rejected = false
        state.pending = false
        resolve(value)
      }
      state.reject = (value) => {
        state.resolved = false
        state.rejected = true
        state.pending = false
        reject(value)
      }
    })
  }

  // --- Initalize instance and return it.
  state.reset()
  return state as Resolvable<T>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should initialize a resolvable promise', () => {
    const result = createResolvable()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result).toEqualTypeOf<Resolvable<unknown>>()
  })

  it('should be resolved after resolve is called', async() => {
    const result = createResolvable<string>()
    result.resolve('test')
    await expect(result.promise).resolves.toEqual('test')
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(true)
    expect(result.rejected).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })

  it('should reject a value after reject is called', async() => {
    const result = createResolvable<string>()
    result.reject('test')
    await expect(result.promise).rejects.toThrow('test')
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(true)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })

  it('should be resolved after reset is called if already resolved', () => {
    const result = createResolvable()
    result.resolve()
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<unknown>>()
  })

  it('should be pending after reset is called if already rejected', async() => {
    const result = createResolvable<void>()
    result.reject('test')
    await expect(result.promise).rejects.toThrow('test')
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
    expectTypeOf(result.promise).toEqualTypeOf<Promise<void>>()
  })
}
