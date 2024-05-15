/** The special characters of a regular expression. */
export const regExpSpecialCharacters = ['?', '.', '(', ')', '[', ']', '{', '}', '*', '\\', '^', '+', '|', '$']

/** The special characters of a regular expression. */
export type RegExpSpecialCharacters = typeof regExpSpecialCharacters[number]

/**
 * Escape the special characters of Regular Expressions in a string. Allowing you to use the string in a RegExp
 * without having to worry about side-effects from the special characters.
 *
 * @param value The string to escape the special characters in.
 * @param escaped The characters to escape. By default all `RegExp` special characters are escaped.
 * @returns The escaped string.
 * @example escapeRegexp('Hello-World!?') // returns 'Hello-World\\!\\?'
 */
export function escapeRegexp(value: string, escaped = regExpSpecialCharacters): string {
  const replacementExpString = escaped.map(char => `\\${char}`).join('|')
  const replacementExp = new RegExp(replacementExpString, 'g')
  return value.replace(replacementExp, String.raw`\$&`)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should escape RegExp special characters', () => {
    const result = escapeRegexp('foo$foo(foo)foo*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo')
    const expected = String.raw`foo\$foo\(foo\)foo\*foo\+foo\.foo\?foo\[foo\]foo\^foo\{foo\}foo\|foo`
    expect(result).toStrictEqual(expected)
  })

  test('should only escape the specified RegExp special characters', () => {
    const result = escapeRegexp('foo$foo(foo)foo*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo', ['*'])
    const expected = String.raw`foo$foo(foo)foo\*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo`
    expect(result).toStrictEqual(expected)
  })
}
