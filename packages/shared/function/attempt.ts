/* eslint-disable unicorn/prevent-abbreviations */
import { MaybePromise } from '../types'

/**
 * Attemt to run a function and return an array with the value and the error if any.
 * @param fn The function to run.
 * @returns The value and the error if any.
 */
export function attempt<R>(fn: () => Promise<R>): Promise<[R | undefined, Error | undefined]>
export function attempt<R>(fn: () => Exclude<R, Promise<any>>): [R | undefined, Error | undefined]
export function attempt<R>(fn: () => MaybePromise<R>): MaybePromise<[R | undefined, Error | undefined]>
export function attempt(fn: Function): any {
  try {
    const result = fn()
    return result instanceof Promise
      ? result
        .then(value => [value, undefined])
        .catch(error => [undefined, error])
      : [result, undefined]
  }

  // --- Catch sync error.
  catch (error: any) {
    return [undefined, error]
  }
}
