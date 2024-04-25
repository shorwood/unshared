import { Collection } from '@unshared/types'
import { get } from '@unshared/collection/get'
import { escapeRegexp } from './escapeRegexp'

export interface TemplateOptions<T> {
  /**
   * String used to delimit the end of an interpolation. This string must not
   * contain the start delimiter otherwise it will be considered as part of the
   * interpolation.
   *
   * @default '}}'
   */
  delimiterEnd?: string
  /**
   * String used to delimit the start of an interpolation.
   *
   * @default '{{'
   */
  delimiterStart?: string
  /**
   * Function used to transform the value before it is inserted into the
   * template. This function is called for each match and receives the value,
   * the key and the data object. This is useful for serializing non-string
   * values. By default, the value is converted to a string using the
   * `toString()` method.
   *
   * @default String
   */
  transform?: (value: unknown, key: string, data: T) => string
}

/**
 * Template a string using the given data and options. This function allows you
 * to provide a string with placeholders and replace them with some dynamic
 * data. The placeholders are defined should start and end with the given
 * delimiters. By default, the delimiters are `{{` and `}}`.
 *
 * @param template The string to template.
 * @param data The data to template with.
 * @param options The template options.
 * @returns The templated string.
 * @example
 *
 * // Create the data object.
 * const contact = { name: ['John', 'Doe'], email: 'jdoe@example.com' }
 *
 * // Create the template.
 * const messageTemplate = 'Hello {{name.0}}. You can reach me at {{email}}.'
 *
 * // Template the string.
 * const message = template(messageTemplate, contact) // 'Hello John. You can reach me at jdoe@example.com.'
 */
export function template<T extends Collection>(template: string, data: T, options: TemplateOptions<T> = {}): string {
  const {
    delimiterEnd = '}}',
    delimiterStart = '{{',
    transform = String,
  } = options

  // --- Validate options.
  if (delimiterStart === delimiterEnd)
    throw new Error('The start and end delimiters must be different.')

  // --- Escape delimiters and create regex.
  const open = escapeRegexp(delimiterStart)
  const close = escapeRegexp(delimiterEnd)
  const regexp = new RegExp(`${open}(.+?)${close}`, 'g')

  // --- Replace, transform and return.
  return template.replace(regexp, (_, key: string) => {
    const value = get(data, key)
    return transform(value, key, data)
  })
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should template a string with default options', () => {
    const result = template('Hello {{name}}', { name: 'World' })
    expect(result).toBe('Hello World')
  })

  test('should template a string with nested data', () => {
    const data = { name: { first: 'John', last: 'Doe' } }
    const result = template('Hello {{name.first}} {{name.last}}', data)
    expect(result).toBe('Hello John Doe')
  })

  test('should template a string with custom delimiters', () => {
    const result = template('Hello <%name%>', { name: 'World' }, {
      delimiterEnd: '%>',
      delimiterStart: '<%',
    })
    expect(result).toBe('Hello World')
  })

  test('should template a string with a custom transform', () => {
    const result = template('Hello {{name}}', { name: 'World' }, {
      transform: value => (value as string).toUpperCase(),
    })
    expect(result).toBe('Hello WORLD')
  })

  test('should template a value and transform it into a string by default', () => {
    const result = template('Hello {{name}}', { name: { toString: () => 'World' } })
    expect(result).toBe('Hello World')
  })
}
