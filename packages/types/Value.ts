import { Get } from './Get'
import { MathDecrease } from './MathDecrease'
import { Values } from './Values'

/**
 * Extract nested value of an object recursively.
 *
 * @template T Object type
 * @template P Path to get value from
 * @template N Depth of recursion
 * @returns Value at path.
 */
export type Value<T, P extends string | number | symbol, N extends number = 8> =
  // --- Try to get the value at key P.
  Get<T, P> |

  // --- If recursion threashold, return `unknown`.
  (N extends 0 ? unknown

    // --- Extract current segment.
    : P extends `${infer K}.${infer PNext}`

      // --- First segment is key of the object, recurse
      ? K extends keyof T
        ? Value<Values<T>, PNext, MathDecrease<N>>
        | Extract<T, undefined>

      // --- Path is invalid
        : never : never)

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extract the value of a nested object', () => {
    type Result = Value<{ foo: { bar: { baz: 'baz' } } }, 'foo.bar.baz'>
    expectTypeOf<Result>().toEqualTypeOf<'baz'>()
  })

  it('should extract the value of a nested array', () => {
    type Result = Value<[{ foo: 'foo' }], '0.foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })

  it('should extract the value of a nested object with a string number key', () => {
    type Result = Value<{ foo: string; [x: number]: 'x' }, '0'>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value of a nested object with a number key', () => {
    type Result = Value<{ foo: string; [x: number]: 'x' }, 0>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value of a nested object with a symbol key', () => {
    type Result = Value<{ foo: string; [x: symbol]: 'x' }, symbol>
    expectTypeOf<Result>().toEqualTypeOf<'x'>()
  })

  it('should return never if the path is invalid', () => {
    type Result = Value<{ foo: string }, 'bar'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
