export interface Resolvable<T> {
  resolved: boolean
  pending: boolean
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  reset: () => void
}

/**
 * Creates a new resolvable object with convenience methods for Promise resolution and state management.
 */
export const resolvable = <T = void>() => {
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
  return state
}
