import type { Reactive } from './reactive'
import type { Unwrapped } from './unwrap'
import { computed } from './computed'
import { reference } from './reference'
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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should store changes of a reactive', () => {
    const value = reference(1)
    const changes = timeline(value)
    value.value = 2
    expect(changes).toStrictEqual([1, 2])
  })

  test('should store changes of a reference', () => {
    const value = reference(1)
    const changes = timeline(value)
    value.value = 2
    expect(changes).toStrictEqual([1, 2])
  })

  test('should store changes of a computed', async() => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { eager: true, immediate: true })
    const changes = timeline(sum)
    a.value = 2
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(changes).toStrictEqual([3, 4])
  })

  test('should transform values', () => {
    const value = reference(1)
    const changes = timeline(value, { transform: String })
    value.value = 2
    expect(changes).toStrictEqual(['1', '2'])
  })

  test('should limit the number of changes', () => {
    const a = reference(1)
    const changes = timeline(a, { limit: 2 })
    a.value = 2
    a.value = 3
    a.value = 4
    expect(changes).toStrictEqual([3, 4])
  })

  test('should infer the type of the timeline if no transform is provided', () => {
    const value = reference(1)
    const changes = timeline(value)
    expectTypeOf(changes).toEqualTypeOf<number[]>()
  })

  test('should infer the type of the timeline if a transform is provided', () => {
    const value = reference(1)
    const changes = timeline(value, { transform: String })
    expectTypeOf(changes).toEqualTypeOf<string[]>()
  })
}
