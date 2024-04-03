/**
 * A complex number is a number that can be expressed in the form `a + bi`,
 * where `a` and `b` are real numbers, and `i` is a solution of the equation
 * `x² = −1`. Because no real number satisfies this equation, `i` is called
 * an [imaginary number](https://en.wikipedia.org/wiki/Imaginary_number).
 */
export class Complex {
  /**
   * Creates a new complex number.
   *
   * @param real The real part of the complex number.
   * @param imaginary The imaginary part of the complex number.
   * @example new Complex(1, 2) // Complex { real: 1, imaginary: 2 }
   */
  constructor(public real: number, public imaginary: number) {}

  /**
   * Stringify a complex number.
   *
   * @param complex The complex number to stringify.
   * @returns The string representation of the complex number.
   * @example new Complex(1, 2).toString() // "1 + 2i"
   */
  public toString(complex: Complex): string {
    const sign = complex.imaginary < 0 ? '-' : '+'
    return `${complex.real} ${sign} ${Math.abs(complex.imaginary)}i`
  }

  /**
   * Compute the sum of two complex numbers.
   *
   * @param a The first complex number.
   * @param b The second complex number.
   * @returns The sum of the complex numbers.
   * @example
   * const a = createComplex(1, 2)
   * const b = createComplex(3, 4)
   * const result = complexAdd(a, b)
   * result.toString() // '4 + 6i'
   */
  public add(a: Complex, b: Complex): Complex {
    return new Complex(a.real + b.real, a.imaginary + b.imaginary)
  }

  /**
   * Compute the difference of two complex numbers.
   *
   * @param a The first complex number.
   * @param b The second complex number.
   * @returns The difference of the complex numbers.
   * @example
   * const a = createComplex(1, 2)
   * const b = createComplex(3, 4)
   * const result = complexSubtract(a, b)
   * result.toString() // '-2 - 2i'
   */
  public subtract(a: Complex, b: Complex): Complex {
    return new Complex(a.real - b.real, a.imaginary - b.imaginary)
  }

  /**
   * Compute the product of two complex numbers.
   *
   * @param a The first complex number.
   * @param b The second complex number.
   * @returns The product of the complex numbers.
   * @example
   * const a = createComplex(-1, 2)
   * const b = createComplex(3, 4)
   * const result = complexMultiply(a, b)
   * result.toString() // '-11 + 2i'
   */
  public multiply(a: Complex, b: Complex): Complex {
    return new Complex(
      a.real * b.real - a.imaginary * b.imaginary,
      a.real * b.imaginary + a.imaginary * b.real,
    )
  }

  /**
   * Compute the quotient of two complex numbers.
   *
   * @param a The first complex number.
   * @param b The second complex number.
   * @returns The quotient of the complex numbers.
   * @example
   * const a = createComplex(1, 2)
   * const b = createComplex(3, 4)
   * const result = complexDivide(a, b)
   * result.toString() // '0.44 + 0.08i'
   */
  public divide(a: Complex, b: Complex): Complex {
    const denominator = b.real ** 2 + b.imaginary ** 2
    return new Complex(
      (a.real * b.real + a.imaginary * b.imaginary) / denominator,
      (a.imaginary * b.real - a.real * b.imaginary) / denominator,
    )
  }

  /**
   * Compute the square root of a complex number.
   *
   * @param complex The complex number to compute the square root of.
   * @returns The square root of the complex number.
   * @example createComplex(1, 2).sqrt() // Complex { real: 1.272019649514069, imaginary: 0.7861513777574233 }
   */
  public sqrt(complex: Complex): Complex {
    const { real, imaginary } = complex
    const modulus = Math.hypot(real, imaginary)
    const resultReal = Math.sqrt((modulus + real) / 2)
    const resulyImaginary = Math.sign(imaginary) * Math.sqrt((modulus - real) / 2)
    return new Complex(resultReal, resulyImaginary)
  }
}

/**
 * Creates a complex number from a real and imaginary part.
 *
 * @param real The real part of the complex number.
 * @param imaginary The imaginary part of the complex number.
 * @returns The complex number.
 * @example createComplex(1, 2) // Complex { real: 1, imaginary: 2 }
 */
export function createComplex(real: number, imaginary: number): Complex {
  return new Complex(real, imaginary)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a complex number', () => {
    const result = createComplex(1, 2)
    expect(result).toEqual({ real: 1, imaginary: 2 })
  })
}
