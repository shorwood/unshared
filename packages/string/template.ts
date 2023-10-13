/* eslint-disable jsdoc/informative-docs */
/* eslint-disable sonarjs/no-duplicate-string */
import { get } from '@unshared/collection/get'
import { Collection } from '@unshared/types'
import { escapeRegexp } from './escapeRegexp'

export interface TemplateOptions<T> {
  /**
   * String used to delimit the start of an interpolation.
   *
   * @default '{{'
   */
  delimiterStart?: string
  /**
   * String used to delimit the end of an interpolation. This string must not
   * contain the start delimiter otherwise it will be considered as part of the
   * interpolation.
   *
   * @default '}}'
   */
  delimiterEnd?: string
  /**
   * Function used to transform the value before it is inserted into the
   * template. This function is called for each match and receives the value,
   * the key and the data object. This is useful for serializing objects or
   * formatting dates.
   */
  transform?: (value: string, key: string, data: T) => string
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
    delimiterStart = '{{',
    delimiterEnd = '}}',
    transform = x => x,
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
    const value = get(data, key)?.toString() ?? ''
    return transform(value, key, data)
  })
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should template a string with default options', () => {
    const result = template('Hello {{name}}', { name: 'World' })
    expect(result).toBe('Hello World')
  })

  it('should template a string with nested data', () => {
    const data = { name: { first: 'John', last: 'Doe' } }
    const result = template('Hello {{name.first}} {{name.last}}', data)
    expect(result).toBe('Hello John Doe')
  })

  it('should template a string with custom delimiters', () => {
    const result = template('Hello <%name%>', { name: 'World' }, {
      delimiterStart: '<%',
      delimiterEnd: '%>',
    })
    expect(result).toBe('Hello World')
  })

  it('should template a string with a custom transform', () => {
    const result = template('Hello {{name}}', { name: 'World' }, {
      transform: value => value.toUpperCase(),
    })
    expect(result).toBe('Hello WORLD')
  })

  it('should throw if data is not an object', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => template('Hello {{name}}', 1)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw if template is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => template(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
