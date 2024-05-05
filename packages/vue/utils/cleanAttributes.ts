import { cleanClasses } from './cleanClasses'

/**
 * Collapse HTML attributes by removing the properties that are `false`, `null`
 * or empty strings. This will produce a cleaner HTML output when rendering
 * components.
 *
 * @param attributes The attributes to collapse.
 * @returns The collapsed attributes.
 * @example cleanAttributes({ class: '', hidden: false, role: 'radio' }) // { role: 'radio' }
 */
export function cleanAttributes(attributes: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in attributes) {
    const value = attributes[key]
    if (value === false) continue
    if (value === null) continue
    if (value === undefined) continue

    // --- Skip empty strings.
    if (typeof value === 'string' && value.trim() === '') continue

    // --- Skip empty class objects.
    if (key === 'class' && typeof value === 'object') {
      const cleaned = cleanClasses(value as Record<string, unknown>)
      if (Object.keys(cleaned).length === 0) continue
      result[key] = cleaned
    }

    // --- Add the attribute to the result.
    result[key] = value
  }

  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
  describe('keep', () => {
    it('should return a new object', () => {
      const attributes = { value: 42 }
      const result = cleanAttributes(attributes)
      expect(result).not.toBe(attributes)
    })

    it('should keep valid attributes', () => {
      const result = cleanAttributes({ value: 42 })
      expect(result).toStrictEqual({ value: 42 })
    })
  })

  describe('exclude', () => {
    it('should collapse false attributes', () => {
      const result = cleanAttributes({ value: false })
      expect(result).toStrictEqual({})
    })

    it('should collapse null attributes', () => {
    // eslint-disable-next-line unicorn/no-null
      const result = cleanAttributes({ value: null })
      expect(result).toStrictEqual({})
    })

    it('should collapse undefined attributes', () => {
      const result = cleanAttributes({ value: undefined })
      expect(result).toStrictEqual({})
    })

    it('should collapse empty strings', () => {
      const result = cleanAttributes({ value: '' })
      expect(result).toStrictEqual({})
    })

    it('should collapse strings with only whitespace', () => {
      const result = cleanAttributes({ value: ' ' })
      expect(result).toStrictEqual({})
    })
  })

  describe('class', () => {
    it('should keep class objects with valid classes', () => {
      const result = cleanAttributes({ class: { 'text-red': true } })
      expect(result).toStrictEqual({ class: { 'text-red': true } })
    })

    it('should remove class objects where all classes are disabled', () => {
      const result = cleanAttributes({ class: { 'text-red': false } })
      expect(result).toStrictEqual({})
    })

    it('should remove class objects where class name is empty', () => {
      const result = cleanAttributes({ class: { '': true } })
      expect(result).toStrictEqual({})
    })
  })
}
