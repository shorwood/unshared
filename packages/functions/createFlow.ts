import { Function } from '@unshared/types'

export type Transformer<V, U> = (value: V) => U

/**
 * A chain of transformers that can be applied to a value using the {@link flow}
 * function. The `TransformerChain` type is a recursive type that represents takes
 * the result of the previous transformer as its first parameter and returns a
 * tuple of the transformers that can be applied to the value.
 *
 * @template V The type of the value to transform.
 * @template T The type of the transformers.
 * @example
 * // Declare the transformers
 * type ToString = (n: number) => string
 * type ToNumber = (s: string) => number
 *
 * // Declare the transformer chain
 * type Chain = TransformerChain<number, [ToString, ToNumber]> // => [ToString, ToNumber]
 */
export type TransformerChain<V, T extends Function[]> =
  // --- If the chain is a single transformer, return it.
  T extends [(value: V) => unknown] ? T

    // --- If the chain is a tuple of transformers, recursively validate each pair.
    : T extends [
      infer U1 extends (value: V) => infer R1, // Transformer<V, infer R1>,
      infer U2 extends (value: infer V2) => infer R, // Transformer<infer V2, infer R>,
      ...infer Next extends Function[],
    ]

      // --- If the first transformer returns a value that can be passed to the
      // --- second transformer, return the pair and continue validating the rest
      // --- of the chain.
      ? R1 extends V2 ? [U1, ...TransformerChain<V2, [U2, ...Next]>] : never
      : never

export type TransformerChainReturnType<T extends Function[]> =
  T extends [...Function[], Function<infer U>] ? U : never

/**
 * Transform a value using a chain of transformers. The `flow` function takes a
 * value and a list of transformers and applies consecutively each transformer to
 * the value. The result of the previous transformer is passed as the first
 * parameter of the next transformer.
 *
 * If one of the `transformer` functions returns a `Promise`, the final value
 * will be a `Promise` as well.
 *
 * @param value The value to transform.
 * @param transformers The transformers to apply.
 * @returns The transformed value.
 * @example flow(Math.PI, Math.round, String) // => "3"
 */
export function flow<V, T extends Function[] = Function[]>(value: V, ...transformers: TransformerChain<V, T>): TransformerChainReturnType<T> {
  return transformers.reduce((value, transformer) => transformer(value), value)
}


/* c8 ignore next */
if (import.meta.vitest) {
  it('should transform a value using the given transformers', () => {
    const result = flow('0.001', Number.parseFloat, Math.sin)
    const result2 = flow(Math.PI, Math.round)
    const result3 = flow(Math.PI, Math.round, String, String)
    expect(result).toEqual('3')
  })

  it('should be able to transform a value using async transformers', async() => {
    const result = await flow(Math.PI, async(n: number) => n, Math.round, String)
    expect(result).toEqual('3')
  })
}
