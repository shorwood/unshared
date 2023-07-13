import { garbageCollect } from './garbageCollect'

export interface GarabageCollectionOptions {
  /**
   * The timeout in milliseconds to wait for the object to be garbage collected.
   * If the object is not garbage collected within the timeout, the promise will
   * be rejected.
   *
   * @example 1000
   */
  timeout?: number
  /**
   * Considers the process exit event as a garbage collection event. If set to
   * `true`, the promise will resolve when the process exits. Allowing the
   * callbacks to be called before the process exits.
   *
   * @default true
   */
  handleExit?: boolean
}

/**
 * Returns a promise that resolves when the object is garbage collected. This
 * function is useful to clean up resources when the object is no longer being
 * used. Such as temporary files or database connections.
 *
 * @param value The value to await garbage collection for.
 * @param options The options to use.
 * @returns A promise that resolves when the object is garbage collected.
 */
export function garbageCollection<T>(value: T, options: GarabageCollectionOptions = {}): Promise<void> {
  const { timeout = 0 } = options

  // --- Create a promise that resolves when the object is garbage collected.
  return new Promise((resolve, reject) => {
    const reference = new WeakRef({ value })

    // --- On garbage collection run, check if the object is still referenced.
    const callback = () => {
      if (timeout > 0) setTimeout(reject, timeout, new Error('Timed out waiting for the object to be garbage collected'))
      if (reference.deref() === undefined) resolve()
    }

    // --- Start listening for garbage collection events.
    new FinalizationRegistry(callback).register(reference, undefined, reference)
  })
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should not call the callback if the object is not garbage collected', () => {
    const object = 'foobar'
    const result = garbageCollection(object, { timeout: 1 })
    garbageCollect()
    expect(result).rejects.toThrow(/timed out/i)
  })

  it('should call the callback if the object is garbage collected', async() => {
    const result = garbageCollection('foobar')
    garbageCollect()
    expect(result).resolves.toEqual(undefined)
  })
}
