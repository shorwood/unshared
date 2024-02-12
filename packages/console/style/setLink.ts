/**
 * Wrap a string in an hyperlink.
 *
 * @param text The string to wrap.
 * @param url The url to link to.
 * @returns The wrapped string.
 * @example setLink('Hello', 'https://example.com') // '\u001B]8;;https://example.com\u0007Hello\u001B]8;;\u0007'
 */
export function setLink(text: string, url: string | URL): string {
  url = url instanceof URL ? url.toString() : url
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a link with a string URL', () => {
    const result = setLink('Hello', 'https://example.com/')
    expect(result).toEqual('\u001B]8;;https://example.com/\u0007Hello\u001B]8;;\u0007')
  })

  it('should create a link with an URL object', () => {
    const result = setLink('Hello', new URL('https://example.com/'))
    expect(result).toEqual('\u001B]8;;https://example.com/\u0007Hello\u001B]8;;\u0007')
  })
}
