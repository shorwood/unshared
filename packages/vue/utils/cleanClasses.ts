/**
 * Clean a class object by removing empty or disabled classes.
 *
 * @param classes The classes to clean.
 * @returns The cleaned classes.
 * @example cleanClasses({ '': true, 'text-blue': false, 'text-red': true }) // { 'text-red': true }
 */
export function cleanClasses(classes: Record<string, unknown>): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const key in classes) {
    if (key.trim() === '') continue
    if (key === 'undefined') continue
    if (classes[key] === false) continue
    result[key] = !!classes[key]
  }
  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a new object', () => {
    const classes = { 'text-red': true }
    const result = cleanClasses(classes)
    expect(result).not.toBe(classes)
  })

  test('should keep valid classes', () => {
    const result = cleanClasses({ 'text-red': true })
    expect(result).toStrictEqual({ 'text-red': true })
  })

  test('should remove empty classes', () => {
    const result = cleanClasses({ '': true })
    expect(result).toStrictEqual({})
  })

  test('should remove `undefined` classes', () => {
    const result = cleanClasses({ undefined: true })
    expect(result).toStrictEqual({})
  })

  test('should remove disabled classes', () => {
    const result = cleanClasses({ 'text-red': false })
    expect(result).toStrictEqual({})
  })
}
