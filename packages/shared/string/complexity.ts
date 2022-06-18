/**
 * Computes the complexity of a string, generally a value.
 * @param {string} value The string
 * @returns {number} Approximate complexity
 */
export const complexity = (value: string): number => {
  // --- Initialize variables.
  let complexity = 0

  // --- Check for character types in value.
  for (let index = 0; index < value.length; index++) {
    const ch = value.charCodeAt(index)
    // --- If the character is a number, add 1 to complexity
    if (ch >= 48 && ch <= 57) complexity++
    // --- If the character is a lowercase letter, add 1 to complexity
    else if (ch >= 97 && ch <= 122) complexity++
    // --- If the character is an uppercase letter, add 2 to complexity
    else if (ch >= 65 && ch <= 90) complexity += 2
    // --- If the character is a symbol, add 4 to complexity
    else complexity += 4
  }

  // --- Return the complexity.
  return complexity
}
