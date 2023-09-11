/* eslint-disable sonarjs/no-duplicate-string */
/**
 * Remove the leading tabs from a string. This is useful for removing the
 * indentation from a multiline string literal. The indentation is determined
 * by the first line that contains a non-whitespace character.
 *
 * @param string The string to remove leading tabs from.
 * @returns The string with leading tabs removed.
 * @example dedent('\tHello\n\tWorld') // 'Hello\nWorld'
 */
export function dedent(string: string): string {
  // --- Find the first non-empty line and determine the indentation.
  const lines = string.split('\n')
  const firstLine = lines.find(line => line.trim() !== '')

  // --- If there is no first line, return the string as-is.
  if (!firstLine) return string

  // --- Remove the indentation from each line.
  const indent = firstLine.match(/^\s*/)?.[0] ?? ''
  return lines.map(line => line.replace(indent, '')).join('\n')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('removes leading tabs from a uniform string', () => {
    const string = dedent('\tHello\n\tWorld')
    expect(string).toBe('Hello\nWorld')
  })

  it('removes leading tabs from a non-uniform string', () => {
    const string = dedent('\tHello\n\t\tWorld')
    expect(string).toBe('Hello\n\tWorld')
  })

  it('does not remove leading tabs from a string with no leading tabs', () => {
    const string = dedent('Hello\n\tWorld')
    expect(string).toBe('Hello\n\tWorld')
  })

  it('removes leading spaces from a uniform string', () => {
    const string = dedent('  Hello\n  World')
    expect(string).toBe('Hello\nWorld')
  })

  it('removes leading spaces from a non-uniform string', () => {
    const string = dedent('  Hello\n    World')
    expect(string).toBe('Hello\n  World')
  })

  it('does not remove leading spaces from a string with no leading spaces', () => {
    const string = dedent('Hello\n  World')
    expect(string).toBe('Hello\n  World')
  })
}
