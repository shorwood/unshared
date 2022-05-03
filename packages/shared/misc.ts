/**
 * Convert a string or number into a CSS unit.
 * @param input Input string.
 * @param unit CSS unit.
 * @return Unit converted into a valid CSS value string. Returns undefined if the input is invalid
 */
export function convertToUnit(input?: string | number, unit = 'px' as 'px' | 'rem' | 'em' | 'vh' | 'vw' | '%') {
  // --- If input is invalid.
  if (!input) return '0'

  // --- If input is not a valid number, fallback to input.
  else if (Number.isNaN(+input)) return input.toString()

  // --- Join input and unit.
  return `${+input}${unit}`
}
