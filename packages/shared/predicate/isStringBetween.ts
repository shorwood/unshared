/**
  * Check if the string's length is between min and max
  * @param value The value to check
  * @param } minmax The minimum and maximim length
  * @return `true` if the string's length is between min and max, `false` otherwise
  * @example
  * isStringBetween('foo', { min: 3 }) // true
  * isStringBetween('foo', { min: 6, max: 10 }) // false
  */
export const isStringBetween = (value: string, { min, max }: { min?: number; max?: number } = {}): boolean =>
  typeof value === 'string'
  && (typeof min === 'number' ? value.length >= min : true)
  && (typeof max === 'number' ? value.length <= max : true)
