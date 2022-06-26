import { expect, it } from 'vitest'
import { toUtf8 } from './toUtf8'
import { fromHex } from './fromHex'

it.each([
  ['', '', 0],
  ['666f6f626172', 'foobar', 6],
  ['0x54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67', 'The quick brown fox jumps over the lazy dog', 43],
])('converts a base64 string "%s" to an ArrayBuffer equal to "%s"', (input, expected, expectedLength) => {
  const result = fromHex(input)
  const resultUtf8 = toUtf8(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toEqual(expectedLength)
  expect(resultUtf8).toEqual(expected)
})

it('throws if the given string is not valid base64', () => {
  expect(() => { fromHex('?') }).toThrowError()
  expect(() => { fromHex('00000') }).toThrowError()
})
