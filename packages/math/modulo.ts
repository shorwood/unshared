/* eslint-disable unicorn/consistent-function-scoping */
/**
 * Returns the remainder of the division of multiple numbers.
 *
 * @param numbers The numbers to divide.
 * @returns The remainder of the division of the numbers.
 * @throws If one of the arguments is not a divisible number or if there is less than two arguments.
 * @example modulo(17, 5, 2) // 1
 * @see https://en.wikipedia.org/wiki/Modulo_operation
 */
export function modulo(...numbers: [number, number, ...number[]]): number {
  // --- Handle edge cases.
  if (numbers.length < 2)
    throw new Error('Cannot compute the remainder of the division of less than two numbers.')
  for (const number of numbers) {
    if (typeof number !== 'number')
      throw new TypeError('Cannot compute the remainder of the division of non-numbers.')
    if (!Number.isFinite(number))
      throw new RangeError('Cannot compute the remainder of the division of non-finite numbers.')
    if (Number.isNaN(number))
      throw new RangeError('Cannot compute the remainder of the division of NaN.')
    if (number < 0)
      throw new RangeError('Cannot compute the remainder of the division of negative numbers.')
    if (number > Number.MAX_SAFE_INTEGER)
      throw new RangeError('Cannot compute the remainder of the division of numbers greater than Number.MAX_SAFE_INTEGER.')
  }

  // --- Compute the remainder of the division of the numbers.
  let remainder = numbers.shift()!
  for (const number of numbers) remainder = remainder % number
  return remainder
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should compute the remainder of the division of multiple numbers', () => {
    const result = modulo(17, 5)
    expect(result).toEqual(2)
  })

  it('should compute the remainder of a negative number', () => {
    const result = modulo(3, 2)
    expect(result).toEqual(1)
  })

  it('should throw an error if there is a non-number', () => {
    const shouldThrow = () => modulo(1, 2, '3' as any)
    expect(shouldThrow).toThrowError('Cannot compute the remainder of the division of non-numbers.')
  })

  it('should throw an error if there is a non-finite number', () => {
    const shouldThrow = () => modulo(1, 2, Number.POSITIVE_INFINITY as any)
    expect(shouldThrow).toThrowError('Cannot compute the remainder of the division of non-finite numbers.')
  })

  it('should throw an error if there is a negative number', () => {
    const shouldThrow = () => modulo(1, -2)
    expect(shouldThrow).toThrowError('Cannot compute the remainder of the division of negative numbers.')
  })

  it('should throw an error if there is a number greater than Number.MAX_SAFE_INTEGER', () => {
    const shouldThrow = () => modulo(1, Number.MAX_SAFE_INTEGER + 1)
    expect(shouldThrow).toThrowError('Cannot compute the remainder of the division of numbers greater than Number.MAX_SAFE_INTEGER.')
  })

  it('should throw an error if there is less than two numbers', () => {
    // @ts-expect-error: testing error case.
    const shouldThrow = () => modulo(1)
    expect(shouldThrow).toThrowError('Cannot compute the remainder of the division of less than two numbers.')
  })
}
