/**
 * Computes the complexity of a password.
 * @param {string} password The password
 * @returns {number} Approximate complexity
 */
export const passwordComplexity = (password: string): number => {
  // --- Initialize variables.
  let complexity = 0

  // --- Check for character types in password.
  for (let index = 0; index < password.length; index++) {
    const ch = password.charCodeAt(index)
    // --- If the character is a number, add 1 to complexity
    if (ch >= 65 && ch <= 90) complexity++
    // --- If the character is a lowercase letter, add 1 to complexity
    else if (ch >= 97 && ch <= 122) complexity++
    // --- If the character is an uppercase letter, add 2 to complexity
    else if (ch >= 48 && ch <= 57) complexity += 2
    // --- If the character is a symbol, add 4 to complexity
    else complexity += 4
  }

  // --- Return the complexity.
  return complexity
}
