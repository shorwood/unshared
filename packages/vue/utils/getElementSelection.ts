import { getElementLength } from './getElementLength'
import { getElementTextNodes } from './getElementTextNodes'

/**
 * A cursor object that represents the current selection in the document.
 * The cursor object contains the parent element, the start and end offsets,
 * and the selected text.
 */
export interface ElementSelection {

  /** The start index of the cursor. */
  index: number

  /** The number of characters in the cursor. */
  length: number

  /** The selected text of the cursor. */
  range?: Range
}

/**
 * Get the current selection of the given element. If the element is not
 * provided or no selection is found, return undefined.
 *
 * @param node The element to get the selection from.
 * @returns A cursor object with the parent element and the cursor offsets.
 */
export function getElementSelection(node?: Node | null): ElementSelection | undefined {
  if (!node) return

  // --- If the element is an `input` or `textarea`, return the cursor offset.
  if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
    const isFocused = node === document.activeElement
    if (!isFocused) return
    const start = node.selectionStart ?? 0
    const end = node.selectionEnd ?? start
    return {
      index: start,
      length: end - start,
    }
  }

  // --- Otherwise, get the selection from the window.
  const selection = globalThis.getSelection()
  if (!selection) return
  if (selection.rangeCount === 0) return

  // --- Check if the selection is within the element or its children.
  const isElement = selection.anchorNode?.parentNode === node
  const isChild = selection.containsNode(node, true)
  if (!isElement && !isChild) return

  const range = selection.getRangeAt(0)
  const nodes = getElementTextNodes(node)
  let start = 0
  let end = 0
  let foundStart = false

  // --- Traverse the text nodes to find the cursor offset relative to the parent.
  for (const node of nodes) {
    const isNodeStart = range.startContainer.contains(node)
    const isNodeEnd = range.endContainer.contains(node)
    if (isNodeStart) { start += range.startOffset; foundStart = true }
    if (isNodeEnd) { end += range.endOffset; break }
    if (!foundStart) start += getElementLength(node)
    end += getElementLength(node)
  }

  // --- Return the cursor offset.
  return {
    index: start,
    length: end - start,
    range,
  }
}
