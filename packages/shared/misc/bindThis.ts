/* eslint-disable unicorn/prevent-abbreviations */
import { OmitFirstParameter } from '../types'

/**
 * Wrap a function that binds it's first argument to `this`
 * @param {Function} fn The function to bind
 * @returns {Function} A function that has `this` bound
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
// @ts-expect-error: ignore `this` error
export const bindThis = <F extends Function>(fn: F): OmitFirstParameter<F> => function(...args: any[]) { return fn(this, ...args) }
