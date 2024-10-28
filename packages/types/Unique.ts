/**
 * Deduplicate a tuple type by its values. Order is preserved and the first
 * occurence of each value is kept.
 *
 * @template T Tuple to deduplicate.
 * @example Unique<[1, 1, 2, 3, 3]> // [1, 2, 3]
 */
export type Unique<T extends readonly unknown[], R extends unknown[] = []> =
 T extends []
   ? R
   : T extends [...infer Rest, infer A]
     ? A extends Rest[number]
       ? Unique<Rest, R>
       : Unique<Rest, [A, ...R]>
     : never
