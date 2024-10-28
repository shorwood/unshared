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
