/* eslint-disable unicorn/prevent-abbreviations */
import { OmitFirstParameter } from "@unshared/types/OmitFirstParameter"

/**
 * Wrap a function that binds it's first argument to `this`
 *
 * @param fn The function to bind
 * @returns A function that has `this` bound
 * @example
 * const greet = (person: Person) => `Hello, I am ${person.name}`
 *
 * class Person {
 *   constructor(public name: string) {}
 *   greet = bindThis(greet)
 * }
 *
 * new Person('Joe').greet() // 'Hello, I am Joe'
 */
export const bindThis = <T extends Function>(fn: T): OmitFirstParameter<T> =>
  // @ts-expect-error: `this` will be inherited from the calling context
  function(...args: any[]) { return fn(this, ...args) }

/* c8 ignore next */
if (import.meta.vitest) {
  it('should bind "this" to the first parameter of a class method', () => {
    const greet = (person: Person) => `Hello, I am ${person.name}`
    class Person {
      constructor(public name: string) {}
      greet = bindThis(greet)
    }
    const result = new Person('Joe').greet()
    expect(result).toEqual('Hello, I am Joe')
  })

  it('should bind "this" to the first parameter of an object method', () => {
    const greet = (person: { name: string }) => `Hello, I am ${person.name}`
    const person = { name: 'Joe', greet: bindThis(greet) }
    const result = person.greet()
    expect(result).toEqual('Hello, I am Joe')
  })
}
