import { getElementTextNodes } from './getElementTextNodes'

// @vitest-environment happy-dom
describe('getElementTextNodes', () => {
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
})
