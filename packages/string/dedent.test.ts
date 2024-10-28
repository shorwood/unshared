import { dedent } from './dedent'

describe('dedent', () => {
  test('should return the string as-is if there is no first line', () => {
    const string = dedent('\n\n\n')
    expect(string).toBe('\n\n\n')
  })

  test('should return the string as is if there is no leading indents', () => {
    const string = dedent('Hello\nWorld')
    expect(string).toBe('Hello\nWorld')
  })

  test('should removes leading indents from a uniform string', () => {
    const string = dedent('\tHello\n\tWorld')
    expect(string).toBe('Hello\nWorld')
  })

  test('should remove single line indents', () => {
    const string = dedent('\tHello World')
    expect(string).toBe('Hello World')
  })

  test('should remove leading indents but keep indents in the middle of the string', () => {
    const string = dedent('\n\tHello\n\t\tWorld')
    expect(string).toBe('Hello\n\tWorld')
  })

  test('should remove extra newlines at the end of the string', () => {
    const string = dedent('\tHello\n\tWorld\n\n\n')
    expect(string).toBe('Hello\nWorld')
  })

  test('should remove extra newlines at the beginning of the string', () => {
    const string = dedent('\n\n\n\tHello\n\tWorld')
    expect(string).toBe('Hello\nWorld')
  })

  test('should not remove leading indents from a string with no leading indents', () => {
    const string = dedent('Hello\n\tWorld')
    expect(string).toBe('Hello\n\tWorld')
  })

  test('should remove leading space indents from all lines', () => {
    const string = dedent('  Hello\n  World')
    expect(string).toBe('Hello\nWorld')
  })

  test('should remove leading spaces but keep indents in the middle of the string', () => {
    const string = dedent('  Hello\n    World')
    expect(string).toBe('Hello\n  World')
  })

  test('should not remove leading spaces from a string with no leading spaces', () => {
    const string = dedent('Hello\n  World')
    expect(string).toBe('Hello\n  World')
  })
})
