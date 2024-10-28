import type { IsZero, Substract } from './utils'

/**
 * Extract all of the nested keys of an object. The keys are returned as a
 * string literal union. This is useful for creating a type that can be used to
 * access nested properties of an object allowing comprehensive autocompletion
 * and type checking.
 *
 * @template T Object type to extract keys from.
 * @template N Number of nested keys to explore before returning a loose path.
 * @template P Current path to prepend to the keys. Used internally for recursion.
 * @returns List of possible paths.
 * @example
 * interface Contact {
 *  name: { first: string; last: string }
 *  email: string
 * }
 *
 * type Result = Path<Contact> // 'name' | 'name.first' | 'name.last' | 'email'
 */
export type Path<T, N extends number = 8, P extends string = ''> =
  T extends object

    // --- On recursion threshold, return the collected paths so far.
    ? IsZero<N> extends true ? P extends `${infer P1}.` ? P1 : P

      // --- If T is an Array and its items are objects, recurse.
      : T extends Array<infer U>
        ? U extends object
          ? Path<U, Substract<N, 1>, `${P}${number}.`>
          : (P extends '' ? `${number}` : `${P}${number}`)

        // --- For each key of T, collect the path.
        : Extract<{ [K in keyof T]-?: K extends number | string

          // --- Collect the path and prepend the current path.
          ? (P extends '' ? `${K}` : `${P}${K}`)

          // --- If the value is an object, recurse.
          | (T[K] extends object ? Path<T[K], Substract<N, 1>, `${P}${K}.`> : `${P}${K}`)

          // --- Ignore symbols.
          : never

        }[keyof T], string>

    // --- If T is not an object, return never.
    : never
