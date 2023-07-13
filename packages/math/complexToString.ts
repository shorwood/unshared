import { Complex } from './complex'

/**
 * Stringify a complex number.
 *
 * @param complex The complex number to stringify.
 * @returns The string representation of the complex number.
 * @example complexToString({ real: 1, imaginary: 2 }) // '1 + 2i'
 */
export function complexToString(complex: Complex): string {
  const sign = complex.imaginary < 0 ? '-' : '+'
  return `${complex.real} ${sign} ${Math.abs(complex.imaginary)}i`
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should stringify a complex number', () => {
    const result = complexToString({ real: 1, imaginary: 2 })
    expect(result).toEqual('1 + 2i')
  })

  it('should stringify a complex number with a negative imaginary part', () => {
    const result = complexToString({ real: 1, imaginary: -2 })
    expect(result).toEqual('1 - 2i')
  })
}
