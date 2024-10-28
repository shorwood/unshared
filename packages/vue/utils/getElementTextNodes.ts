/**
 * Get all the text nodes of a given node. Also includes <br> elements to
 * represent line breaks. If the node is not provided, return an empty array.
 *
 * @param node The node to get the text nodes from.
 * @returns An array of text nodes.
 * @example
 *
 * // Create a div element with text and a line break.
 * const div = document.createElement('div')
 * div.innerHTML = 'Hello,<br>World!'
 *
 * // Returns an array of text nodes and <br> elements.
 * const textNodes = getElementTextNodes(div) // [Text, HTMLBRElement, Text]
 */
export function getElementTextNodes(node?: Node): Node[] {
  if (!node) return []
  const result = [] as Node[]
  const toExplore = [node]

  // --- Traverse the node and its children to find all text nodes.
  while (toExplore.length > 0) {
    const current = toExplore.shift()
    if (!current) break
    if (current.nodeName === 'BR') result.push(current)
    else if (current.nodeType === Node.TEXT_NODE) result.push(current as Text)
    else toExplore.unshift(...current.childNodes)
  }

  // --- Return the collected text nodes so far.
  return result
}
