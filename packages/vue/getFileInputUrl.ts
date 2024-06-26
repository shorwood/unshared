/**
 * For a given instance of `File` or a `string`, return the URL of
 * the file so it can be used in an `<img>` or `<video>` tag.
 *
 * @param item The file or URL to convert.
 * @returns The URL of the file.
 * @example
 * ```html
 * <script setup lang="ts">
 * import { getFileInputUrl } from '@unshared/vue'
 *
 * const file = ref<File>()
 * const url = computed(() => getFileInputUrl(file.value))
 * </script>
 *
 * <template>
 *   <form>
 *     <input type="file" @change="file.value = $event.target.files[0]" />
 *     <img :src="url" />
 *   </form>
 * </template>
 */
export function getFileInputUrl(item?: File | string): string | undefined {
  if (typeof window === 'undefined') return
  if (typeof item === 'string') return item
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  if (item instanceof File) return window.URL.createObjectURL(item)
}

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  test('should return the URL of a file', () => {
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const result = getFileInputUrl(file)
    expect(result).toMatch(/^blob:nodedata:[\da-z-]{8}(-[\da-z-]{4}){3}-[\da-z-]{12}$/)
  })

  test('should return the URL of a string', () => {
    const url = 'https://example.com/image.png'
    const result = getFileInputUrl(url)
    expect(result).toBe(url)
  })

  test('should return an empty string', () => {
    const result = getFileInputUrl()
    expect(result).toBeUndefined()
  })
}
