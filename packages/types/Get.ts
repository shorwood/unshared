import type { IsZero, Substract } from './utils'

/**
 * Extract nested value of an object recursively. This is useful for creating a
 * type that can be used to access nested properties of an object allowing
 * comprehensive autocompletion and type checking.
 *
 * @template T Object type to extract value from.
 * @template P Path to the value to extract.
 * @returns The value at the path.
 * @example Get<{ foo: { bar: { baz: 'baz' } } }, 'foo.bar.baz'> // 'baz'
 */
export type Get<T, P extends string, D extends number = 8> =
  IsZero<D> extends true ? never

  // --- Extract the key of the left-most segment.
    : P extends `${infer K}.${infer N}`

    // --- If the segment matches the key of the object, continue.
      ? K extends keyof T ? Get<T[K], N, Substract<D, 1>>
        : T extends Iterable<infer U> ? `${K}` extends `${number}` ? Get<U, N, Substract<D, 1>>
          : never : never

    // --- Otherwise, return the value at the current path.
      : P extends keyof T ? T[P]
        : T extends Iterable<infer U> ? `${P}` extends `${number}` ? U : never
          : never
