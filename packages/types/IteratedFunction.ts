import { Key } from './Collection'
import { Values } from './Values'

/**
 * Function that is used to iterate over a collection.
 *
 * @template T The type of the collection.
 * @template R The type of the return value.
 * @example
 * type Collection = { a: number, b: string }
 * type Iteratee = IteratedFunction<Collection, boolean> // (value: number | string, key: 'a' | 'b', object: Collection) => boolean
 */
export type IteratedFunction<T, R> = (value: Values<T>, key: Key<T>, object: T) => R

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the parameters from an object', () => {
    interface collection { a: number; b: string }
    type result = IteratedFunction<collection, boolean>
    type expected = (value: number | string, key: 'a' | 'b', object: collection) => boolean
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should infer the parameters from an array', () => {
    type collection = number[]
    type result = IteratedFunction<collection, boolean>
    type expected = (value: number, key: number, object: collection) => boolean
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should infer the parameters from a string', () => {
    type collection = string
    type result = IteratedFunction<collection, boolean>
    type expected = (value: string, key: number, object: collection) => boolean
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
