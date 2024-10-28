import type { Constructor } from './Constructor'

/**
 * Extract the instance type from a constructor or instance of a class.
 *
 * @template T The constructor type or instance type.
 * @example
 * // Given a constructor type, extract the instance type.
 * type Result = MaybeInstance<typeof Set> // Set<unknown>
 *
 * // Given an instance type, extract the instance type.
 * type Result = MaybeInstance<Set<number>> // Set<number>
 */
export type MaybeInstance<T> = T extends Constructor<infer C> ? C : T
