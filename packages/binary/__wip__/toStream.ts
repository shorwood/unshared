import { Readable } from 'node:stream'
import { BinaryLike } from './isBinaryLike'

/**
 * Cast a value to a Readable stream.
 *
 * @param value The value to cast.
 * @returns The value as a Readable stream.
 */
export function toStream(value: BinaryLike): Readable {
  // --- Handle edge cases.
  if (value === null) throw new TypeError('Cannot cast null to stream')
  if (value === undefined) throw new TypeError('Cannot cast undefined to stream')

  // --- Cast Buffers and strings in a Readable stream.
  if (value instanceof Buffer) return Readable.from(value)
  if (typeof value === 'string') return Readable.from(Buffer.from(value))

  // --- Cast ArrayBuffers and ArrayBufferViews in a Readable stream.
  if (value instanceof ArrayBuffer) return Readable.from(Buffer.from(value))
  if (value instanceof SharedArrayBuffer) return Readable.from(Buffer.from(value))
  if (ArrayBuffer.isView(value)) return Readable.from(Buffer.from(value.buffer))

  // --- Cast iterables and arrays in a Readable stream.
  if (Array.isArray(value)) return Readable.from(Buffer.from(value))
  if (Symbol.iterator in value) return Readable.from(value)
  if (Symbol.asyncIterator in value) return Readable.from(value)

  // --- Fallback to `PassThrough.from()` for other types.
  try { return Readable.from(value) }

  // --- Throw an error if the value is not castable.
  catch {
    const className = value?.constructor?.name ?? typeof value
    throw new TypeError(`Cannot convert ${className} to a Readable stream.`)
  }
}
