import { createResolvable } from './createResolvable'
import { garbageCollect } from './garbageCollect'

/** Global finalization registry used to track garbage collection. */
let REGISTRY: FinalizationRegistry<unknown> | undefined

/**
 * Returns a promise that resolves a given object is garbage collected. This
 * function is useful to clean up resources when the object is no longer being
 * used. Such as deleting files or closing database connections.
 *
 * @param value The value to await garbage collection for.
 * @param timeout The timeout to wait for the object to be garbage collected.
 * @returns A promise that resolves when the object is garbage collected.
 * @example
 * class Database {
 *   constructor() {
 *     this.connection = new Connection()
 *     garbageCollected(this).then(() => this.connection.close())
 *   }
 * }
 */
export function garbageCollected<T extends WeakKey>(value: T, timeout = 0): Promise<void> {
  const resolvable = createResolvable<void>()

  // --- If a timeout is set, reject the promise if the timeout is reached.
  if (timeout > 0)
    setTimeout(resolvable.reject, timeout, new Error('Timed out waiting for the object to be garbage collected'))

  // --- If no global registry is set, create one. Then, resolve once the object is garbage collected.
  REGISTRY = REGISTRY ?? new FinalizationRegistry((callback: () => void) => callback())
  REGISTRY.register(value, resolvable.resolve)

  // --- Return the promise.
  return resolvable.promise
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should resolve once the object is garbage collected', async() => {
    const result = garbageCollected({ foo: 'bar' })
    garbageCollect()
    await expect(result).resolves.toBeUndefined()
  })

  it('should resolve once an object in a child context is garbage collected', async() => {
    const createChildContext = () => {
      const object = { foo: 'bar' }
      return garbageCollected(object)
    }

    const result = createChildContext()
    garbageCollect()
    await expect(result).resolves.toBeUndefined()
  })

  it('should call the callback function when a class instance is garbage collected', async() => {
    const callback = vi.fn()
    class Example {
      constructor() { void garbageCollected(this).then(callback) }
    }

    const createChildContext = () => { new Example() }
    createChildContext()
    garbageCollect()
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(callback).toHaveBeenCalled()
  })

  it('should reject if the object is not garbage collected before the timeout', async() => {
    const object = { foo: 'bar' }
    const createChildContext = () => garbageCollected(object, 10)
    const result = createChildContext()
    garbageCollect()
    await expect(result).rejects.toThrow('Timed out waiting for the object to be garbage collected')
  })
}
