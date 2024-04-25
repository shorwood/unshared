import { MaybeArray } from '@unshared/types'

/** A distinguished name attributes. */
export type DistinguishedName = Record<string, MaybeArray<string>>

/**
 * Parse a [distinguished name](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) into
 * an map of attributes. The attributes are case-sensitive and the values are always strings or arrays of strings.
 *
 * This implementation is loosely based on [RFC 4514](https://tools.ietf.org/html/rfc4514#section-2).
 *
 * @param name The distinguished name to parse.
 * @returns An object with the attributes.
 * @example
 *
 * // Create a distinguished name.
 * const dName = 'CN=example.com,CN=example.dev,O=Example,C=US,ST=California,L=Los Angeles'
 *
 * // Parse the distinguished name.
 * const dNameMap = parseDistinguishedName(dName)
 *
 * dNameMap.CN // ['example.com', 'example.dev']
 * dNameMap.O // 'Example'
 * dNameMap.C // 'US'
 * dNameMap.ST // 'California'
 * dNameMap.L // 'Los Angeles'
 */
// TODO: Actually implement the RFC 4514.
export function parseDistinguishedName(name: string): DistinguishedName {
  const attributes: DistinguishedName = {}
  const parts = name.split(/(?<!\\),/)
  for (const part of parts) {
    const parts = part.split(/(?<!\\)=/)
    const key = parts[0].trim()
    const value = parts[1].replaceAll(/\\(,)|\\(=)/g, '$1$2').trim()

    if (attributes[key] === undefined) attributes[key] = value
    else if (typeof attributes[key] === 'string') attributes[key] = [attributes[key] as string, value]
    else (attributes[key] as string[]).push(value)
  }

  // --- Return the attributes
  return attributes
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should parse a simple DN', () => {
    const result = parseDistinguishedName('CN=example.com,O=Example')
    expect(result).toStrictEqual({
      CN: 'example.com',
      O: 'Example',
    })
  })

  test('should parse a DN with spaces', () => {
    const result = parseDistinguishedName('CN=example.com, O=Example')
    expect(result).toStrictEqual({
      CN: 'example.com',
      O: 'Example',
    })
  })

  test('should parse a DN with escaped commas', () => {
    const result = parseDistinguishedName('CN=example\\,com,O=Example')
    expect(result).toStrictEqual({
      CN: 'example,com',
      O: 'Example',
    })
  })

  test('should parse a DN with escaped equal sign', () => {
    const result = parseDistinguishedName('CN=example\\=com,O=Example')
    expect(result).toStrictEqual({
      CN: 'example=com',
      O: 'Example',
    })
  })

  test('should parse a DN with multiple values', () => {
    const result = parseDistinguishedName('CN=example.com,O=Example,O=Example2')
    expect(result).toStrictEqual({
      CN: 'example.com',
      O: ['Example', 'Example2'],
    })
  })
}
