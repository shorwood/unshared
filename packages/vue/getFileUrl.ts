/**
 * For a given instance of `File` or a `string`, return the URL of
 * the file so it can be used in an `<img>` or `<video>` tag.
 *
 * @param item The file or URL to convert.
 * @returns The URL of the file.
 * @example
 * ```html
 * <script setup lang="ts">
 * import { getFileUrl } from '@unshared/vue'
 *
 * const file = ref<File>()
 * const url = computed(() => getFileUrl(file.value))
 * </script>
 *
 * <template>
 *   <form>
 *     <input type="file" @change="file.value = $event.target.files[0]" />
 *     <img :src="url" />
 *   </form>
 * </template>
 */
export function getFileUrl(item?: File | string): string | undefined {
  if (typeof item === 'string') return item
  if ('URL' in globalThis === false) return
  if (item instanceof File) return globalThis.URL.createObjectURL(item)
}
