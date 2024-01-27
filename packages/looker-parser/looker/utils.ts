import { Parser } from './parser'

/**
 * Modified strip which returns the stripped whitespace.
 *
 * @param s The string to strip whitespace from.
 * @returns A tuple containing the left stripped whitespace, stripped string, and right stripped whitespace.
 */
export function strip(s: string): [string, string, string] {
  const matches = s.match(/^(\s*)(.*?)(\s*)$/)
  if (!matches) return ['', s, '']
  const [, left, stripped, right] = matches
  return [left, stripped, right]
}

/**
 * Converts a singular key like "explore" to a plural key, e.g. 'explores'.
 *
 * @param key The key to pluralize.
 * @returns The pluralized key.
 * @example pluralize('explore') // => 'explores'
 */
export function pluralize(key: string): string {
  if (key in ['filters', 'bindFilters', 'extends']) return `${key}__all`
  if (key === 'query') return 'queries'
  return `${key}s`
}

/**
 * Converts a plural key like "explores" to a singular key, e.g. 'explore'.
 *
 * @param key The key to singularize.
 * @returns The singularized key.
 * @example singularize('explores') // => 'explore'
 */
export function singularize(key: string): string {
  if (key === 'queries') return 'query'
  if (key.endsWith('__all')) return key.slice(0, -5)
  if (key.endsWith('s')) return key.slice(0, -1)
  return key
}

/**
 * Decorates parsing methods to backtrack to a previous position on failure.
 *
 * This method sets a marker at the current position before attempting to run a
 * parsing method. If the parsing method fails and returns `None`, it resets the
 * index to the marker.
 *
 * It also keeps track of the farthest index of progress in case all parsing
 * methods fail and we need to return a SyntaxError to the user with a character
 * number.
 *
 * @param target The object containing the parsing method.
 * @param propertyKey The name of the parsing method.
 * @param descriptor The property descriptor for the parsing method.
 * @returns The property descriptor for the parsing method.
 */
export function Backtrack(target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value

  // --- Wrap the original method with the backtrack logic.
  descriptor.value = function(this: Parser, ...parameters: unknown[]) {
    const mark = this.index

    // --- Run the original method while keeping track of the depth.
    this.depth += 1
    const result = originalMethod.apply(this, parameters)
    this.depth -= 1

    // --- Reset the index if the method returned `undefined`.
    if (!result) {
      this.index = mark
      this.progress = Math.max(this.index, this.progress)
      this.progress = Math.min(this.progress, this.tokens.length - 1)
    }

    // --- Return the result.
    return result
  }

  // --- Return the descriptor.
  return descriptor
}
