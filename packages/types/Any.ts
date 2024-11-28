import type { Function } from './Function'
import type { Primitive } from './Primitive'

/**
 * Matches all types except `unknown`.
 */
export type Any = Function | object | Primitive
