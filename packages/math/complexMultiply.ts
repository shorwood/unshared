import { Complex, complex } from './complex'

/**
 * Multiply two complex numbers.
 *
 * @param a The first complex number.
 * @param b The second complex number.
 * @returns The product of the complex numbers.
 * @example complexMultiply(complex(1, 2), complex(3, 4)) // { real: -5, imaginary: 10 }
 */
export function complexMultiply(a: Complex, b: Complex): Complex {
  return {
    real: a.real * b.real - a.imaginary * b.imaginary,
    imaginary: a.imaginary * b.real + a.real * b.imaginary,
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should multiply complex numbers', () => {
    const a = complex(1, 2)
    const b = complex(3, 4)
    const result = complexMultiply(a, b)
    expect(result).toEqual({ real: -5, imaginary: 10 })
  })
}
