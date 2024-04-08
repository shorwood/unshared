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

/* v8 ignore start */
if (import.meta.vitest) {
  it.each([
    // --- from nil
    [undefined, '', undefined],
    [null, '', undefined],
  
    // --- from buffer like
    [new Uint8Array([0x80, 0x4020, 0x804020, 0x80402010]).buffer, '80202010'],
    [new Uint8Array([0x80, 0x4020, 0x804020, 0x80402010]), '80202010'],
    [new Uint8ClampedArray([0x80, 0x4020, 0x804020, 0x80402010]), '80ffffff'],
    [new Uint16Array([0x80, 0x4020, 0x804020, 0x80402010]), '8000204020401020'],
    [new Uint32Array([0x80, 0x4020, 0x804020, 0x80402010]), '80000000204000002040800010204080'],
    [new BigUint64Array([0x80n, 0x4020n, 0x804020n, 0x80402010n]), '8000000000000000204000000000000020408000000000001020408000000000'],
  
    // --- from strings
    ['YWJj', '616263', 'base64'],
    ['616263', '616263', 'hex'],
    ['abc', '616263', 'utf8'],
    ['abc', '616263', undefined],
  
    // --- from boolean
    [true, '74727565'],
    [true, '01', 'uint8'],
    [true, '01', 'uint8clamped'],
    [true, '0100', 'uint16'],
    [true, '01000000', 'uint32'],
    [true, '0100000000000000', 'uint64'],
  
    // --- from number or bigint
    [0x80402010, '32313531363836313630'],
    [0x80402010, '10', 'uint8'],
    [0x80402010, 'ff', 'uint8clamped'],
    [0x80402010, '1020', 'uint16'],
    [0x80402010, '10204080', 'uint32'],
    [0x80402010n, '1020408000000000', 'uint64'],
  
    // --- from array
    [[0x80, 0x40, 0x20, 0x10], '5b3132382c36342c33322c31365d'],
    [[0x80, 0x40, 0x20, 0x10], '80402010', 'uint8'],
    [[0x80, 0x40, 0x20, 0x10], '80402010', 'uint8clamped'],
    [[0x80, 0x40, 0x20, 0x10], '8000400020001000', 'uint16'],
    [[0x80, 0x40, 0x20, 0x10], '80000000400000002000000010000000', 'uint32'],
    [[0x80n, 0x40n, 0x20n, 0x10n], '8000000000000000400000000000000020000000000000001000000000000000', 'uint64'],
  
    // --- from function or object
    [() => ({ a: 1 }), '2829203d3e20287b20613a2031207d29'],
    [{ a: 1 }, '7b2261223a317d'],
  
  ])('should convert "%s" to an ArrayBuffer equal to "%s"', (input: any, expected: string, from?: string) => {
    const result = toArrayBuffer(input, from as any)
    const resultHex = toHex(result)
    expect(result).toBeInstanceOf(ArrayBuffer)
    expect(resultHex).toEqual(expected)
  })
  
  it.each([
    ['?', 'hex'],
    ['?', 'base64'],
    [1n],
    [1n, 'uint8'],
  ])('should throws an error if the value is not bufferizable', (input: any, from?: string) => {
    const shouldThrow = () => toArrayBuffer(input, from as any)
    expect(shouldThrow).toThrowError()
  })
}