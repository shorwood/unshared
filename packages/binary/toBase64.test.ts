import { expect, it } from 'vitest'
import { fromUtf8 } from './fromUtf8'
import { toBase64 } from './toBase64'

it('converts an ArrayBuffer equal to "%s" to a Base64 string equal to "%s"', () => {
  const expected = 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
  const buffer = fromUtf8('The quick brown fox jumps over the lazy dog')
  const result = toBase64(buffer)
  expect(result).toEqual(expected)
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(expected.length)
})
