import { Values } from './Values'
import { Key } from './Key'

/**
 * Function that is used to iterate over a collection.
 *
 * @template T The type of the collection.
 * @template R The type of the return value.
 * @example
 * type Collection = { a: number, b: string }
 * type Iteratee = IteratorFunction<Collection, boolean> // (value: number | string, key: 'a' | 'b', object: Collection) => boolean
 */
export type IteratorFunction<T = unknown, R = unknown> = (value: Values<T>, key: Key<T>, object: T) => R

/** v8 ignore start */
if (import.meta.vitest) {
  test('should infer the parameters from an object', () => {
    type Result = IteratorFunction<{ a: number; b: string }, boolean>
    type Expected = (value: (number | string), key: 'a' | 'b', object: { a: number; b: string }) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a Record', () => {
    type Result = IteratorFunction<Record<string, number>, boolean>
    type Expected = (value: number, key: string, object: Record<string, number>) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a tuple', () => {
    type Result = IteratorFunction<[1, 2], boolean>
    type Expected = (value: 1 | 2, key: number, object: [1, 2]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a readonly tuple', () => {
    type Result = IteratorFunction<readonly [1, 2], boolean>
    type Expected = (value: 1 | 2, key: number, object: readonly [1, 2]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from an array', () => {
    type Result = IteratorFunction<number[], boolean>
    type Expected = (value: number, key: number, object: number[]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a readonly array', () => {
    type Result = IteratorFunction<readonly number[], boolean>
    type Expected = (value: number, key: number, object: readonly number[]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a string', () => {
    type Result = IteratorFunction<string, boolean>
    type Expected = (value: string, key: number, object: string) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a Set', () => {
    type Result = IteratorFunction<Set<number>, boolean>
    type Expected = (value: number, key: number, object: Set<number>) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the parameters from a Map', () => {
    type Result = IteratorFunction<Map<string, number>, boolean>
    type Expected = (value: [string, number], key: number, object: Map<string, number>) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
