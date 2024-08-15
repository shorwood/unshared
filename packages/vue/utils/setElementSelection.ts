import { getElementLength } from './getElementLength'
import { getElementTextNodes } from './getElementTextNodes'

/**
 * Set the selection at the specified offsets in the provided element. If no end
 * offset is provided, the selection will be set to the start offset.
 *
 * @param element The element to set the selection in.
 * @param index The start offset of the selection.
 * @param length The end offset of the selection.
 * @example
 *
 * // Create a new element and text node.
 * const div = document.createElement('div')
 * const text = document.createTextNode('Hello, World!')
 * div.appendChild(text)
 * document.body.appendChild(div)
 *
 * // Set the selection to 'Hello'.
 * setElementSelection(div, 0, 5) // 'Hello' is now selected.
 */
export function setElementSelection(element?: Node | null, index = 0, length = index): void {
  if (!element) return

  // --- Check if the element is an input or textarea.
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.focus()
    element.setSelectionRange(index, index + length)
    return
  }

  // --- Get the selection and create a new range.
  const selection = window.getSelection()
  const range = document.createRange()
  if (!selection) return
  range.selectNodeContents(element)
  const nodes = getElementTextNodes(element)
  const end = index + length

  // --- Initialize variables.
  let foundStart = false
  let textStart = 0
  let textEnd = 0

  // --- Traverse the text nodes to find the start and end nodes. Once found,
  // --- set the start and end offsets of the range.
  for (const node of nodes) {
    textEnd = textStart + getElementLength(node)

    if (!foundStart && index >= textStart && index <= textEnd) {
      foundStart = true
      if (node.nodeType === Node.TEXT_NODE) range.setStart(node, index - textStart)
      else range.setStartAfter(node)
    }

    if (foundStart && end <= textEnd) {
      if (node.nodeType === Node.TEXT_NODE) range.setEnd(node, end - textStart)
      else range.setEndAfter(node)
      break
    }

    textStart = textEnd
  }

  // --- Apply the range to the selection.
  selection.removeAllRanges()
  selection.addRange(range)
}
