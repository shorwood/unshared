/**
  * Check if value is a number in the given range
  * @param {number} value The value to check
  * @param {{ min: number; max: number }} range The range to check
  * @returns {boolean} True if value is in the given range
  * @example
  * isNumberBetween(1, { min: 0 }) // true
  * isNumberBetween(1, { max: 1 }) // true
  * isNumberBetween(2, { min: 0, max: 1 }) // false
  */
export const isNumberBetween = (value: number, { min, max }: { min?: number; max?: number } = {}): boolean =>
  typeof value === 'number'
  && (typeof min === 'number' ? value >= min : true)
  && (typeof max === 'number' ? value <= max : true)
