/**
 * Convert a string or number into a CSS unit.
 * @param input Input string.
 * @param unit Used CSS unit.
 * @return Unit converted into a valid CSS value string. Returns undefined if the input is invalid
 */
export function convertToUnit(input?: string | number, unit = 'px') {
  // --- If input is invalid.
  if (!input && input !== 0) return

  // --- If input is not a valid number.
  else if (Number.isNaN(+input)) return input.toString()

  // --- Convert to unit.
  return `${+input}${unit}`
}
