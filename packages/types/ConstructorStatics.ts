import type { Constructor } from './Constructor'
import type { OmitNever } from './OmitNever'

/**
 * Extract static properties from a class constructor.
 *
 * @template T The class to extract static properties from.
 * @returns The static properties of the class.
 * @example
 * class Foo { static a = 1 }
 * type A = ConstructorStatics<Foo> // { a: number }
 */
export type ConstructorStatics<T extends Constructor> =
  OmitNever<{ [K in Exclude<keyof T, 'prototype'>]: T[K] }>
