import { toUint8Array } from './toUint8Array'

describe('toUint8Array', () => {
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
    // oxlint-disable-next-line unicorn/consistent-function-scoping
    const createIterator = function * () {
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
})
