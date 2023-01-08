import { kindOf } from '../misc/kindOf'

/**
 * Checks if the value is of a specific kind.
 * @param value The value to check
 * @param kind The expected kind(s)
 * @return `true` if the value is of the expected kind, `false` otherwise
 * @see `kindOf()`
 * @example
 * isKind('foo', 'string') // true
 * isKind('foo', 'number') // false
 * isKind('foo', ['string', 'number']) // true
 */
export const isKind = (value: any, kind: string | string[]): boolean => {
  // --- Get the kind of the value
  const valueKind = kindOf(value)

  // --- Check if the value is of the expected kind
  return (Array.isArray(kind))
    ? kind.includes(valueKind)
    : kind === valueKind
}
