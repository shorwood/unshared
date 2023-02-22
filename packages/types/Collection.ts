/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UnionMerge } from './MergeUnion'

/**
 * Collection of items in the form of an object or an array.
 *
 * @template T The type of the items in the collection.
 * @template K The type of the keys in the collection.
 * @returns The collection.
 * @example Collection<number> // { [key: string | symbol]: number } | ...
 */
export type Collection<T = unknown, K extends string | number | symbol = string | number | symbol> =
  K extends string ? { [P in K]: T } :
    K extends number ? Iterable<T> | Array<T> | readonly T[] | string :
      never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a collection of numbers', () => {
    type result = Collection<number>
    type expected = Record<string, number> | Iterable<number> | Array<number> | readonly number[] | string
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an object of numbers', () => {
    type result = Collection<number, string>
    type expected = Record<string, number>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return a type that matches an iterator', () => {
    type result = Collection<number, number>
    interface matches { [Symbol.iterator](): Iterator<number> }
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should return a type that matches a readonly array', () => {
    type result = Collection<number, number>
    type matches = readonly number[]
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should return a type that matches a tuple', () => {
    type result = Collection<number, number>
    type matches = [number, number, number]
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should return a type that matches a readonly tuple', () => {
    type result = Collection<number, number>
    type matches = readonly [number, number, number]
    expectTypeOf<matches>().toMatchTypeOf<result>()
  })

  it('should match a type that has symbol keys', () => {
    type result = Collection<number, 'a' | 'b' | 'c'>
    type union = UnionMerge<result>
    type expected = { a: number; b: number; c: number }
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
