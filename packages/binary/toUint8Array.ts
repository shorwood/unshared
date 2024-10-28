/** A binary-like object that can be converted to an Uint8Array. */
export type BinaryLike = ArrayBufferLike | ArrayLike<number> | Iterable<number> | string

/**
 * Transform a binary-like object to an Uint8Array. A binary-like object is
 * an object that contains a sequence of integers or a string that can be
 * converted to a sequence of integers.
 *
 * @param value The value to cast.
 * @returns The value as an `Uint8Array`
 * @example toUint8Array('Hello, World!') // <Uint8Array 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21>
 */
export function toUint8Array(value: BinaryLike) {
  return (typeof value === 'string')
    ? new TextEncoder().encode(value)
    : new Uint8Array(value as number[])
}
