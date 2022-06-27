/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { toArrayBuffer } from './toArrayBuffer'
import { toHex } from './toHex'

it.each([
  // --- from nil
  [undefined, '', undefined],
  [null, '', undefined],

  // --- from buffer like
  [new Uint8Array([0x80, 0x4020, 0x804020, 0x80402010]).buffer, '80202010'],
  [new Uint8Array([0x80, 0x4020, 0x804020, 0x80402010]), '80202010'],
  [new Uint8ClampedArray([0x80, 0x4020, 0x804020, 0x80402010]), '80ffffff'],
  [new Uint16Array([0x80, 0x4020, 0x804020, 0x80402010]), '8000204020401020'],
  [new Uint32Array([0x80, 0x4020, 0x804020, 0x80402010]), '80000000204000002040800010204080'],
  [new BigUint64Array([0x80n, 0x4020n, 0x804020n, 0x80402010n]), '8000000000000000204000000000000020408000000000001020408000000000'],

  // --- from strings
  ['YWJj', '616263', 'base64'],
  ['616263', '616263', 'hex'],
  ['abc', '616263', 'utf8'],
  ['abc', '616263', undefined],

  // --- from boolean
  [true, '74727565'],
  [true, '01', 'uint8'],
  [true, '01', 'uint8clamped'],
  [true, '0100', 'uint16'],
  [true, '01000000', 'uint32'],
  [true, '0100000000000000', 'uint64'],

  // --- from number or bigint
  [0x80402010, '32313531363836313630'],
  [0x80402010, '10', 'uint8'],
  [0x80402010, 'ff', 'uint8clamped'],
  [0x80402010, '1020', 'uint16'],
  [0x80402010, '10204080', 'uint32'],
  [0x80402010n, '1020408000000000', 'uint64'],

  // --- from array
  [[0x80, 0x40, 0x20, 0x10], '5b3132382c36342c33322c31365d'],
  [[0x80, 0x40, 0x20, 0x10], '80402010', 'uint8'],
  [[0x80, 0x40, 0x20, 0x10], '80402010', 'uint8clamped'],
  [[0x80, 0x40, 0x20, 0x10], '8000400020001000', 'uint16'],
  [[0x80, 0x40, 0x20, 0x10], '80000000400000002000000010000000', 'uint32'],
  [[0x80n, 0x40n, 0x20n, 0x10n], '8000000000000000400000000000000020000000000000001000000000000000', 'uint64'],

  // --- from function or object
  [() => ({ a: 1 }), '2829203d3e20287b20613a2031207d29'],
  [{ a: 1 }, '7b2261223a317d'],

])('converts "%s" to an ArrayBuffer equal to "%s"', (input: any, expected: string, from?: string) => {
  const result = toArrayBuffer(input, from as any)
  const resultHex = toHex(result)
  expect(result).toBeInstanceOf(ArrayBuffer)
  expect(resultHex).toEqual(expected)
})

it('throws an error if the value is not bufferizable', () => {
  expect(() => toArrayBuffer('?', 'hex')).toThrowError()
  expect(() => toArrayBuffer('?', 'base64')).toThrowError()
  expect(() => toArrayBuffer(1n)).toThrowError()
  expect(() => toArrayBuffer(1n, 'uint8')).toThrowError()
})
