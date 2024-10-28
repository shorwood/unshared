import type { IsEmptyString, IsString } from './utils'

/**
 * Extract litteral types of strings separated by a delimiter.
 *
 * @template T String to extract litteral types from.
 * @template S Delimiter to split string with.
 * @template R The list of tokens extracted so far. (Used internally)
 * @returns Litteral types of strings separated by a delimiter.
 * @example StringSplit<'Hello,World'> // ['Hello', 'World']
 */
export type StringSplit<T extends string, S extends string = '', R extends string[] = []> =
  IsString<T> extends true ? string[]
    : IsEmptyString<T> extends true ? []

      // --- Split string by separator.
      : T extends `${infer A extends string}${S}${infer B extends string}`

        // --- Skip empty strings.
        ? IsEmptyString<A> extends true ? StringSplit<B, S, R>

          // --- Recursively split string.
          : [...R, A, ...StringSplit<B, S, R>]
        : [...R, T]
