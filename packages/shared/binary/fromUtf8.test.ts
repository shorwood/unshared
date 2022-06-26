import { expect, it } from 'vitest'
import { toUtf8 } from './toUtf8'
import { fromUtf8 } from './fromUtf8'

it.each([
  ['', '', 0],
  ['\u3000', '\u0000', 1],
  ['foobar', 'foobar', 6],
  ['The quick brown fox jumps over the lazy dog', 'The quick brown fox jumps over the lazy dog', 43],
])('converts a base64 string "%s" to an ArrayBuffer equal to "%s"', (input, expected, expectedLength) => {
  const result = fromUtf8(input)
  const resultUtf8 = toUtf8(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(resultUtf8).toEqual(expected)
  expect(result.byteLength).toEqual(expectedLength)
})
