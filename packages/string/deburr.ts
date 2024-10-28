/**
 * Removes diacritics from a string.
 *
 * @param value The string to deburr.
 * @returns  The deburred string.
 * @example deburr('José piña') // => 'Jose pina'
 */
export function deburr(value: string): string {
  return value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
}
