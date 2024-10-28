import type { Any } from './Any'
import type { Primitive } from './Primitive'

/**
 * Exclude primitive types from a type.
 */
export type NotPrimitive<U = Any> = U extends Primitive ? never : U
