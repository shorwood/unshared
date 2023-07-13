import { Complex, complex } from './complex'

/**
 * Divides two complex numbers.
 *
 * @param a The first complex number.
 * @param b The second complex number.
 * @returns The quotient of the complex numbers.
 * @example complexDivide(complex(1, 2), complex(3, 4)) // { real: 0.44, imaginary: 0.08 }
 */
export function complexDivide(a: Complex, b: Complex): Complex {
  const denominator = b.real ** 2 + b.imaginary ** 2
  return {
    real: (a.real * b.real + a.imaginary * b.imaginary) / denominator,
    imaginary: (a.imaginary * b.real - a.real * b.imaginary) / denominator,
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should divide complex numbers', () => {
    const a = complex(1, 2)
    const b = complex(3, 4)
    const result = complexDivide(a, b)
    expect(result).toEqual({ real: 0.44, imaginary: 0.08 })
  })
}
