/* eslint-disable unicorn/prevent-abbreviations */
import { endianness } from '../binary/getEndianness'
import { swapEndian } from '../binary/swapEndian'

// --- Initialize and compute constants table based on sin(0...63)
const K: number[] = []
for (let index = 0; index < 64; index++)
  K[index] = Math.trunc(Math.abs(Math.sin(index + 1)) * 0x100000000)

const f = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
  const n = a + ((b & c) | (~b & d)) + x + t
  return ((n << s) | (n >>> (32 - s))) + b
}

const g = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
  const n = a + ((b & d) | (c & ~d)) + x + t
  return ((n << s) | (n >>> (32 - s))) + b
}

const h = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
  const n = a + (b ^ c ^ d) + x + t
  return ((n << s) | (n >>> (32 - s))) + b
}

const i = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
  const n = a + (c ^ (b | ~d)) + x + t
  return ((n << s) | (n >>> (32 - s))) + b
}

const process = (chunk: Uint32Array, words: Uint32Array) => {
  // --- Make sure chunk are little-endian.
  if (endianness !== 'LE') chunk = chunk.slice(0, 15).map(swapEndian)

  // --- Initialize hash parts.
  let [a, b, c, d] = words

  // --- Hash.
  a = f(a, b, c, d, chunk[0], 7, K[0])
  d = f(d, a, b, c, chunk[1], 12, K[1])
  c = f(c, d, a, b, chunk[2], 17, K[2])
  b = f(b, c, d, a, chunk[3], 22, K[3])
  a = f(a, b, c, d, chunk[4], 7, K[4])
  d = f(d, a, b, c, chunk[5], 12, K[5])
  c = f(c, d, a, b, chunk[6], 17, K[6])
  b = f(b, c, d, a, chunk[7], 22, K[7])
  a = f(a, b, c, d, chunk[8], 7, K[8])
  d = f(d, a, b, c, chunk[9], 12, K[9])
  c = f(c, d, a, b, chunk[10], 17, K[10])
  b = f(b, c, d, a, chunk[11], 22, K[11])
  a = f(a, b, c, d, chunk[12], 7, K[12])
  d = f(d, a, b, c, chunk[13], 12, K[13])
  c = f(c, d, a, b, chunk[14], 17, K[14])
  b = f(b, c, d, a, chunk[15], 22, K[15])
  a = g(a, b, c, d, chunk[1], 5, K[16])
  d = g(d, a, b, c, chunk[6], 9, K[17])
  c = g(c, d, a, b, chunk[11], 14, K[18])
  b = g(b, c, d, a, chunk[0], 20, K[19])
  a = g(a, b, c, d, chunk[5], 5, K[20])
  d = g(d, a, b, c, chunk[10], 9, K[21])
  c = g(c, d, a, b, chunk[15], 14, K[22])
  b = g(b, c, d, a, chunk[4], 20, K[23])
  a = g(a, b, c, d, chunk[9], 5, K[24])
  d = g(d, a, b, c, chunk[14], 9, K[25])
  c = g(c, d, a, b, chunk[3], 14, K[26])
  b = g(b, c, d, a, chunk[8], 20, K[27])
  a = g(a, b, c, d, chunk[13], 5, K[28])
  d = g(d, a, b, c, chunk[2], 9, K[29])
  c = g(c, d, a, b, chunk[7], 14, K[30])
  b = g(b, c, d, a, chunk[12], 20, K[31])
  a = h(a, b, c, d, chunk[5], 4, K[32])
  d = h(d, a, b, c, chunk[8], 11, K[33])
  c = h(c, d, a, b, chunk[11], 16, K[34])
  b = h(b, c, d, a, chunk[14], 23, K[35])
  a = h(a, b, c, d, chunk[1], 4, K[36])
  d = h(d, a, b, c, chunk[4], 11, K[37])
  c = h(c, d, a, b, chunk[7], 16, K[38])
  b = h(b, c, d, a, chunk[10], 23, K[39])
  a = h(a, b, c, d, chunk[13], 4, K[40])
  d = h(d, a, b, c, chunk[0], 11, K[41])
  c = h(c, d, a, b, chunk[3], 16, K[42])
  b = h(b, c, d, a, chunk[6], 23, K[43])
  a = h(a, b, c, d, chunk[9], 4, K[44])
  d = h(d, a, b, c, chunk[12], 11, K[45])
  c = h(c, d, a, b, chunk[15], 16, K[46])
  b = h(b, c, d, a, chunk[2], 23, K[47])
  a = i(a, b, c, d, chunk[0], 6, K[48])
  d = i(d, a, b, c, chunk[7], 10, K[49])
  c = i(c, d, a, b, chunk[14], 15, K[50])
  b = i(b, c, d, a, chunk[5], 21, K[51])
  a = i(a, b, c, d, chunk[12], 6, K[52])
  d = i(d, a, b, c, chunk[3], 10, K[53])
  c = i(c, d, a, b, chunk[10], 15, K[54])
  b = i(b, c, d, a, chunk[1], 21, K[55])
  a = i(a, b, c, d, chunk[8], 6, K[56])
  d = i(d, a, b, c, chunk[15], 10, K[57])
  c = i(c, d, a, b, chunk[6], 15, K[58])
  b = i(b, c, d, a, chunk[13], 21, K[59])
  a = i(a, b, c, d, chunk[4], 6, K[60])
  d = i(d, a, b, c, chunk[11], 10, K[61])
  c = i(c, d, a, b, chunk[2], 15, K[62])
  b = i(b, c, d, a, chunk[9], 21, K[63])

  // --- Intermediate hash value.
  words[0] += a
  words[1] += b
  words[2] += c
  words[3] += d
}

const preprocess = (data: ArrayBuffer) => {
  // --- Pre-process data.
  const dataBitLength = data.byteLength * 8
  const totalByteLength = data.byteLength + 9
  const totalLength = totalByteLength - (totalByteLength % 64) + 64

  // --- Copy data and add 0b1000000 at the end of the data.
  const buffer = new Uint8Array(totalLength)
  buffer.set(new Uint8Array(data), 0)
  buffer.set([0x80], data.byteLength)

  // --- Add the bits count as a 64 bit number at the end of the data.
  buffer.set([
    dataBitLength,
    (dataBitLength >> 8),
    (dataBitLength >> 16),
    (dataBitLength >> 24),
  ], totalLength - 8)

  // --- Return as 32-bit number array.
  return new Uint32Array(buffer.buffer)
}

export const hashMd5 = (data: ArrayBuffer) => {
  // --- Preprocess data buffer and initialize data.
  const chunks = preprocess(data)
  const hash = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476])

  // --- Hashes the data 512 bits at a time.
  for (let index = 0; index < chunks.length; index += 16)
    process(chunks.slice(index, index + 16), hash)

  // --- Map as big-endian and return hashed output
  return hash.buffer
}
