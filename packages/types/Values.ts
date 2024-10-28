import type { Collection } from './Collection'

/**
 * Values of an array or object
 *
 * @template T The collection to get the values from
 * @returns The values of the collection
 */
export type Values<T = unknown> = T extends Collection<infer U> ? U : unknown
