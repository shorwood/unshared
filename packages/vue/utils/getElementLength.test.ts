import { getElementLength } from './getElementLength'

// @vitest-environment happy-dom
describe('getElementLength', () => {
  test('should return the length of a text node', () => {
    const text = document.createTextNode('Hello')
    const result = getElementLength(text)
    expect(result).toBe(5)
  })

  test('should return the length of a br element', () => {
    const br = document.createElement('br')
    const result = getElementLength(br)
    expect(result).toBe(1)
  })

  test('should return the length of a <div> element', () => {
    const div = document.createElement('div')
    div.textContent = 'Hello, World!'
    const result = getElementLength(div)
    expect(result).toBe(13)
  })
})
