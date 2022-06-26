import { expect, it } from 'vitest'
import { fromUtf8 } from './fromUtf8'
import { toHex } from './toHex'

it.each([
  ['', '', 0],
  ['foobar', '666f6f626172', 12],
  ['The quick brown fox jumps over the lazy dog', '54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67', 86],
])('converts an ArrayBuffer to a UTF8 string', (input, expected, expectedLength) => {
  const buffer = fromUtf8(input)
  const result = toHex(buffer)
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(expectedLength)
  expect(result).toEqual(expected)
})
