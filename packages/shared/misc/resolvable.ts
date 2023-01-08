export interface Resolvable<T> extends PromiseLike<T> {
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
 * Creates a new resolvable object with convenience methods for Promise resolution and state management.
 * @return A new resolvable object
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
  return new Proxy(state, {
    get(target: any, key) {
      if (key === 'then') return state.promise.then.bind(state.promise)
      if (key === 'catch') return state.promise.catch.bind(state.promise)
      if (key === 'finally') return state.promise.finally.bind(state.promise)
      if (key in target) return target[key]
    },
  })
}
