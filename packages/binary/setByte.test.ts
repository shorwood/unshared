import { setByte } from './setByte'

describe('setByte', () => {
  test('should set the first byte to 0x64', () => {
    const result = setByte(0x00000000, 0, 0x64)
    expect(result).toBe(0x00000064)
  })

  test('should set the first byte to 0x00', () => {
    const result = setByte(0x00000064, 0, 0x00)
    expect(result).toBe(0x00000000)
  })

  test('should set the last byte to 0x64', () => {
    const result = setByte(0x00000000, 3, 0x64)
    expect(result).toBe(0x64000000)
  })

  test('should set the last byte to 0x00', () => {
    const result = setByte(0x64000000, 3, 0x00)
    expect(result).toBe(0x00000000)
  })

  test('should throw if the index is greater than 3', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setByte(0x00000000, 4, 0x64)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw if the index is less than 0', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => setByte(0x00000000, -1, 0x64)
    expect(shouldThrow).toThrow(RangeError)
  })
})
