import type { Trim } from '@unshared/types'

/**
 * Removes the leading and trailing white space and line terminator
 * characters from a string. This function is a wrapper around the
 * `String.prototype.trim` method but allows to use it in a functional
 * manner. It also provides type inference for the new string.
 *
 * @param string The string to trim.
 * @returns The trimmed string.
 * @example trim(' Hello world ') // 'Hello world'
 */
export function trim<S extends string>(string: S): Trim<S> {
  return string.trim() as Trim<S>
}
