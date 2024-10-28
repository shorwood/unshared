import type { Reactive } from './reactive'
import type { Unwrapped } from './unwrap'
import { unwrap } from './unwrap'
import { watch } from './watch'

export interface TimelineOptions<T, U> {

  /**
   * The maximum number of changes to store.
   *
   * @default Infinity
   */
  limit?: number

  /**
   * The function to transform the value before storing it in the timeline.
   * This is useful if you want to store a clone of the value instead of
   * the value itself.
   *
   * @param value The value to transform.
   * @returns The transformed value.
   * @example timeline(a, { transform: (value) => Object.assign({}, value) })
   */
  transform?: (value: Unwrapped<T>) => U
}

/**
 * Watch a reactive object for changes and store each change in an array.
 * Be careful with this function, as it will store every change in memory
 * unless you specify a limit for the number of changes to store.
 *
 * You can also pass a `transform` function to transform the value before
 * storing it in the timeline. Allowing you for example to store a clone
 * of the value.
 *
 * @param value The reactive object to watch.
 * @param options The options for the timeline.
 * @returns An array of changes.
 * @example
 * const ref = reference(1)
 * const changes = timeline(a)
 * ref.value = 2
 * expect(changes).toStrictEqual([1, 2])
 */
export function timeline<T extends Reactive, U = Unwrapped<T>>(value: T, options: TimelineOptions<T, U> = {}): U[] {
  const { limit = Number.POSITIVE_INFINITY, transform } = options
  const timeline: U[] = []

  // --- Register a change in the timeline.
  const registerChange = (value: Unwrapped<T>) => {
    const change = transform ? transform(value) : (value as U)
    timeline.push(change)
    if (timeline.length > limit) timeline.shift()
  }

  // --- Register the initial value and watch for changes.
  const initialValue = unwrap(value)
  registerChange(initialValue)
  watch(value, registerChange)

  // --- Return the timeline.
  return timeline
}
