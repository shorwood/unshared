export interface Resolvable<T> extends Promise<T> {
  /** Whether the promise has been resolved. */
  resolved: boolean
  /** Whether the promise has been rejected. */
  pending: boolean
  /** The resolvable promise. */
  promise: Promise<T>
  /** Resolve the promise with a value. */
  resolve: (value: T | PromiseLike<T>) => void
  /** Reject the promise with a value. */
  reject: (reason?: any) => void
  /** Reset the promise to its initial state. */
  reset: () => void
}

/**
 * Creates a new resolvable `Promise` object that can be resolved or rejected
 * manually from outside the promise. This is useful for creating a promise
 * that can be resolved or rejected from an unknown context without having to
 * wrap the whole logic in a promise.
 *
 * @returns A new resolvable object
 * @example
 * const state = resolvable()
 * eventEmitter.on('event', state.resolve)
 * await state
 */
export function createResolvable<T = void>(): Resolvable<T> {
  const state = {} as Resolvable<T>

  // --- Define lifecycle.
  state.reset = () => {
    state.resolved = false
    state.pending = true

    // --- Init promise.
    state.promise = new Promise<T>((resolve, reject) => {
      // --- Wrap  resolve.
      state.resolve = (value) => {
        state.resolved = true
        state.pending = false
        resolve(value)
      }

      // --- Wrap reject.
      state.reject = (value) => {
        state.resolved = false
        state.pending = false
        reject(value)
      }
    })
  }

  // --- Initalize instance.
  state.reset()

  // --- Return variable.
  return state
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should initialize a resolvable promise', () => {
    const result = createResolvable()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
  })

  it('should be resolved after resolve is called', () => {
    const value = 'test'
    const result = createResolvable<string>()
    result.resolve(value)
    expect(result.promise).resolves.toEqual(value)
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(true)
    expect(result.rejected).toEqual(false)
  })

  it('should reject a value after reject is called', () => {
    const value = 'test'
    const result = createResolvable<string>()
    result.reject(value)
    expect(result.promise).rejects.toEqual(value)
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(true)
  })

  it('should be resolved after reset is called if already resolved', () => {
    const result = createResolvable()
    result.resolve()
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
  })

  it('should be pending after reset is called if already rejected', () => {
    const result = createResolvable()
    result.reject()
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
  })

  it('should infer the type of the resolved type', async() => {
    const result = createResolvable<string>()
    expectTypeOf(result).toEqualTypeOf<Resolvable<string>>()
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })
}
