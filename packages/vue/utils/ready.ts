import { Ref, watch } from 'vue-demi'

/**
 * Create a promise that is resolved once the ref is equal to the value.
 * @param reference The ref to watch.
 * @param value The value to watch for. (Default: `true`)
 */
export const ready = <T = unknown>(reference: Ref<T>, value: T = true as T): Promise<void> =>
  new Promise((resolve) => {
    const unwatch = watch(reference, (newValue) => {
      if (newValue === value) {
        unwatch()
        resolve()
      }
    })
  })
