/* eslint-disable no-new-object */
import { Stream } from 'node:stream'

/**
 * The type of content that can be used as binary data. This includes streams,
 * buffers, array buffers, array buffer views, async generators, iterables,
 * and more.
 */
export type BinaryLike =
  ArrayBufferLike
  | ArrayBufferView
  | AsyncGeneratorFunction
  | AsyncIterable<number>
  | Blob
  | Buffer
  | Iterable<number>
  | number[]
  | ReadableStream
  | Stream
  | string

/**
 * Checks if a value is `BinaryLike`. This includes streams, buffers, array
 * buffers, array buffer views, async generators, iterables, and more.
 *
 * @param value The value to check.
 * @returns `true` if the value is `BinaryLike`, otherwise `false`.
 * @example isBinaryLike([0x00, 0x01, 0x02]) // true
 */
export function isBinaryLike(value: unknown): value is BinaryLike {
  return (

    // --- JavaScript-native APIs
    ArrayBuffer.isView(value)
    || value instanceof ArrayBuffer
    || value instanceof Blob
    || typeof value === 'string'

    // --- The WebStream API might now be available in the browser context.
    || value instanceof ReadableStream

    // --- Array-like objects
    || Symbol.iterator in new Object(value)
    || Symbol.asyncIterator in new Object(value)
    || (Array.isArray(value) && value.every(v => typeof v === 'number'))

    // --- The SharedArrayBuffer is not available in the browser context
    // --- unless the `crossOriginIsolated` flag is set. This is a security
    // --- feature introduced in Chrome 92 since the discovery of the
    // --- Spectre vulnerability.
    || (crossOriginIsolated && value instanceof SharedArrayBuffer)

    // --- Node.js specific APIs
    || (Stream !== undefined && value instanceof Stream)
    || (Buffer !== undefined && value instanceof Buffer)
  )
}
