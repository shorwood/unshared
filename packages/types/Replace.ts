/**
 * Replace all instances of a type union with another type.
 *
 * @template T The type union to replace types in.
 * @template U The replaced type.
 * @template V The replacement type.
 */
export type Replace<T, U, V> = U extends T ? T extends U ? V : T : T
