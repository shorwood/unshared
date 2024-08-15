import type { Function } from '@unshared/types'

/**
 * Make a function expect the first argument to be the `this` context.
 *
 * @template T The type of the `this` context.
 * @template K The property of the prototype to wrap.
 * @returns The wrapped function.
 * @example UnboundFunction<Number, 'toFixed'> // (value: number, fractionDigits?: number | undefined) => string
 */
export type UnboundFunction<T, K extends keyof T> =
  T[K] extends (...args: infer P) => infer R
    ? (value: T, ...args: P) => R
    : never

/**
 * Unbind the `this` context of a function. The returned function will expect
 * the first argument to be the `this` context.
 *
 * @param prototype The prototype of the function to wrap.
 * @param property The property of the prototype to wrap.
 * @returns The wrapped function.
 * @example
 * const toFixed = unbind(Number.prototype, 'toFixed')
 * const result = toFixed(1, 2)
 * assert(result === '1.00')
 */
export function unbind<T, K extends keyof T>(prototype: T, property: K): UnboundFunction<T, K> {
  return function(value: T, ...args: unknown[]) {
    const fn = prototype[property] as Function
    return fn.apply(value, args) as unknown
  } as UnboundFunction<T, K>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should unbind the "toFixed" method', () => {
    const toFixed = unbind(Number.prototype, 'toFixed')
    const result = toFixed(1, 2)
    expect(result).toBe('1.00')
  })

  test('should unbind the "toUpperCase" method', () => {
    const toUpperCase = unbind(String.prototype, 'toUpperCase')
    const result = toUpperCase('a')
    expect(result).toBe('A')
  })

  test('should infer the type of the unbound function', () => {
    const toFixed = unbind(Number.prototype, 'toFixed')
    expectTypeOf(toFixed).toEqualTypeOf<(value: InstanceType<NumberConstructor>, fractionDigits?: number | undefined) => string>()
  })
}
