/* eslint-disable unicorn/prevent-abbreviations */
import { OmitFirstParameter } from '../types'

/**
 * Wrap a function that binds it's first argument to `this`
 * @param {Function} fn The function to bind
 * @returns {Function} A function that has `this` bound
 * @example
 * class Person {
 *   name: string
 *   constructor(name: string) {
 *     this.name = name
 *   }
 *   greet() {
 *     return `Hello, I am ${this.name}`
 *   }
 * }
 *
 * const boundGreet = bindThis(Person.prototype.greet)
 * const me = new Person('Ryan')
 * boundGreet.call(me) // => 'Hello, I am Ryan'
 */
// @ts-expect-error: ignore `this` error
export const bindThis = <F extends Function>(fn: F): OmitFirstParameter<F> => function(...args: any[]) { return fn(this, ...args) }
