/**
 * A binary-like object that can be converted to an Uint8Array.
 */
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

/* v8 ignore start */
if (import.meta.vitest) {
  test('should convert a string to an Uint8Array', () => {
    const result = toUint8Array('Hello, World!')
    const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
    expect(result).toStrictEqual(expected)
  })

  test('should convert an Uint8Array to an Uint8Array', () => {
    const buffer = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100])
    const result = toUint8Array(buffer)
    expect(result).toStrictEqual(buffer)
  })

  test('should convert an ArrayBuffer to an Uint8Array', () => {
    const buffer = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100]).buffer
    const result = toUint8Array(buffer)
    expect(result).toStrictEqual(new Uint8Array(buffer))
  })

  test('should convert a Buffer to an Uint8Array', () => {
    const buffer = Buffer.from('Hello, World!')
    const result = toUint8Array(buffer)
    expect(result).toStrictEqual(new Uint8Array(buffer))
  })

  test('should convert an array-like object to an Uint8Array', () => {
    const buffer = [72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100]
    const result = toUint8Array(buffer)
    expect(result).toStrictEqual(new Uint8Array(buffer))
  })

  test('should convert an Iterator to an Uint8Array', () => {
    const createIterator = function* () {
      yield 72
      yield 101
      yield 108
      yield 108
      yield 111
      yield 44
      yield 32
      yield 87
      yield 111
      yield 114
      yield 108
      yield 100
    }
    const result = toUint8Array(createIterator())
    const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100])
    expect(result).toStrictEqual(expected)
  })
}
