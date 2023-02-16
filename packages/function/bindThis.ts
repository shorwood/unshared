/* eslint-disable unicorn/prevent-abbreviations */
import { OmitFirstParameter } from '@unshared-dev/types/function'

/**
 * Wrap a function that binds it's first argument to `this`
 * @param fn The function to bind
 * @return A function that has `this` bound
 * @example
 * const greet = (person: Person) => `Hello, I am ${person.name}`
 *
 * class Person {
 *   constructor(name: string) { this.name = name }
 *   greet = bindThis(greet)
 *   name: string
 * }
 *
 * new Person('Joe').greet() // 'Hello, I am Joe'
 */
// @ts-expect-error: ignores undefined `this` argument
export const bindThis = <F extends Function>(fn: F): OmitFirstParameter<F> => function(...args: any[]) { return fn(this, ...args) }