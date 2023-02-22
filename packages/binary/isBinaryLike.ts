/* eslint-disable no-new-object */
import { Stream } from 'node:stream'
import { Blob } from 'node:buffer'

/**
 * The type of content that can be packed into a tarball through `Duplex.from()`.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/stream.d.ts#L896
 */
export type BinaryLike =
  | Stream
  | Blob
  | Buffer
  | ArrayBufferLike
  | ArrayBufferView
  | AsyncGeneratorFunction
  | Iterable<number>
  | AsyncIterable<number>
  | number[]
  | string

/**
 * Checks if a value is binary-like.
 *
 * @param value The value to check.
 * @returns True if the value is binary-like, false otherwise.
 */
export function isBinaryLike(value: unknown): value is BinaryLike {
  return (
    value instanceof Stream
    || value instanceof Blob
    || value instanceof Buffer
    || value instanceof ArrayBuffer
    || value instanceof SharedArrayBuffer
    || ArrayBuffer.isView(value)
    || Symbol.iterator in new Object(value)
    || Symbol.asyncIterator in new Object(value)
    || (Array.isArray(value) && value.every(v => typeof v === 'number'))
    || typeof value === 'string'
  )
}
