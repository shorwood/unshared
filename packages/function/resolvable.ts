import { nextTick } from 'node:process'
import { awaitable } from './awaitable'

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
export const resolvable = <T = void>(): Resolvable<T> => {
  // --- Initialize state.
  const state = <Resolvable<T>>{}

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
  return awaitable(state, state.promise)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should initialize a resolvable promise', () => {
    const state = resolvable()
    expect(state.pending).toEqual(true)
    expect(state.resolved).toEqual(false)
    expect(state.promise).toBeInstanceOf(Promise)
  })

  it('should be resolved after resolve is called', () => {
    const value = 'test'
    const state = resolvable<string>()
    nextTick(() => state.resolve(value))
    expect(state).resolves.toEqual(value)
    expect(state.promise).resolves.toEqual(value)
    expect(state).resolves.toHaveProperty('pending', false)
    expect(state).resolves.toHaveProperty('resolved', true)
  })

  it('should reject a value after reject is called', () => {
    const value = 'test'
    const state = resolvable<string>()
    nextTick(() => state.reject(value))
    expect(state).rejects.toEqual(value)
    expect(state.promise).rejects.toEqual(value)
    expect(state).rejects.toHaveProperty('pending', false)
    expect(state).rejects.toHaveProperty('resolved', false)
  })

  it('should be resolved after reset is called if already resolved', () => {
    const state = resolvable()
    state.resolve()
    state.reset()
    expect(state).resolves.toHaveProperty('pending', true)
    expect(state).resolves.toHaveProperty('resolved', false)
  })

  it('should be pending after reset is called if already rejected', () => {
    const state = resolvable()
    state.reject()
    state.reset()
    expect(state).resolves.toHaveProperty('pending', true)
    expect(state).resolves.toHaveProperty('resolved', false)
  })

  it('should be awaitable', async() => {
    const value = 'test'
    const state = resolvable<string>()
    nextTick(() => state.resolve(value))
    expect(state).resolves.toEqual(value)
    expect(state.promise).resolves.toEqual(value)
  })
}
