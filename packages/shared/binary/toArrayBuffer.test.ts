import { expect, it } from 'vitest'
import { toArrayBuffer } from './toArrayBuffer'
import { toHex } from './toHex'
import { toUtf8 } from './toUtf8'

const mockValues = [0x80, 0x4020, 0x804020, 0x80402010]
const mockValuesMixed = [0x80, 0x80402010, 0x8040201080402010n, true]

it.each([
  [new Uint8Array(mockValues).buffer, '80202010', 4],
  [new Uint8Array(mockValues), '80202010', 4],
  [new Uint16Array(mockValues), '8000204020401020', 8],
  [new Uint32Array(mockValues), '80000000204000002040800010204080', 16],
  [new BigUint64Array(mockValues.map(BigInt)), '8000000000000000204000000000000020408000000000001020408000000000', 32],
  [new Uint8ClampedArray(mockValues), '80ffffff', 4],
])('converts ArrayBuffer "%s" to an ArrayBuffer equal to "%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input)
  const resultHex = toHex(result)
  expect(resultHex).toBe(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  [mockValuesMixed[0], '80', 1],
  [mockValuesMixed[1], '10', 1],
  [mockValuesMixed[2], '00', 1],
  [mockValuesMixed[3], '01', 1],
  [mockValuesMixed, '80100001', 4],
])('converts Uint8 "%s" as to an ArrayBuffer equal to "0x%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input, 'uint8')
  const resultHex = toHex(result)
  expect(resultHex).toEqual(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  [mockValuesMixed[0], '8000', 2],
  [mockValuesMixed[1], '1020', 2],
  [mockValuesMixed[2], '0020', 2],
  [mockValuesMixed[3], '0100', 2],
  [mockValuesMixed, '8000102000200100', 8],
])('converts Uint16 "%s" to an ArrayBuffer equal to "0x%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input, 'uint16')
  const resultHex = toHex(result)
  expect(resultHex).toEqual(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  [mockValuesMixed[0], '80000000', 4],
  [mockValuesMixed[1], '10204080', 4],
  [mockValuesMixed[2], '00204080', 4],
  [mockValuesMixed[3], '01000000', 4],
  [mockValuesMixed, '80000000102040800020408001000000', 16],
])('converts Uint32 "%s" to an ArrayBuffer equal to "0x%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input, 'uint32')
  const resultHex = toHex(result)
  expect(resultHex).toEqual(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  [mockValuesMixed[0], '8000000000000000', 8],
  [mockValuesMixed[1], '1020408000000000', 8],
  [mockValuesMixed[2], '1020408010204080', 8],
  [mockValuesMixed[3], '0100000000000000', 8],
  [mockValuesMixed, '8000000000000000102040800000000010204080102040800100000000000000', 32],
])('converts Uint32 "%s" to an ArrayBuffer equal to "0x%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input, 'uint64')
  const resultHex = toHex(result)
  expect(resultHex).toEqual(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  [mockValuesMixed[0], '80', 1],
  [mockValuesMixed[1], 'ff', 1],
  [mockValuesMixed[2], 'ff', 1],
  [mockValuesMixed[3], '01', 1],
  [mockValuesMixed, '80ffff01', 4],
])('converts Uint8Clamped "%s" to an ArrayBuffer equal to "0x%s"', (input, expected, expectedLength) => {
  const result = toArrayBuffer(input, 'uint8clamped')
  const resultHex = toHex(result)
  expect(resultHex).toEqual(expected)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
})

it.each([
  ['The quick brown fox jumps over the lazy dog', 'utf8', 'The quick brown fox jumps over the lazy dog', 43],
  ['VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==', 'base64', 'The quick brown fox jumps over the lazy dog', 43],
  ['0x54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67', 'hex', 'The quick brown fox jumps over the lazy dog', 43],
])('converts a string values %s of type "%s" to an ArrayBuffer equal to "0x%s"', (input, type, expected, expectedLength) => {
  const result = toArrayBuffer(input, type as any)
  const resultUtf8 = toUtf8(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(result.byteLength).toBe(expectedLength)
  expect(resultUtf8).toEqual(expected)
})

it('throws an error if the value is not bufferizable', () => {
  expect(() => toArrayBuffer('?', 'hex')).toThrowError()
  expect(() => toArrayBuffer('?', 'base64')).toThrowError()
  expect(() => toArrayBuffer((() => {}) as any)).toThrowError()
  expect(() => toArrayBuffer({} as any)).toThrowError()
})
