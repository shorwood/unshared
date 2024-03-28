import { tryOnMounted, useMutationObserver } from '@vueuse/core'
import { unref, ref, Ref, MaybeRef } from 'vue-demi'

/**
 * Observe if a given HTML element is empty or not. The function will watch
 * for changes in the element's DOM subtree and change the it's value
 * accordingly.
 *
 * @param element The element to observe.
 * @returns A reactive boolean indicating if the element is empty or not.
 * @example
 * <script setup lang="ts">
 * const ref = ref<HTMLElement>()
 * const isEmpty = useElementEmptiness(ref) => // => Ref { value: true }
 * </script>
 *
 * <template>
 *  <div ref="ref">
 *    <p v-if="false">This element won't be rendered.</p>
 *  </div>
 * </template>
 */
export function useElementEmptiness(element: MaybeRef<HTMLElement | undefined>): Ref<boolean> {
  const isElementEmpty = ref(true)

  // --- Function to compute the emptyness state of the element.
  function callback(): void {
    const elementValue = unref(element)
    const elementInnerHTML = elementValue?.innerHTML.replaceAll(/<!--(.*?)-->/gm, '')?.trim()
    isElementEmpty.value = Boolean(elementInnerHTML)
  }

  // --- Check for the emptyness state on mount and on mutation.
  tryOnMounted(callback)
  useMutationObserver(element, callback, { childList: true })

  // --- Return the emptyness state.
  return isElementEmpty
}
