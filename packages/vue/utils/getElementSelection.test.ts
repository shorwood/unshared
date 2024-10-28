import { getElementSelection } from './getElementSelection'

// @vitest-environment happy-dom
describe('getElementSelection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    const selection = globalThis.getSelection()
    if (selection) selection.removeAllRanges()
  })

  describe('undefined', () => {
    it('should return undefined if the element is not provided', () => {
      const result = getElementSelection()
      expect(result).toBeUndefined()
    })
  })

  describe('input', () => {
    it('should return the cursor offset of an input element', () => {
      const input = document.createElement('input')
      document.body.append(input)
      input.value = 'Hello, World!'
      input.focus()
      input.setSelectionRange(1, 5)
      const result = getElementSelection(input)
      expect(result).toStrictEqual({ index: 1, length: 4 })
    })

    it('should return the cursor offset of a textarea element', () => {
      const textarea = document.createElement('textarea')
      document.body.append(textarea)
      textarea.value = 'Hello, World!'
      textarea.focus()
      textarea.setSelectionRange(1, 5)
      const result = getElementSelection(textarea)
      expect(result).toStrictEqual({ index: 1, length: 4 })
    })

    it('should return undefined if the input has no selection', () => {
      const input = document.createElement('input')
      input.value = 'Hello, World!'
      const result = getElementSelection(input)
      expect(result).toBeUndefined()
    })
  })

  describe('div', () => {
    it('should return the cursor offset of a div element', () => {
      const div = document.createElement('div')
      div.innerHTML = 'Hello, World!'
      const range = document.createRange()
      range.setStart(div.firstChild!, 3)
      range.setEnd(div.firstChild!, 8)
      const selection = globalThis.getSelection()
      selection!.removeAllRanges()
      selection!.addRange(range)
      const result = getElementSelection(div)
      expect(result).toStrictEqual({
        index: 3,
        length: 5,
        range,
      })
    })

    it('should return the cursor offset of a nested element', () => {
      const div = document.createElement('div')
      div.innerHTML = 'Hello,<span>World!</span>'
      const range = document.createRange()
      range.setStart(div.firstChild!, 3)
      range.setEnd(div.lastChild!.firstChild!, 5)
      const selection = globalThis.getSelection()
      selection!.removeAllRanges()
      selection!.addRange(range)
      const result = getElementSelection(div)
      expect(result).toStrictEqual({
        index: 3,
        length: 8,
        range,
      })
    })
  })
})
