import { BoundThis } from '@unshared/types'

/**
 * Wrap a function that binds it's first argument to `this`. This is useful when you want to
 * compose class methods in a functional style.
 *
 * @param fn The function to bind `this` to.
 * @returns The bound function with it's first parameter bound to `this`.
 * @example
 * const add = bindThis((a: number, b: number) => a + b) // (this: number, b: number) => number
 * add.call(1, 2) // 3
 */
export function bindThis <T extends Function>(fn: T): BoundThis<T> {
  return function(this: unknown, ...parameters: unknown[]) { return fn(this, ...parameters) } as BoundThis<T>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should bind "this" to the first parameter of a function', () => {
    const greet = (person: { name: string }) => `Hello, I am ${person.name}`
    const bound = bindThis(greet)
    const result = bound.call({ name: 'Joe' })
    expect(result).toEqual('Hello, I am Joe')
  })

  it('should infer the type of the bound function', () => {
    const greet = (person: { name: string }) => `Hello, I am ${person.name}`
    const bound = bindThis(greet)
    expectTypeOf(bound).toEqualTypeOf<(this: { name: string }) => string>()
  })

  it('should infer the type of the bound function with no parameters', () => {
    const greet = () => 'Hello'
    const bound = bindThis(greet)
    expectTypeOf(bound).toEqualTypeOf(greet)
  })

  it('should infer the type of the bound function with multiple parameters', () => {
    const greet = (person: { name: string }, greeting: string) => `${greeting}, I am ${person.name}`
    const bound = bindThis(greet)
    expectTypeOf(bound).toEqualTypeOf<(this: { name: string }, greeting: string) => string>()
  })
}
