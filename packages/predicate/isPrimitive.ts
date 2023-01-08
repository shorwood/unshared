import { Primitive } from '@unshared-dev/types/common'

/**
 * Checks if the value is a primitive
 * A primitive is a value that is not an object or an array
 * @param value The value to check
 * @return `true` if the value is a primitive, `false` otherwise
 * @example
 * isPrimitive(1) // true
 * isPrimitive({}) // false
 */
export const isPrimitive = (value: any): value is Primitive =>
  typeof value === 'undefined'
  || typeof value === 'number'
  || typeof value === 'string'
  || typeof value === 'boolean'
  || typeof value === 'symbol'
  || typeof value === 'bigint'
  || value === null
