/* eslint-disable sonarjs/no-duplicate-string */
import { MaybeArray } from '@unshared/types'

export type DistinguishedName = Record<string, MaybeArray<string>>

/**
 * Parse a [distinguished name](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) into
 * an object with the attributes. The attributes are case-insensitive and should
 * respect the [RFC 4514](https://www.rfc-editor.org/rfc/rfc4514) standard.
 *
 * @param name The distinguished name to parse.
 * @deprecated Yet to respect the RFC 4514 standard.
 * @returns An object with the attributes.
 */
export function parseDistinguishedName(name: string): DistinguishedName {
  if (typeof name !== 'string')
    throw new TypeError('Expected the DN to be a string')

  // --- Split the name into parts
  const attributes: DistinguishedName = {}
  const parts = name.split(/(?<!\\),/)
  for (const part of parts) {
    const parts = part.split(/(?<!\\)=/)
    const key = parts[0].trim()
    const value = parts[1]
      .replace(/\\,/g, ',')
      .replace(/\\=/g, '=')
      .trim()

    if (attributes[key] === undefined) attributes[key] = value
    else if (Array.isArray(attributes[key])) attributes[key].push(value)
    else attributes[key] = [attributes[key], value]
  }

  // --- Return the attributes
  return attributes
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should parse a simple DN', () => {
    const result = parseDistinguishedName('CN=example.com,O=Example')
    expect(result).toEqual({
      CN: 'example.com',
      O: 'Example',
    })
  })

  it('should parse a DN with spaces', () => {
    const result = parseDistinguishedName('CN=example.com, O=Example')
    expect(result).toEqual({
      CN: 'example.com',
      O: 'Example',
    })
  })

  it('should parse a DN with escaped commas', () => {
    const result = parseDistinguishedName('CN=example\\,com,O=Example')
    expect(result).toEqual({
      CN: 'example,com',
      O: 'Example',
    })
  })

  it('should parse a DN with escaped equals', () => {
    const result = parseDistinguishedName('CN=example\\=com,O=Example')
    expect(result).toEqual({
      CN: 'example=com',
      O: 'Example',
    })
  })

  it('should parse a DN with multiple values', () => {
    const result = parseDistinguishedName('CN=example.com,O=Example,O=Example2')
    expect(result).toEqual({
      CN: 'example.com',
      O: ['Example', 'Example2'],
    })
  })
}
