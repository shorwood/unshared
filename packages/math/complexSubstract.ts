import { Complex, complex } from './complex'

/**
 * Substracts two complex numbers.
 *
 * @param a The first complex number.
 * @param b The second complex number.
 * @returns The difference of the complex numbers.
 * @example complexSubstract(complex(1, 2), complex(3, 4)) // { real: -2, imaginary: -2 }
 */
export function complexSubstract(a: Complex, b: Complex): Complex {
  return {
    real: a.real - b.real,
    imaginary: a.imaginary - b.imaginary,
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should substract complex numbers', () => {
    const a = complex(1, 2)
    const b = complex(3, 4)
    const result = complexSubstract(a, b)
    expect(result).toEqual({ real: -2, imaginary: -2 })
  })
}
