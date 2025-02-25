export type Spacing =
  | [top: number, right: number, bottom: number, left: number]
  | [top: number, vertical: number, bottom: number]
  | [vertical: number, horizontal: number]
  | number

/**
 * Normalize the spacing to a tuple of four numbers.
 *
 * @param spacing The spacing to normalize.
 * @returns The normalized spacing.
 * @example normalizeSpacing(1) // => [1, 1, 1, 1]
 */
function normalizeSpacing(spacing: Spacing): [top: number, right: number, bottom: number, left: number] {
  if (typeof spacing === 'number') return [spacing, spacing, spacing, spacing]
  if (spacing.length === 2) return [spacing[0], spacing[1], spacing[0], spacing[1]]
  if (spacing.length === 3) return [spacing[0], spacing[1], spacing[2], spacing[1]]
  if (spacing.length === 4) return spacing
  return [0, 0, 0, 0]
}

/**
 * Wrap the given text with horizontal and vertical whitespaces. This function
 * uses a format similar to the CSS `margin` and `padding` properties.
 *
 * @param text The text to wrap.
 * @param spacing The spacing to apply.
 * @returns The wrapped text.
 * @example setSpacing('Hello', 1) // => '\n Hello \n'
 */
export function setSpacing(text: string, spacing: Spacing): string {
  const [top, right, bottom, left] = normalizeSpacing(spacing)

  // --- Apply the horizontal spacing.
  const lines = text
    .split('\n')
    .map(line => ' '.repeat(left) + line + ' '.repeat(right))
    .join('\n')

  // --- Apply the vertical spacing and return.
  return '\n'.repeat(top) + lines + '\n'.repeat(bottom)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should add 1 space around a string', () => {
    const result = setSpacing('Hello', 1)
    expect(result).toEqual('\n Hello \n')
  })

  it('should add 2 vertical spaces and 1 horizontal space around a string', () => {
    const result = setSpacing('Hello', [2, 1])
    expect(result).toEqual('\n\n Hello \n\n')
  })

  it('should add 1 top, 2 horizontal and 3 bottom spaces around a string', () => {
    const result = setSpacing('Hello', [1, 2, 3])
    expect(result).toEqual('\n  Hello  \n\n\n')
  })

  it('should add 1 top, 2 right, 3 bottom and 4 left spaces around a string', () => {
    const result = setSpacing('Hello', [1, 2, 3, 4])
    expect(result).toEqual('\n    Hello  \n\n\n')
  })
}
