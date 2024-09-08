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

/* v8 ignore start */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  test('should return an empty array if the node is not provided', () => {
    const result = getElementTextNodes()
    expect(result).toHaveLength(0)
  })

  test('should return an array of text nodes', () => {
    const div = document.createElement('div')
    div.innerHTML = 'Hello, World!'
    const textNodes = getElementTextNodes(div)
    expect(textNodes).toHaveLength(1)
    expect(textNodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(textNodes[0].textContent).toBe('Hello, World!')
  })

  test('should return an array of text nodes from a br element', () => {
    const div = document.createElement('div')
    div.innerHTML = 'Hello,<br>World!'
    const textNodes = getElementTextNodes(div)
    expect(textNodes).toHaveLength(3)
    expect(textNodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(textNodes[1]).toBeInstanceOf(HTMLBRElement)
    expect(textNodes[2].nodeType).toBe(Node.TEXT_NODE)
  })

  test('should return an array of text nodes from a nested element', () => {
    const div = document.createElement('div')
    div.innerHTML = 'Hello,<span>World!</span>'
    const textNodes = getElementTextNodes(div)
    expect(textNodes).toHaveLength(2)
    expect(textNodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(textNodes[1].nodeType).toBe(Node.TEXT_NODE)
    expect(textNodes[0].textContent).toBe('Hello,')
    expect(textNodes[1].textContent).toBe('World!')
  })
}
