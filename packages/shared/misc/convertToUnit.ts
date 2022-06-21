/**
 * Convert a string or number into a CSS unit.
 * @param {string | number} input A value
 * @param {"px" | "rem" | "em" | "vh" | "vw" | "%"} unit The unit to convert to
 * @returns {string} A unit
 */
export function convertToUnit(input?: string | number, unit: 'px' | 'rem' | 'em' | 'vh' | 'vw' | '%' = 'px'): string {
  // --- If input is invalid.
  if (!input) return '0'

  // --- If input is not a valid number, fallback to input.
  else if (Number.isNaN(+input)) return input.toString()

  // --- Join input and unit.
  return `${+input}${unit}`
}
