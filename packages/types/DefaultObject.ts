import type { IsZero, Substract } from '@unshared/types'
import type { Default } from './Default'
import type { DefaultValue } from './DefaultValue'

/**
 * Default the properties of an object by the properties of another object.
 * Meaning that if the first object has a property that is undefined or null,
 * the second object's property will be used instead.
 *
 * @template T1 The object to default
 * @template T2 The object to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted object
 */
export type DefaultObject<T1 extends object, T2 extends object, N extends number = 0> =
  {
    [P in (keyof T1 | keyof T2)]-?:
    P extends keyof T1 ? P extends keyof T2
      ? IsZero<N> extends true
        ? DefaultValue<T1[P], T2[P]>
        : Default<T1[P], T2[P], Substract<N, 1>>
      : T1[P]
      : P extends keyof T2 ? DefaultValue<undefined, T2[P]> : never
  }
