import { Get } from './Get'
import { Values } from './Values'
import { MathDecrease } from './MathDecrease'

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
    type result = Value<{ foo: { bar: { baz: 'baz' } } }, 'foo.bar.baz'>
    expectTypeOf<result>().toEqualTypeOf<'baz'>()
  })

  it('should extract the value of a nested array', () => {
    type result = Value<[{ foo: 'foo' }], '0.foo'>
    expectTypeOf<result>().toEqualTypeOf<'foo'>()
  })

  it('should extract the value of a nested object with a string number key', () => {
    type result = Value<{ foo: string; [x: number]: 'x' }, '0'>
    expectTypeOf<result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value of a nested object with a number key', () => {
    type result = Value<{ foo: string; [x: number]: 'x' }, 0>
    expectTypeOf<result>().toEqualTypeOf<'x'>()
  })

  it('should extract the value of a nested object with a symbol key', () => {
    type result = Value<{ foo: string; [x: symbol]: 'x' }, symbol>
    expectTypeOf<result>().toEqualTypeOf<'x'>()
  })

  it('should return never if the path is invalid', () => {
    type result = Value<{ foo: string }, 'bar'>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
