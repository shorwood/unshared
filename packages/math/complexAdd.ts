import { Complex, complex } from './complex'

/**
 * Adds two complex numbers.
 *
 * @param a The first complex number.
 * @param b The second complex number.
 * @returns The sum of the complex numbers.
 * @example complexAdd(complex(1, 2), complex(3, 4)) // { real: 4, imaginary: 6 }
 */
export function complexAdd(a: Complex, b: Complex): Complex {
  return {
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary,
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should add complex numbers', () => {
    const a = complex(1, 2)
    const b = complex(3, 4)
    const result = complexAdd(a, b)
    expect(result).toEqual({ real: 4, imaginary: 6 })
  })
}
