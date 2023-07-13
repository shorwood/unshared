import { decodeBase64 } from '../encode/decodeBase64'
import { fromHex } from './fromHex'
import { fromUtf8 } from './fromUtf8'

export type BuffereableFrom = 'utf8' | 'base64' | 'binary' | 'hex' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint8clamped'

/**
 * Convert a value to an `ArrayBuffer`
 *
 * @param value The value to convert
 * @param from The encoding or integer type to convert from
 * @returns The value as an `ArrayBuffer`
 */
export const toArrayBuffer = (value?: any, from?: BuffereableFrom): ArrayBuffer => {
  // --- is value Nil
  if (value === undefined || value === null)
    return new ArrayBuffer(0)

  // --- is or has an array buffer
  if (typeof value === 'object' && 'buffer' in value) return value.buffer
  if (value instanceof ArrayBuffer) return value

  // --- is a string.
  if (typeof value === 'string') {
    if (from === 'base64') return decodeBase64(value)
    if (from === 'hex') return fromHex(value)
    return fromUtf8(value)
  }

  // --- is an array of integer-like values.
  if (from && ['uint8', 'uint16', 'uint32', 'uint64', 'uint8clamped'].includes(from)) {
    if (!Array.isArray(value)) value = [value]
    if (from === 'uint8') return new Uint8Array(value).buffer
    if (from === 'uint16') return new Uint16Array(value).buffer
    if (from === 'uint32') return new Uint32Array(value).buffer
    if (from === 'uint64') return new BigUint64Array(value).buffer
    return new Uint8ClampedArray(value).buffer
  }

  // --- is a function, return the stringified version.
  if (typeof value === 'function') return fromUtf8(value.toString())

  // --- anything else, stringify and return.
  try { return fromUtf8(JSON.stringify(value)) }
  catch { throw new Error('Value type not supported') }
}
