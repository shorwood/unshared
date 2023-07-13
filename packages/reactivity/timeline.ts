import { Reactive, reactive } from './reactive'
import { Reference, reference } from './reference'
import { Unwraped, unwrap } from './unwrap'
import { watch } from './watch'

export interface TimelineOptions<T> {
  /**
   * The function to transform the value before storing it in the timeline.
   * This is useful if you want to store a clone of the value.
   *
   * @param value The value to transform.
   * @returns The transformed value.
   * @example timeline(a, { transform: (value) => Object.assign({}, value) })
   */
  transform?: (value: Unwraped<T>) => Unwraped<T>
  /**
   * The maximum number of changes to store.
   *
   * @default Infinity
   */
  limit?: number
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
 * const a = reference(1)
 * const changes = timeline(a)
 * a.value = 2
 * expect(changes).toEqual([1, 2])
 */
export function timeline<T extends Reactive | Reference>(value: T, options: TimelineOptions<T> = {}): Unwraped<T>[] {
  const { transform, limit = Number.POSITIVE_INFINITY } = options
  const timeline: Unwraped<T>[] = []

  // --- Register a change in the timeline.
  const registerChange = (value: Unwraped<T>) => {
    const change = transform ? transform(value) : value
    timeline.push(change)
    if (timeline.length > limit) timeline.shift()
  }

  // --- Register the initial value and watch for changes.
  registerChange(unwrap(value))
  watch(value, registerChange)

  // --- Return the timeline.
  return timeline
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should store changes in an array', () => {
    const a = reference(1)
    const changes = timeline(a)
    a.value = 2
    expect(changes).toEqual([1, 2])
  })

  it('should work with reactive objects', () => {
    const a = reactive({ value: 1 })
    const changes = timeline(a)
    a.value = 2
    expect(changes).toEqual([{ value: 2 }, { value: 2 }])
  })

  it('should transform values', () => {
    const a = reference(1)
    const changes = timeline(a, { transform: value => value + 1 })
    a.value = 2
    expect(changes).toEqual([2, 3])
  })

  it('should limit the number of changes', () => {
    const a = reference(1)
    const changes = timeline(a, { limit: 2 })
    a.value = 2
    a.value = 3
    a.value = 4
    expect(changes).toEqual([3, 4])
  })
}
