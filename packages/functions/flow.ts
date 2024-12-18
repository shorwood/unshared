import type { Function } from '@unshared/types'

/**
 * The result of the `flow` function. If one of the `transformer` functions
 * returns a `Promise`, the final value will be a `Promise` as well.
 *
 * @template T The list of transformers.
 * @returns The result of the last transformer.
 * @example FlowResult<[number, Promise<string>, boolean]> // => Promise<boolean>
 */
type FlowResult<T extends unknown[]> =
  T extends [...Array<infer U>, infer R]
    ? U extends Promise<any>
      ? Promise<R>
      : R
    : never

export function flow<V, R>(value: V, transformer: (value: V) => R): R
export function flow<V, R1, R2>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2): FlowResult<[R1, R2]>
export function flow<V, R1, R2, R3>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3): FlowResult<[R1, R2, R3]>
export function flow<V, R1, R2, R3, R4>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3, transformer4: (value: Awaited<R3>) => R4): FlowResult<[R1, R2, R3, R4]>
export function flow<V, R1, R2, R3, R4, R5>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3, transformer4: (value: Awaited<R3>) => R4, transformer5: (value: Awaited<R4>) => R5): FlowResult<[R1, R2, R3, R4, R5]>
export function flow<V, R1, R2, R3, R4, R5, R6>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3, transformer4: (value: Awaited<R3>) => R4, transformer5: (value: Awaited<R4>) => R5, transformer6: (value: Awaited<R5>) => R6): FlowResult<[R1, R2, R3, R4, R5, R6]>
export function flow<V, R1, R2, R3, R4, R5, R6, R7>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3, transformer4: (value: Awaited<R3>) => R4, transformer5: (value: Awaited<R4>) => R5, transformer6: (value: Awaited<R5>) => R6, transformer7: (value: Awaited<R6>) => R7): FlowResult<[R1, R2, R3, R4, R5, R6, R7]>
export function flow<V, R1, R2, R3, R4, R5, R6, R7, R8>(value: V, transformer: (value: V) => R1, transformer2: (value: Awaited<R1>) => R2, transformer3: (value: Awaited<R2>) => R3, transformer4: (value: Awaited<R3>) => R4, transformer5: (value: Awaited<R4>) => R5, transformer6: (value: Awaited<R5>) => R6, transformer7: (value: Awaited<R6>) => R7, transformer8: (value: Awaited<R7>) => R8): FlowResult<[R1, R2, R3, R4, R5, R6, R7, R8]>

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
export function flow(value: unknown, ...transformers: Function[]) {
  let result: unknown = value

  // --- Apply each transformer to the value.
  for (let i = 0; i < transformers.length; i++) {
    const transformer = transformers[i]
    result = transformer(result)

    // --- If the result is a promise, wait for it to resolve.
    if (result instanceof Promise) {
      const nextTransformers = transformers.slice(i + 1)

      // @ts-expect-error: Spread argument is of the correct type.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result.then(value => flow(value, ...nextTransformers))
    }
  }
  return result
}
