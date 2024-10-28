import type { Reactive } from './reactive'
import type { Unwrapped } from './unwrap'
import { ReactiveData } from './constants'
import { unwrap } from './unwrap'

/** Stop watching a reactive object. */
export type Unwatch = () => void

/**
 * The callback to invoke when a reactive object or reference changes.
 * If the object is a reference, the value will be unwrapped.
 *
 * @template T The type of the reactive object or reference.
 * @example (value: string) => console.log(value)
 */
export type WatchCallback<T> = (value: Unwrapped<T>) => void

/**
 * Watch a reactive object for changes on a specific path, and invoke a callback
 * when the value changes. If the object is a `Reference`, the callback will be
 * invoked with the unwrapped value.
 *
 * @param value The reactive object or reference to watch.
 * @param callback The callback to invoke when the value changes.
 * @returns A function to stop watching the object.
 * @example
 * const ref = reference('foo')
 * const stop = watch(ref, value => console.log(value))
 */
export function watch<T extends Reactive>(value: T, callback: WatchCallback<T>): Unwatch {
  const watchCallback = (value: T) => callback(unwrap(value))

  // --- Add the callback to the reactive object.
  const reactiveData = value[ReactiveData]
  reactiveData.callbacks.push(watchCallback)

  // --- Return a function to remove the callback.
  return () => {
    const index = reactiveData.callbacks.indexOf(watchCallback)
    if (index !== -1) reactiveData.callbacks.splice(index, 1)
  }
}
