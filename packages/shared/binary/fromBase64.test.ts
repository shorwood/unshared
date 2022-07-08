import { expect, it } from 'vitest'
import { toUtf8 } from './toUtf8'
import { fromBase64 } from './fromBase64'

it.each([

  ['', ''],
  ['Zg==', 'f'],
  ['Zm9vYg==', 'foob'],
  ['Zm9vYmE=', 'fooba'],
  ['Zm9vYmFy', 'foobar'],
  ['VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==', 'The quick brown fox jumps over the lazy dog'],

])('converts a base64 string "%s" to an ArrayBuffer equal to "%s"', (input, expected) => {
  const result = fromBase64(input)
  const resultUtf8 = toUtf8(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toEqual(expected.length)
  expect(resultUtf8).toEqual(expected)
})

it('throws if the given string is not valid base64', () => {
  expect(() => { fromBase64('?') }).toThrowError()
  expect(() => { fromBase64('00000') }).toThrowError()
})
