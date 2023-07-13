/**
 * Add two numbers.
 *
 * @param a The first number.
 * @param b The second number.
 * @returns The sum of the numbers.
 * @example add(2, 2) // 4
 */
export function add(a: number, b: number): number {
  return a + b
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should add integers', () => {
    const result = add(2, 2)
    expect(result).toEqual(4)
  })
}
