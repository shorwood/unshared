/* eslint-disable sonarjs/no-duplicate-string */
import { get } from '@unshared/collection/get'
import { escapeRegex } from './escapeRegex'

export interface TemplateOptions<T> {
  /**
   * String used to delimit the start of an interpolation.
   *
   * @default '{{'
   */
  delimiterStart?: string
  /**
   * String used to delimit the end of an interpolation.
   *
   * @default '}}'
   */
  delimiterEnd?: string
  /**
   * Function used to transform the interpolation.
   *
   * @see `get()`
   * @default
   * (key, data) => get(data, key)
   */
  transform?: (value: string, key: string, data: T) => string
}

/**
 * Template a string by injecting values into it.
 *
 * @param template The string to template.
 * @param data The data to inject into the string.
 * @param options Custom options.
 * @returns The templated string.
 * @throws If the template is not a string or the data is not an object.
 * @example template('Hello {{name}}', { name: 'World' }) // 'Hello World'
 */
export function template<T extends object>(template: string, data?: T, options: TemplateOptions<T> = {}): string {
  if (typeof data !== 'object' || data === null)
    throw new TypeError('Expected data to be an object')
  if (typeof template !== 'string')
    throw new TypeError('Expected template to be a string')

  // --- Destructure options.
  const {
    delimiterStart = '{{',
    delimiterEnd = '}}',
    transform,
  } = options

  // --- Validate options.
  if (typeof delimiterStart !== 'string')
    throw new TypeError('Expected delimiterStart to be a string')
  if (typeof delimiterEnd !== 'string')
    throw new TypeError('Expected delimiterEnd to be a string')
  if (transform && typeof transform !== 'function')
    throw new TypeError('Expected transform to be undefined or a function')

  // --- Escape delimiters and create regex.
  const open = escapeRegex(delimiterStart)
  const close = escapeRegex(delimiterEnd)
  const regexp = new RegExp(`${open}(.+?)${close}`, 'g')

  // --- Replace, transform and return.
  return template.replace(regexp, (_, key) => {
    const value = get(data, key)?.toString() ?? ''
    return typeof transform === 'function'
      ? transform(value, key, data)
      : value
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
