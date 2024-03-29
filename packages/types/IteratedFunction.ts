import { Key } from './Key'
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
    type Result = IteratedFunction<{ a: number; b: string }, boolean>
    type Expected = (value: number | string, key: 'a' | 'b', object: { a: number; b: string }) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the parameters from a tuple', () => {
    type Result = IteratedFunction<[number, string], boolean>
    type Expected = (value: number | string, key: number, object: [number, string]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the parameters from an array', () => {
    type Result = IteratedFunction<number[], boolean>
    type Expected = (value: number, key: number, object: number[]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the parameters from a readonly array', () => {
    type Result = IteratedFunction<readonly number[], boolean>
    type Expected = (value: number, key: number, object: readonly number[]) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the parameters from a string', () => {
    type Result = IteratedFunction<string, boolean>
    type Expected = (value: string, key: number, object: string) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
