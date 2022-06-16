/**
 * Computes the complexity of a password on a scale from 0 to 5
 * @param {string} data The password
 * @returns {number} Approximate complexity
 */
export const passwordComplexity = (data: string): number => {
  // --- Initialize flags
  let hasUpper = false
  let hasLower = false
  let hasNumber = false
  let hasSymbol = false

  // --- Check for character types in password
  for (let index = 0; index < data.length; index++) {
    const ch = data.charCodeAt(index)
    if (ch >= 65 && ch <= 90) hasUpper = true
    else if (ch >= 97 && ch <= 122) hasLower = true
    else if (ch >= 48 && ch <= 57) hasNumber = true
    else hasSymbol = true
  }

  // --- Computes the complexity
  let complexity = 0
  if (hasUpper) complexity++
  if (hasLower) complexity++
  if (hasNumber) complexity++
  if (hasSymbol) complexity++
  if (data.length >= 8) complexity++

  // --- Return the complexify
  return complexity
}
