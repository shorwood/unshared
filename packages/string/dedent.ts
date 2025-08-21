/**
 * Remove the leading indents from a string. The indentation is determined
 * by the first line that contains a non-whitespace character.  This is useful
 * for removing the indentation from a multiline string literal such as code
 * snippets, SQL queries, markdown templates, etc.
 *
 * @param strings The template literal strings.
 * @param values The interpolated values.
 * @returns The string with leading indents removed.
 * @example
 *
 * const string = dedent`
 *   Hello
 *   World
 * `
 */
export function dedent(strings: TemplateStringsArray, ...values: any[]): string

/**
 * Remove the leading indents from a string. The indentation is determined
 * by the first line that contains a non-whitespace character. This is useful
 * for removing the indentation from a multiline string literal such as code
 * snippets, SQL queries, markdown templates, etc.
 *
 * @param string The string to dedent.
 * @returns The string with leading indents removed.
 * @example dedent('  Hello\n  World') // 'Hello\nWorld'
 */
export function dedent(string: string): string

/**
 * Remove the leading indents from a string. The indentation is determined
 * by the first line that contains a non-whitespace character. This is useful
 * for removing the indentation from a multiline string literal such as code
 * snippets, SQL queries, markdown templates, etc.
 *
 * @param stringsOrString The string or template literal to dedent.
 * @param values The interpolated values if using template literals.
 * @returns The string with leading indents removed.
 * @example dedent('  Hello\n  World') // 'Hello\nWorld'
 * @example dedent`\tHello\n\tWorld` // 'Hello\nWorld'
 */
export function dedent(stringsOrString: string | TemplateStringsArray, ...values: any[]): string
export function dedent(stringsOrString: string | TemplateStringsArray, ...values: any[]): string {

  // Handle template literal syntax
  if (Array.isArray(stringsOrString)) {
    const strings = stringsOrString as TemplateStringsArray
    let result = ''
    for (const [i, string_] of strings.entries()) {
      result += string_
      if (i < values.length) result += String(values[i])
    }
    stringsOrString = result
  }

  const string = stringsOrString as string

  // --- Find the first non-empty line and determine the indentation.
  const lines = string.split('\n')
  const firstContent = lines.find(line => line.trim() !== '')

  // --- If there is no first line, return the string as-is.
  if (!firstContent) return string

  // --- Get the indent of the first line.
  const firstIndent = /^[\t\r ]+/.exec(firstContent)
  if (!firstIndent) return string

  // --- Remove the leading indents from all lines.
  const indent = firstIndent[0].length
  return lines
    .map(line => line.slice(indent))
    .join('\n')
    .trim()
}
