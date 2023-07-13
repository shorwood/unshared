import { Primitive } from "@unshared/types/Primitive"

/**
 * Checks if the value is a primitive
 * A primitive is a value that is not an object or an array
 *
 * @param value The value to check
 * @returns `true` if the value is a primitive, `false` otherwise
 * @example isPrimitive(1) // true
 */
export const isPrimitive = (value: unknown): value is Primitive =>
  value === undefined
  || typeof value === 'number'
  || typeof value === 'string'
  || typeof value === 'boolean'
  || typeof value === 'symbol'
  || typeof value === 'bigint'
  || value === null
