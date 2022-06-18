/**
 * Checks if a value is an uppercase character
 * @param {string | number} value The value to check
 * @returns {boolean} Returns true if the value is an uppercase character, otherwise false
 * @example
 * isLowerCase('FOO') // => true
 * isLowerCase('Foo') // => false
 * isLowerCase('65') // => false
 * isLowerCase(65) // => true
 */
export const isUpperCase = (value: string | number): boolean => (
  typeof value === 'number'
    ? value >= 65 && value <= 90
    : [...value].map(x => x.charCodeAt(0)).every(isUpperCase)
)
