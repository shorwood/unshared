/**
 * Split type of all properties of an object into a union.
 *
 * @template T The object to split.
 * @example UnionSplit<{ a: number, b: string }> // { a: number } | { b: string }
 */
export type UnionSplit<T> = { [K in keyof T]: { [P in K]: T[P] } }[keyof T]
