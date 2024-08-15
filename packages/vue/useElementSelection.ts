import type { MaybeComputedElementRef } from '@vueuse/core'
import type { ElementSelection } from './utils'
import { unrefElement } from '@vueuse/core'
import { computed, nextTick, onScopeDispose, ref } from 'vue'
import { getElementSelection, setElementSelection } from './utils'

/**
 * Composable function that tracks the selection position in a content editable,
 * text area, or text input element. The function returns a selection object that
 * represents the current selection in the element. The selection object contains
 * the parent element, the start and end offsets, and the selected text.
 *
 * @param element The element to track the selection position in.
 * @returns A reactive selection object that represents the current selection.
 */
export function useElementSelection(element: MaybeComputedElementRef) {
  const selection = ref<ElementSelection>()

  /**
   * Reapply the current selection state at the next tick. This is useful when
   * the selection is lost due to a re-render or a change in the element.
   */
  function restore() {
    const elementValue = unrefElement(element)
    const currentCursor = getElementSelection(elementValue)
    if (!currentCursor) return
    setElementSelection(elementValue, currentCursor.index, currentCursor.length)
    void nextTick(() => {
      const elementValue = unrefElement(element)
      if (!elementValue) return
      setElementSelection(elementValue, currentCursor.index, currentCursor.length)
    })
  }

  /**
   * Update the selection object when the selection changes in the document.
   * This function is called when the `selectionchange` event is triggered.
   */
  function onSelectionChange() {
    const elementValue = unrefElement(element)
    selection.value = getElementSelection(elementValue)
  }

  // --- Watch selection changes in the document to update the selection.
  if (document) {
    document.addEventListener('selectionchange', onSelectionChange)
    onScopeDispose(() => document.removeEventListener('selectionchange', onSelectionChange))
  }

  // --- Create bound properties for the selection index.
  const index = computed({
    get: () => selection.value?.index,
    set: (value) => {
      const elementValue = unrefElement(element)
      if (!elementValue) return
      setElementSelection(elementValue, value, selection.value?.length)
    },
  })

  // --- Create bound properties for the selection length.
  const length = computed({
    get: () => selection.value?.length,
    set: (value) => {
      const elementValue = unrefElement(element)
      if (!elementValue) return
      setElementSelection(elementValue, selection.value?.index, value)
    },
  })

  // --- Read-only computed property for the selection range.
  const range = computed(() => selection.value?.range)

  // --- Return the selection object.
  return { restore, index, length, range, selection }
}
