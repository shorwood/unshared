import { RGB } from '../types'

/**
 * Colorize the text of a string with the given color.
 *
 * @param text The string to colorize.
 * @param color The color to use.
 * @returns The colorized string.
 * @example setColor("Hello", [1, 2, 3]) // "\u001B[38;2;1;2;3mHello\u001B[39m"
 */
export function setColor(text: string, color: RGB): string {
  const [r, g, b] = color
  return `\u001B[38;2;${r};${g};${b}m${text}\u001B[39m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should colorize the text of a string', () => {
    const result = setColor('Hello', [1, 2, 3])
    expect(result).toEqual('\u001B[38;2;1;2;3mHello\u001B[39m')
  })
}
