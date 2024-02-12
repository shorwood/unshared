import { MaybePromise } from '@unshared/types'
import { BinaryLike } from './isBinaryLike'

/**
 * Cast a `BinaryLike` value into an `ArrayBuffer`. Since this implementation is
 * using the `ArrayBuffer` API and does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param value The value to cast.
 * @returns The value as an `ArrayBuffer`
 * @example toArrayBuffer('Hello, World!') // <ArrayBuffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21>
 */
export function toArrayBuffer(value: Blob): Promise<ArrayBuffer>
export function toArrayBuffer(value: Exclude<BinaryLike, Blob>): MaybePromise<ArrayBuffer>
export function toArrayBuffer(value: BinaryLike): MaybePromise<ArrayBuffer>
export function toArrayBuffer(value: BinaryLike): MaybePromise<ArrayBuffer> {
  // --- If it's undefined or null, return an empty ArrayBuffer.
  if (value === undefined || value === null)
    return new ArrayBuffer(0)

  // --- If it's an ArrayBuffer or SharedArrayBuffer, return it.
  if (value instanceof ArrayBuffer || value instanceof SharedArrayBuffer)
    return value

  if (value instanceof Blob)
    return value.arrayBuffer()

  // --- If it's a string, cast it to an ArrayBuffer.
  if (typeof value === 'string') {
    const buffer = new ArrayBuffer(value.length)
    const bufferView = new Uint8Array(buffer)
    for (let k = 0; k < value.length; k++)
      bufferView[k] = value.charCodeAt(k)
    return buffer
  }

  // --- If it's a Buffer, return it's underlying ArrayBuffer.
  if (typeof value === 'object' && 'buffer' in value)
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)

  // --- If it's an Iterator, cast it to an ArrayBuffer so it can be cast in the next step.
  if (typeof value === 'object' && Symbol.iterator in value)
    value = [...value]

  // --- If it's an array-like object, cast it to an ArrayBuffer.
  if (typeof value === 'object' && 'length' in value) {
    const buffer = new ArrayBuffer(value.length)
    const bufferView = new Uint8Array(buffer)
    for (let k = 0; k < value.length; k++)
      bufferView[k] = value[k]
    return buffer
  }
}
