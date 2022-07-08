/**
  * Check if the string is not empty
  * @param {string} value The value to check
  * @returns {boolean} `true` if value is not empty, `false` otherwise
  * @example
  * isStringNotEmpty('foo') // true
  * isStringNotEmpty('\n\n') // false
  */
export const isStringNotEmpty = (value: string): boolean =>
  typeof value === 'string'
  && value.trim().length > 0
