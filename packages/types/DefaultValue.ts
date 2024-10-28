import type { Nil } from '@unshared/types'

/**
 * Default a value by another value. Meaning that if the first value is
 * undefined or null, the second value will be used instead.
 *
 * @template T1 The type to default
 * @template T2 The type to default with
 * @returns The defaulted value
 * @example DefaultValue<number | undefined, string> // number | string
 */
export type DefaultValue<T1, T2> = T1 extends Nil ? T2 : T1
