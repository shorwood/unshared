import { MaybeArray } from '../types'
import { fromBase64 } from './fromBase64'
import { fromHex } from './fromHex'
import { fromUtf8 } from './fromUtf8'

export type Buffereable = string | MaybeArray<number | bigint | boolean> | { buffer: ArrayBuffer } | ArrayBuffer
export type BuffereableFrom = 'utf8' | 'base64' | 'binary' | 'hex' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint8clamped'

/**
 * Convert a value to an `ArrayBuffer`
 * @param value The value to convert
 * @param from The encoding or integer type to convert from
 * @returns The value as an `ArrayBuffer`
 */
export const toArrayBuffer = (value: Buffereable, from?: BuffereableFrom): ArrayBuffer => {
  // --- is a string.
  if (typeof value === 'string') {
    if (from === 'base64') return fromBase64(value)
    if (from === 'hex') return fromHex(value)
    return fromUtf8(value)
  }

  // --- is integer-like.
  if (typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean') value = [value]

  // --- is an array of integer-like
  if (Array.isArray(value)) {
    if (from === 'uint8') return new Uint8Array(value.map(Number)).buffer
    if (from === 'uint16') return new Uint16Array(value.map(Number)).buffer
    if (from === 'uint32') return new Uint32Array(value.map(Number)).buffer
    if (from === 'uint64') return new BigUint64Array(value.map(BigInt)).buffer
    return new Uint8ClampedArray(value.map(Number)).buffer
  }

  // --- is or has an array buffer
  if ('buffer' in value) return value.buffer
  if (value instanceof ArrayBuffer) return value

  // --- is not bufferizeable
  throw new Error('Value type not supported')
}
