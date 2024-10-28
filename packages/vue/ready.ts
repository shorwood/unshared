import type { Ref } from 'vue'
import { watch } from 'vue'

/** The condition to watch for. */
export type ReadyCondition<T> = ((value: T) => boolean) | T

/**
 * Create a promise that is resolved once the ref is equal to the value.
 *
 * @param reference The ref to watch.
 * @param condition The value to watch for. (Default: `true`)
 * @returns A promise that resolves once the ref is equal to the value.
 * @example
 * // Create a ref.
 * const ref = ref(false)
 *
 * // Make the `ref` truthy after 1 second.
 * setTimeout(() => { ref.value = true }, 1000)
 *
 * // Create a promise that resolves once the ref is truthy.
 * const promise = ready(ref) // Resolves after 1 second.
 */
export function ready<T = unknown>(reference: Ref<T>, condition?: ReadyCondition<T>): Promise<T> {
  return new Promise<T>((resolve) => {
    const unwatch = watch(reference, (newValue) => {

      // --- If no condition is provided, resolve once the value is truthy.
      if (condition === undefined) {
        if (!newValue) return
      }

      // --- If the condition is a function, resolve once the function returns true.
      else if (typeof condition === 'function') {
        // @ts-expect-error: T may also be a function, ignore this edge case.
        const result = condition(newValue) as boolean
        if (!result) return
      }

      // --- If the condition is a value, resolve once the value is equal.
      else if (newValue !== condition) {
        return
      }

      // --- Finaly, resolve the promise and stop watching.
      unwatch()
      resolve(newValue)
    })
  })
}
