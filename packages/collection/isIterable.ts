/**
 * Predicate to check if a value is iterable. Meaning it has a `Symbol.iterator`
 * property that is a function.
 *
 * @param value The value to check.
 * @returns `true` if the value is iterable, `false` otherwise.
 * @example
 * // Check if an array is iterable.
 * isIterable([]) // => true
 *
 * // Check if an object is iterable.
 * isIterable({}) // => false
 */
export function isIterable<T = any>(value: unknown): value is Iterable<T> {
  return typeof value === 'object'
    && value !== null
    && Symbol.iterator in value
    && typeof value[Symbol.iterator] === 'function'
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should predicate if an object with a Symbol.iterator is iterable', () => {
    const object = { [Symbol.iterator]: () => {} }
    const result = isIterable(object)
    expect(result).toStrictEqual(true)
    if (result) expectTypeOf(object).toEqualTypeOf<Iterable<any>>()
  })

  it('should predicate if an array is iterable', () => {
    const array: unknown[] = []
    const result = isIterable(array)
    expect(result).toStrictEqual(true)
    if (result) expectTypeOf(array).toMatchTypeOf<Iterable<unknown>>()
  })

  it('should predicate if a Set is iterable', () => {
    const set = new Set()
    const result = isIterable(set)
    expect(result).toStrictEqual(true)
    if (result) expectTypeOf(set).toMatchTypeOf<Iterable<unknown>>()
  })

  it('should predicate if a Map is iterable', () => {
    const map = new Map()
    const result = isIterable(map)
    expect(result).toStrictEqual(true)
    if (result) expectTypeOf(map).toMatchTypeOf<Iterable<unknown>>()
  })

  it('should predicate if generic is passed', () => {
    const iterable: Iterable<number> = new Set<number>()
    const result = isIterable(iterable)
    expect(result).toStrictEqual(true)
    if (result) expectTypeOf(iterable).toEqualTypeOf<Iterable<number>>()
  })
}
