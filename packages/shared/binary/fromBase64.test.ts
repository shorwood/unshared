/* eslint-disable unicorn/consistent-function-scoping */
import { expect, it } from 'vitest'
import { toUtf8 } from './toUtf8'
import { fromBase64 } from './fromBase64'

it('should convert a base64 string to an ArrayBuffer', () => {
  const expected = 'The quick brown fox jumps over the lazy dog'
  const result = fromBase64('VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==')
  const resultUtf8 = toUtf8(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toEqual(expected.length)
  expect(resultUtf8).toEqual(expected)
})

it('should throws if the given string "%s" is not valid base64', () => {
  const shouldThrow = () => fromBase64('?')
  expect(shouldThrow).toThrowError()
})
