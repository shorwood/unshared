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
    // oxlint-disable-next-line unicorn/no-thenable
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
