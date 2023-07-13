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
    // @ts-expect-error: ignore
    return prototype[property].apply(value, args)
  } as UnboundFunction<T, K>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should unbind the "toFixed" method', () => {
    const toFixed = unbind(Number.prototype, 'toFixed')
    const result = toFixed(1, 2)
    expect(result).toEqual('1.00')
  })

  it('should unbind the "toUpperCase" method', () => {
    const toUpperCase = unbind(String.prototype, 'toUpperCase')
    const result = toUpperCase('a')
    expect(result).toEqual('A')
  })
}
