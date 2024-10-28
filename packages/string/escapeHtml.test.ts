import { escapeHtml } from './escapeHtml'

describe('escapeHtml', () => {
  test('should escape HTML ampersands', () => {
    const result = escapeHtml('foo&bar')
    expect(result).toBe('foo&amp;bar')
  })

  test('should not escape already escaped HTML ampersands', () => {
    const result = escapeHtml('foo&amp;bar')
    expect(result).toBe('foo&amp;bar')
  })

  test('should escape HTML less-than signs', () => {
    const result = escapeHtml('foo<bar')
    expect(result).toBe('foo&lt;bar')
  })

  test('should escape HTML greater-than signs', () => {
    const result = escapeHtml('foo>bar')
    expect(result).toBe('foo&gt;bar')
  })

  test('should escape HTML double quotes', () => {
    const result = escapeHtml('foo"bar')
    expect(result).toBe('foo&quot;bar')
  })

  test('should escape HTML single quotes', () => {
    const result = escapeHtml('foo\'bar')
    expect(result).toBe('foo&#39;bar')
  })

  test('should throw if value is not a string', () => {

    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => escapeHtml(1)
    expect(shouldThrow).toThrow(TypeError)
  })
})
