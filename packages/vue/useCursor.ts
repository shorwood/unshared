/* eslint-disable unicorn/prefer-dom-node-text-content */
/**
 * A cursor object that represents the current selection in the document.
 * The cursor object contains the parent element, the start and end offsets,
 * and the selected text.
 */
export interface Cursor {

  /** The parent element of which the cursor is relative to. */
  parent: HTMLElement

  /** The start offset of the cursor. */
  start: number

  /** The end offset of the cursor. */
  end: number

  /** The selected text of the cursor. */
  text: string

  /** Apply the cursor. */
  apply(): void
}

/**
 * Get all the text nodes of a given node.
 *
 * @param node The node to get the text nodes from.
 * @returns An array of text nodes.
 */
function getChildTextNodes(node: Node): Node[] {
  const result = [] as Node[]
  const toExplore = [node]

  while (toExplore.length > 0) {
    const current = toExplore.shift()
    if (!current) break

    // --- If the node is a <br> element, add a new line.
    if (current.nodeName === 'BR') {
      result.push(current)
      continue
    }

    // --- If the node is a text node, add it to the result.
    if (current.nodeType === Node.TEXT_NODE) {
      result.push(current as Text)
      continue
    }

    // --- Otherwise, add the child nodes to the exploration list.
    toExplore.push(...current.childNodes)
  }

  return result
}

/**
 * Return the text length of a node. If the node is a text node, return the
 * length of the text. If the node is a <br> element, return 1. Otherwise,
 * return the length of the text content of the node.
 *
 * @param node The node to get the length of.
 * @returns The length of the node.
 * @example const length = getNodeLength(node) // 5
 */
function getNodeLength(node: Node): number {
  if (node.nodeName === 'BR') return 1
  if (node.nodeType === Node.TEXT_NODE) return (node as Text).length
  return (node as HTMLElement).innerText?.length ?? 0
}

/**
 * Create a cursor object with the provided parent element, start offset, and
 * end offset.
 *
 * @param parent The parent element of the cursor.
 * @param start The start offset of the cursor.
 * @param end The end offset of the cursor.
 * @returns A cursor object with the parent element and the cursor offsets.
 */
function createCursor(parent: HTMLElement, start: number, end: number): Cursor {
  return {
    parent,
    start,
    end,
    get text() {
      const nodes = getChildTextNodes(parent)
      const text = nodes.map(node => (node.nodeName === 'BR' ? '\n' : node.textContent)).join('')
      return text.slice(start, end)
    },
    apply() {
      setCursor(parent, start, end)
    },
  }
}

/**
 * Get the cursor offset at the current selection. If a parent element is
 * provided, the cursor offset will be relative to that element. If no parent
 * is provided, the cursor offset will be relative to the common ancestor
 * container of the selection.
 *
 * @param parent The element to get the cursor offset relative to.
 * @returns A cursor object with the parent element and the cursor offsets.
 * @example const cursor = getCursor() // { parent: <div>, start: 0, end: 5, text: 'Hello' }
 */
export function getCursor(parent?: HTMLElement): Cursor | undefined {
  const selection = window.getSelection()
  if (!selection) return
  if (selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)

  // --- If not parent is provided, use the common ancestor container.
  if (!parent) parent = range.commonAncestorContainer as HTMLElement
  while (parent.nodeType !== Node.ELEMENT_NODE) parent = parent.parentElement!

  // --- If rangeStart is the parent, the offset corresponds an index of the
  // --- child nodes. If so, we convert the offset to a text offset.
  if (range.startContainer === parent) {
    let index = 0
    let start = 0
    let end = 0

    for (const node of parent.childNodes) {
      if (index < range.startOffset) start += getNodeLength(node)
      if (index < range.endOffset) end += getNodeLength(node)
      else break
      index++
    }

    return createCursor(parent, start, end)
  }

  // --- Initialize variables.
  let start = 0
  let end = 0
  let foundStart = false
  const nodes = getChildTextNodes(parent)

  // --- Traverse the text nodes to find the cursor offset relative to the parent.
  for (const node of nodes) {
    const isNodeStart = range.startContainer.contains(node)
    const isNodeEnd = range.endContainer.contains(node)
    if (isNodeStart) { start += range.startOffset; foundStart = true }
    if (isNodeEnd) { end += range.endOffset; break }
    if (!foundStart) start += getNodeLength(node)
    end += getNodeLength(node)
  }

  // --- Return the cursor offset.
  return createCursor(parent, start, end)
}

