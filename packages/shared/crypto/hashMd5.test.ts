import { expect, it } from 'vitest'
import { toArrayBuffer } from '../binary/toArrayBuffer'
import { toHex } from '../binary/toHex'
import { hashMd5 } from './hashMd5'

it.each([
  // --- Small values
  ['', 'd41d8cd98f00b204e9800998ecf8427e'],
  ['a', '0cc175b9c0f1b6a831c399e269772661'],

  // --- UTF-8
  ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'd174ab98d277d9f5a5611c2c9f419d9f'],

])('should hash "%s" into an ArrayBuffer equal to "0x%s"', (input, expected) => {
  const inputBuffer = toArrayBuffer(input, 'utf8')
  const hash = hashMd5(inputBuffer)
  const hashHex = toHex(hash)
  expect(hash).toBeInstanceOf(ArrayBuffer)
  expect(hashHex).toEqual(expected)
})
