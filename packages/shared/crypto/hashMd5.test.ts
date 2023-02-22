import { expect, it } from 'vitest'
import { toArrayBuffer, toHex } from '../binary'
import { hashMd5 } from './hashMd5'

it.each([
  ['', 'd41d8cd98f00b204e9800998ecf8427e'],
  ['a', '0cc175b9c0f1b6a831c399e269772661'],
  ['abc', '900150983cd24fb0d6963f7d28e17f72'],
  ['message digest', 'f96b697d7cb7938d525a2f31aaf161d0'],
  ['abcdefghijklmnopqrstuvwxyz', 'c3fcd3d76192e4007dfb496cca67e13b'],
  ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'd174ab98d277d9f5a5611c2c9f419d9f'],
  ['12345678901234567890123456789012345678901234567890123456789012345678901234567890', '57edf4a22be3c955ac49da2e2107b67a'],
  ['The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
])('should hash "%s" into an ArrayBuffer equal to "0x%s"', (input, expected) => {
  const inputBuffer = toArrayBuffer(input, 'utf8')
  const hash = hashMd5(inputBuffer)
  const hashHex = toHex(hash)
  expect(hash).toBeInstanceOf(ArrayBuffer)
  expect(hashHex).toBe(expected)
})
