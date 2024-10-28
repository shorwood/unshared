import { removeTrailingQuotes } from './removeTrailingQuotes'

describe('removeTrailingQuotes', () => {
  test('should remove trailing quotes from a string', () => {
    const result = removeTrailingQuotes('"Hello, world!"')
    expect(result).toBe('Hello, world!')
  })

  test('should not remove quotes from the middle of a string', () => {
    const result = removeTrailingQuotes('Hello, "world!"')
    expect(result).toBe('Hello, "world!"')
  })

  test('should not remove quotes from the beginning of a string', () => {
    const result = removeTrailingQuotes('"Hello", world!')
    expect(result).toBe('"Hello", world!')
  })

  test('should return the string as is if it is not quoted', () => {
    const result = removeTrailingQuotes('Hello, world!')
    expect(result).toBe('Hello, world!')
  })
})
