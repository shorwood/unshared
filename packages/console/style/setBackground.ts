import { RGB } from '../types'

/**
 * Colorize the background of a string with the given color.
 *
 * @param text The string to colorize.
 * @param color The color to use.
 * @returns The colorized string.
 * @example setBackground("Hello", [1, 2, 3]) // "\u001B[48;2;1;2;3mHello\u001B[49m"
 */
export function setBackground(text: string, color: RGB): string {
  const [r, g, b] = color
  return `\u001B[48;2;${r};${g};${b}m${text}\u001B[49m`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should colorize the background of a string', () => {
    const result = setBackground('Hello', [1, 2, 3])
    expect(result).toEqual('\u001B[48;2;1;2;3mHello\u001B[49m')
  })
}
