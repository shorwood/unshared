import { escapeAnsiSequences } from './escapeAnsiSequences'

describe('escapeAnsiSequences', () => {
  test('should escape ANSI sequences from a string', () => {
    const result = escapeAnsiSequences('\u001B[1mHello\u001B[22m')
    expect(result).toBe('Hello')
  })

  test('should escape ANSI sequences from a string with multiple sequences', () => {
    const result = escapeAnsiSequences('\u001B[1mHello\u001B[22m \u001B[2mWorld\u001B[22m')
    expect(result).toBe('Hello World')
  })

  test('should escape hyperlinks', () => {
    const result = escapeAnsiSequences('\u001B]8;;https://example.com\u0007Hello\u001B]8;;\u0007')
    expect(result).toBe('Hello')
  })
})
