import { setBit } from './setBit'

describe('setBit', () => {
  test('should set the first bit to 1', () => {
    const result = setBit(0, 0, true)
    expect(result).toBe(1)
  })

  test('should set the first bit to 0', () => {
    const result = setBit(1, 0, false)
    expect(result).toBe(0)
  })

  test('should set the last bit to 1', () => {
    const result = setBit(0, 31, true)
    expect(result).toBe(-0b10000000000000000000000000000000)
  })

  test('should set the last bit to 0', () => {
    const result = setBit(0b100000000000000000000000000000000, 31, false)
    expect(result).toBe(0)
  })

  test('should throw if the index is greater than 31', () => {
    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0, 32, true)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw if the index is less than 0', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setBit(0, -1, true)
    expect(shouldThrow).toThrow(RangeError)
  })
})
