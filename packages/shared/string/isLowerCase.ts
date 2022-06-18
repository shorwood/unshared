/**
 * Checks if a value is a lowercase character
 * @param {string | number} value The value to check
 * @returns {boolean} Returns true if the value is a lowercase character, otherwise false
 * @example
 * isLowerCase('foo') // => true
 * isLowerCase('Foo') // => false
 * isLowerCase('97') // => false
 * isLowerCase(97) // => true
 */
export const isLowerCase = (value: string | number): boolean => (
  typeof value === 'number'
    ? value >= 97 && value <= 122
    : value.toLowerCase() === value
)
