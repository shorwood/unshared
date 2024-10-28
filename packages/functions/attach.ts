import type { Function } from '@unshared/types'

/**
 * A function where the first parameter is already bound to `this`.
 *
 * @template F The function to bind.
 * @example Attached<(x: number, y: string) => boolean> // (this: number, y: string) => boolean
 */
export type Attached<F extends Function> =
  F extends (...parameters: infer P) => infer U
    ? P extends [infer T, ...infer R] ? (this: T, ...parameters: R) => U : F
    : never

/**
 * Move the first parameter of a function to `this`. Effectively attaching
 * the function to an object as if it were a method. This is useful when a
 * function expects a specific object as the first parameter, and you want
 * it to input that object from the `this` context instead.
 *
 * @param fn The function to bind `this` to.
 * @returns The bound function with it's first parameter bound to `this`.
 * @example
 * // Declare a function that takes a person object and returns a greeting.
 * function greet(person: { name: string }) {
 *   return `Hello, I am ${person.name}`
 * }
 *
 * // Bind the function to the person object.
 * class Person {
 *   name = 'Joe'
 *   greet = attach(greet)
 * }
 *
 * // Call the function from the person object.
 * new Person().greet() // Returns "Hello, I am Joe"
 */
export function attach<T extends Function>(fn: T): Attached<T> {
  return function(this: unknown, ...parameters: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fn(this, ...parameters)
  } as Attached<T>
}
