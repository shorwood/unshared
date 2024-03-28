import { Ref, ref, watch } from 'vue-demi'

/**
 * Create a promise that is resolved once the ref is equal to the value.
 *
 * @param reference The ref to watch.
 * @param value The value to watch for. (Default: `true`)
 * @returns A promise that resolves once the ref is equal to the value.
 * @example
 * // Create a ref.
 * const ref = ref(false)
 *
 * // Create a promise that resolves once the ref is true.
 * const promise = ready(ref, true)
 */
export function ready<T = unknown>(reference: Ref<T>, value = true as T): Promise<T> {
  return new Promise<T>((resolve) => {
    const unwatch = watch(reference, (newValue) => {
      if (newValue !== value) return
      unwatch()
      resolve(newValue)
    })
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should create a promise that resolves once the ref is equal to the value', async() => {
    const reference = ref(false)
    const promise = ready(reference, true)
    expect(promise).toBeInstanceOf(Promise)
    reference.value = true
    await expect(promise).resolves.toBe(true)
  })
}
