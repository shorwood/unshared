import { expect, it } from 'vitest'
import { fromUtf8 } from './fromUtf8'
import { toBase64 } from './toBase64'

it.each([
  ['', ''],
  ['f', 'Zg=='],
  ['foob', 'Zm9vYg=='],
  ['fooba', 'Zm9vYmE='],
  ['foobar', 'Zm9vYmFy'],
  ['The quick brown fox jumps over the lazy dog', 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='],
])('converts an ArrayBuffer equal to "%s" to a Base64 string equal to "%s"', (input, expected) => {
  const buffer = fromUtf8(input)
  const result = toBase64(buffer)
  expect(result).toBe(expected)
  expect(result).toBeTypeOf('string')
  expect(result.length).toBe(expected.length)
})
