import { isReactive, isRef, watch } from 'vue'

/**
 * Watch for changes but only if value is reactive.
 *
 * @param value Value(s) to watch.
 * @param callback Callback to call when value changes.
 * @param options Options to pass to `watch`.
 * @returns A function to unsubscribe from the value.
 */
export const watchLazy: typeof watch = (value: unknown, callback: unknown, options: unknown) => {
  // --- If array, filter out non-reactive values.
  if (Array.isArray(value)) {
    const toWatch = value.filter(x => isReactive(x) || isRef(x))
    return watch(toWatch, callback, options)
  }

  // --- If not array, watch the value if reactive or ref.
  if (isReactive(value) || isRef(value))
    return watch(value, callback, options)

  // --- If not reactive or ref, return a noop.
  return () => {}
}
