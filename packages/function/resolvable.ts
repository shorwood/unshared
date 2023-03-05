import { awaitable } from './awaitable'

export interface Resolvable<T> extends Promise<T> {
  /** Whether the promise has been resolved. */
  resolved: boolean
  /** Whether the promise has been rejected. */
  rejected: boolean
  /** Whether the promise is pending. */
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
export const resolvable = <T = void>(): Resolvable<T> => {
  const state = {} as Resolvable<T>

  // --- Define lifecycle.
  state.reset = () => {
    state.resolved = false
    state.rejected = false
    state.pending = true

    // --- Expose the `resolve` and `reject` functions.
    state.promise = new Promise<T>((resolve, reject) => {
      state.resolve = (value) => {
        state.resolved = true
        state.pending = false
        resolve(value)
      }

      state.reject = (reason) => {
        state.rejected = true
        state.pending = false
        reject(reason)
      }
    })
  }

  // --- Initalize instance.
  state.reset()

  // --- Return variable.
  return awaitable(state, state.promise)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should initialize a resolvable promise', () => {
    const result = resolvable()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.promise).toBeInstanceOf(Promise)
  })

  it('should be resolved after resolve is called', () => {
    const value = 'test'
    const result = resolvable<string>()
    result.resolve(value)
    expect(result.promise).resolves.toEqual(value)
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(true)
    expect(result.rejected).toEqual(false)
  })

  it('should reject a value after reject is called', () => {
    const value = 'test'
    const result = resolvable<string>()
    result.reject(value)
    expect(result.promise).rejects.toEqual(value)
    expect(result.pending).toEqual(false)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(true)
  })

  it('should be resolved after reset is called if already resolved', () => {
    const result = resolvable()
    result.resolve()
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
  })

  it('should be pending after reset is called if already rejected', () => {
    const result = resolvable()
    result.reject()
    result.reset()
    expect(result.pending).toEqual(true)
    expect(result.resolved).toEqual(false)
    expect(result.rejected).toEqual(false)
  })

  it('should be awaitable', async() => {
    const value = 'test'
    const result = resolvable<string>()
    result.resolve(value)
    expect(result).resolves.toEqual(value)
  })

  it('should infer the type of the resolved type', async() => {
    const result = resolvable<string>()
    expectTypeOf(result).toEqualTypeOf<Resolvable<string>>()
    expectTypeOf(result.promise).toEqualTypeOf<Promise<string>>()
  })
}
