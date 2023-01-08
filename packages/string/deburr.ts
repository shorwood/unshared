/**
 * Replace all Unicode characters by their ASCII counterpart.
 * @param value The string to deburr.
 * @returns The deburred string.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/deburr
 * @example
 * deburr('José piña') // => 'Jose pina'
 */
export const deburr = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
