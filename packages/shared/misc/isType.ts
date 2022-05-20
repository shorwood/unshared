/**
 * Gets the type of a value.
 * @param {*} value The value to check
 * @returns {string} The type of value
 */
export const getType = (value: any) => {
  if (typeof value === 'undefined') return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'bigint') return 'bigint'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'symbol') return 'symbol'
  if (typeof value === 'function') return 'function'
  if (value instanceof RegExp) return 'regexp'
  if (value instanceof Date) return 'date'
  if (value instanceof Set) return 'set'
  if (value instanceof Map) return 'map'
  if (value instanceof WeakSet) return 'weakset'
  if (value instanceof WeakMap) return 'weakmap'
  if (Array.isArray(value)) return 'array'
  return 'object'
}

interface IsType {
  (value: unknown, type: 'undefined'): value is undefined
  (value: unknown, type: 'null'): value is null
  (value: unknown, type: 'boolean'): value is boolean
  (value: unknown, type: 'number'): value is number
  (value: unknown, type: 'bigint'): value is bigint
  (value: unknown, type: 'string'): value is string
  (value: unknown, type: 'symbol'): value is symbol
  (value: unknown, type: 'function'): value is Function
  (value: unknown, type: 'regexp'): value is RegExp
  (value: unknown, type: 'date'): value is Date
  (value: unknown, type: 'set'): value is Set<any>
  (value: unknown, type: 'map'): value is Map<any, any>
  (value: unknown, type: 'weakset'): value is WeakSet<any>
  (value: unknown, type: 'weakmap'): value is WeakMap<object, any>
  (value: unknown, type: 'array'): value is Array<any>
  (value: unknown, type: 'object'): value is Record<string | number | symbol, any>
  (value: unknown, type: string): boolean
}

/**
 * Checks if the value is of a specific type.
 * @param {any} value The value to check
 * @param {string} type The expected type
 * @returns {boolean} True if the value is of the expected type, false otherwise
 */
// @ts-expect-error: Function is not detected as a type predicactor.
export const isType: IsType = (value, type) => getType(value) === type