/**
 * Set the cursor at the specified offsets in the provided element. If no end
 * offset is provided, the cursor will be set to the start offset.
 *
 * @param element The element to set the cursor in.
 * @param start The start offset of the cursor.
 * @param end The end offset of the cursor.
 * @example
 *
 * // Create a new element and text node.
 * const div = document.createElement('div')
 * const text = document.createTextNode('Hello, World!')
 * div.appendChild(text)
 * document.body.appendChild(div)
 *
 * // Set the cursor to the end of the text node.
 * setCursor(div, 0, 13) // 'Hello, World!' is now selected.
 */
export function setCursor(element: HTMLElement, start = 0, end = start): void {
  const selection = window.getSelection()
  const range = document.createRange()
  if (!selection) return
  range.selectNodeContents(element)
  const nodes = getChildTextNodes(element)

  // --- Initialize variables.
  let foundStart = false
  let textStart = 0
  let textEnd = 0

  // --- Traverse the text nodes to find the start and end nodes. Once found,
  // --- set the start and end offsets of the range.
  for (const node of nodes) {
    textEnd = textStart + getNodeLength(node)

    if (!foundStart && start >= textStart && start <= textEnd) {
      foundStart = true
      if (node.nodeType === Node.TEXT_NODE) range.setStart(node, start - textStart)
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

/* v8 ignore start */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {

  function createTestElement(...children: Array<Node | string>) {
    const div = document.createElement('div')
    children = children.map(child => (typeof child === 'string' ? document.createTextNode(child) : child))
    div.append(...children)
    document.body.append(div)
    return div
  }

  function setSelection(startNode: Node, startOffset: number, endNode: Node, endOffset: number) {
    const selection = window.getSelection()!
    selection.removeAllRanges()
    const range = document.createRange()
    range.setStart(startNode, startOffset)
    range.setEnd(endNode, endOffset)
    selection.addRange(range)
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // @vitest-environment happy-dom
  describe('getCursor', () => {

    describe('single node', () => {
      it('should return the cursor when the selection all in one text node', () => {
        const div = createTestElement('Hello, World!')
        setSelection(div.firstChild!, 0, div.firstChild!, 13)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 0,
          end: 13,
          text: 'Hello, World!',
        })
      })

      it('should return the cursor when the selection is in the end of a text node', () => {
        const div = createTestElement('Hello, World!')
        setSelection(div.firstChild!, 7, div.firstChild!, 13)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 7,
          end: 13,
          text: 'World!',
        })
      })

      it('should return the cursor when the selection is in the middle of a text node', () => {
        const div = createTestElement('Hello, World!')
        setSelection(div.firstChild!, 5, div.firstChild!, 7)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 5,
          end: 7,
          text: ', ',
        })
      })

      it('should return the cursor when the selection is in the start of a text node', () => {
        const div = createTestElement('Hello, World!')
        setSelection(div.firstChild!, 0, div.firstChild!, 5)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 0,
          end: 5,
          text: 'Hello',
        })
      })
    })

    describe('multiple nodes', () => {
      it('should return the cursor when the selection spans multiple text nodes', () => {
        const div = createTestElement('Hello', 'World!')
        setSelection(div.firstChild!, 0, div.lastChild!, 6)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 0,
          end: 11,
          text: 'HelloWorld!',
        })
      })

      it('should return the cursor when the selection is in-between text nodes', () => {
        const div = createTestElement('Foo', 'Bar')
        setSelection(div.firstChild!, 2, div.lastChild!, 1)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 2,
          end: 4,
          text: 'oB',
        })
      })

      it('should return the cursor when the selection contains a <div> element', () => {
        const div = createTestElement('Foo', document.createElement('div'), 'Bar')
        setSelection(div.firstChild!, 2, div.lastChild!, 1)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 2,
          end: 4,
          text: 'oB',
        })
      })

      it('should count <br> elements as new lines', () => {
        const div = createTestElement('Hello', document.createElement('br'), 'World!')
        setSelection(div.firstChild!, 0, div.lastChild!, 6)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 0,
          end: 12,
          text: 'Hello\nWorld!',
        })
      })

      it('should return the cursor at the <br> element', () => {
        const div = createTestElement('Hello', document.createElement('br'), 'World!')
        setSelection(div, 1, div, 1)
        const result = getCursor(div)
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 5,
          end: 5,
          text: '',
        })
      })
    })

    describe('nested nodes', () => {
      it('should return the cursor when the selection spans nested text nodes', () => {
        const div = createTestElement(
          createTestElement('Hello', document.createElement('br'), 'World!'),
          createTestElement('Foo', document.createElement('br'), 'Bar'),
        )
        setSelection(div.firstChild!.firstChild!, 0, div.lastChild!.lastChild!, 3)
        const result = getCursor()
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: div,
          start: 0,
          end: 19,
          text: 'Hello\nWorld!Foo\nBar',
        })
      })

      it('should return the cursor from a relative parent element', () => {
        const div = createTestElement(
          createTestElement('Hello', document.createElement('br'), 'World!'),
          createTestElement('Foo', document.createElement('br'), 'Bar'),
        )
        setSelection(div.lastChild!.firstChild!, 0, div.lastChild!.lastChild!, 3)
        const result = getCursor(document.body)
        expect(result).toStrictEqual({
          apply: expect.any(Function),
          parent: document.body,
          start: 12,
          end: 19,
          text: 'Foo\nBar',
        })
      })
    })
  })

  describe('setCursor', () => {
    it('should set the cursor in a text node', () => {
      const div = createTestElement('Hello, World!')
      setCursor(div, 0, 13)
      const cursor = getCursor()
      expect(cursor).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 0,
        end: 13,
        text: 'Hello, World!',
      })
    })

    it('should set the cursor in-between text nodes', () => {
      const div = createTestElement('Foo', 'Bar')
      setCursor(div, 2, 4)
      const cursor = getCursor()
      expect(cursor).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 2,
        end: 4,
        text: 'oB',
      })
    })

    it('should set the cursor in-between nested text nodes', () => {
      const div = createTestElement(
        createTestElement('Hello', document.createElement('br'), 'World!'),
        createTestElement('Foo', document.createElement('br'), 'Bar'),
      )
      setCursor(div, 0, 19)
      const cursor = getCursor(div)
      expect(cursor).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 0,
        end: 19,
        text: 'Hello\nWorld!Foo\nBar',
      })
    })

    it('should set the end cursor to the start cursor if no end is provided', () => {
      const div = createTestElement('Hello, World!')
      setCursor(div, 5)
      const cursor = getCursor()
      expect(cursor).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 5,
        end: 5,
        text: '',
      })
    })

    it('should set the start cursor at 0 if no start is provided', () => {
      const div = createTestElement('Hello, World!')
      setCursor(div)
      const result = getCursor()
      expect(result).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 0,
        end: 0,
        text: '',
      })
    })

    it('should set the cursor in a relative parent element', () => {
      const div = createTestElement('Hello, World!')
      setCursor(div, 0, 13)
      const cursor = getCursor()
      setCursor(document.body, cursor!.start, cursor!.end)
      const result = getCursor()
      expect(result).toStrictEqual({
        apply: expect.any(Function),
        parent: div,
        start: 0,
        end: 13,
        text: 'Hello, World!',
      })
    })
  })
}
