/**
 * Remove the leading indents from a string. The indentation is determined
 * by the first line that contains a non-whitespace character.  This is useful
 * for removing the indentation from a multiline string literal such as code
 * snippets, SQL queries, markdown templates, etc.
 *
 * @param string The string to remove leading indents from.
 * @returns The string with leading indents removed.
 * @example dedent(`\tHello\n\t\tWorld`) // `Hello\n\tWorld`
 */
export function dedent(string: string): string {

  // --- Find the first non-empty line and determine the indentation.
  const lines = string.split('\n')
  const firstContent = lines.find(line => line.trim() !== '')

  // --- If there is no first line, return the string as-is.
  if (!firstContent) return string

  // --- Get the indent of the first line.
  const firstIndent = firstContent.match(/^[\t\r ]+/)
  if (!firstIndent) return string

  // --- Remove the leading indents from all lines.
  const indent = firstIndent[0].length
  return lines
    .map(line => line.slice(indent))
    .join('\n')
    .trimStart()
    .replace(/\n+$/, '\n')
}

/* v8 ignore start */
if (import.meta.vitest) {
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
    expect(string).toBe('Hello\nWorld\n')
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
}
