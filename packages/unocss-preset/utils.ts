import type { VariantObject } from '@unocss/core'
import type { MaybeArray } from '@unshared/types'

/**
 * Create an UnoCSS variant based on a keyword.
 *
 * @param name The prefix to match.
 * @param template The template of the selector to generate.
 * @returns An UnoCSS variant object.
 * @example
 * createVariant('current', '&[aria-current="page"]')
 * // => { name: 'current', match: ..., autocomplete: 'current:' }
 */
export function createVariant(name: string, template: MaybeArray<string>): VariantObject {
  return {
    name,
    autocomplete: `${name}:`,
    match: (input: string) => {
      const regexp = new RegExp(`^${name}[:-]`)
      const match = regexp.exec(input)
      const queries = Array.isArray(template) ? template : [template]
      if (match) {
        return {
          matcher: input.slice(match[0].length),
          selector: (s: string) => queries.map(query => query.replaceAll('&', s)).join(','),
        }
      }
    },
  }
}
