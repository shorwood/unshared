import { expect, it } from 'vitest'
import { fromHex } from './fromHex'
import { toUtf8 } from './toUtf8'

it.each([
  ['', '', 0],
  ['666f6f626172', 'foobar', 6],
  ['0x54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67', 'The quick brown fox jumps over the lazy dog', 43],
])('converts an ArrayBuffer equal to "0x%s" to an UTF-8 string "%s"', (input, expected, expectedLength) => {
  const buffer = fromHex(input)
  const result = toUtf8(buffer)
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(expectedLength)
  expect(result).toEqual(expected)
})
