/**
 * Divide multiple numbers together.
 *
 * @param numbers The numbers to divide.
 * @returns The quotient of the numbers.
 * @example divide(1, 2, 3) // 0.16666666666666666
 */
export function divide(...numbers: [number, ...number[]]): number {
  let quotient = 1
  for (const number of numbers) quotient /= number
  return quotient
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should divide numbers', () => {
    const result = divide(1, 2, 3)
    expect(result).toEqual(0.16666666666666666)
  })
}
