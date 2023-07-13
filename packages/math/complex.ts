
/**
 * A complex number is a number that can be expressed in the form `a + bi`,
 * where `a` and `b` are real numbers, and `i` is a solution of the equation
 * `x² = −1`. Because no real number satisfies this equation, `i` is called
 * an [imaginary number](https://en.wikipedia.org/wiki/Imaginary_number).
 */
export interface Complex {
  /**
   * The real part of the complex number.
   *
   * @example 1
   */
  real: number
  /**
   * The imaginary part of the complex number.
   *
   * @example 2
   */
  imaginary: number
}

/**
 * Creates a complex number from a real and imaginary part.
 *
 * @param real The real part of the complex number.
 * @param imaginary The imaginary part of the complex number.
 * @returns The complex number.
 * @example complex(1, 2) // 1 + 2i
 */
export function complex(real: number, imaginary: number): Complex {
  return { real, imaginary }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a complex number', () => {
    const result = complex(1, 2)
    expect(result).toEqual({ real: 1, imaginary: 2 })
  })
}
