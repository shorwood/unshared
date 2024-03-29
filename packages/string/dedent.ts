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
  const lines = string.split(/\n|\\n/)
  const firstLine = lines.find(line => line.trim() !== '')

  // --- If there is no first line, return the string as-is.
  if (!firstLine) return string

  // --- Get the indent of the first line.
  const indent = firstLine.match(/^[\t\r ]*/)?.[0].length ?? 0
  return lines
    .map(line => line.slice(indent)).join('\n')
    .trimStart()
    .replace(/\n+$/, '\n')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('removes leading indents from a uniform string', () => {
    const string = dedent('\tHello\n\tWorld')
    expect(string).toEqual('Hello\nWorld')
  })

  it('should remove single line indents', () => {
    const string = dedent('\tHello World')
    expect(string).toEqual('Hello World')
  })

  it('removes leading indents but keep indents in the middle of the string', () => {
    const string = dedent('\tHello\n\t\tWorld')
    expect(string).toEqual('Hello\n\tWorld')
  })

  it('should remove extra newlines at the end of the string', () => {
    const string = dedent('\tHello\n\tWorld\n\n\n')
    expect(string).toEqual('Hello\nWorld\n')
  })

  it('should remove extra newlines at the beginning of the string', () => {
    const string = dedent('\n\n\n\tHello\n\tWorld')
    expect(string).toEqual('Hello\nWorld')
  })

  it('does not remove leading indents from a string with no leading indents', () => {
    const string = dedent('Hello\n\tWorld')
    expect(string).toEqual('Hello\n\tWorld')
  })

  it('removes leading space indents from all lines', () => {
    const string = dedent('  Hello\n  World')
    expect(string).toEqual('Hello\nWorld')
  })

  it('removes leading spaces but keep indents in the middle of the string', () => {
    const string = dedent('  Hello\n    World')
    expect(string).toEqual('Hello\n  World')
  })

  it('does not remove leading spaces from a string with no leading spaces', () => {
    const string = dedent('Hello\n  World')
    expect(string).toEqual('Hello\n  World')
  })
}
