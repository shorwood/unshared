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
  const firstIndent = /^[\t\r ]+/.exec(firstContent)
  if (!firstIndent) return string

  // --- Remove the leading indents from all lines.
  const indent = firstIndent[0].length
  return lines
    .map(line => line.slice(indent))
    .join('\n')
    .trim()
}
