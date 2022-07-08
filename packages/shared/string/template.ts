import { get } from '../collection/get'
import { escapeRegExp } from './escapeRegExp'

export interface TemplateOptions {
  /**
   * String used to delimit the start and end of the interpolation.
   * @default ['{{', '}}']
   */
  delimiters?: [string, string]
  /**
   * Function used to transform the interpolation.
   * @see `get()`
   * @default (key, data) => get(data, key)
   */
  transform?: (context: { value: any; key: string; data: any }) => string
}

/**
 * Template a string by injecting values into it.
 * @param {string} content The string to template.
 * @param {object} data The data to inject into the string.
 * @param {TemplateOptions} options Custom options.
 * @returns {string} The templated string.
 * @example
 * template('Hello {{name}}', { name: 'World' }) // 'Hello World'
 * template('Hello {{name}}', { name: 'World' }, { delimiters: ['[[', ']]'] }) // 'Hello [[name]]'
 */
export const template = (content: string, data?: any, options: TemplateOptions = {}): string => {
  // --- Destructure options.
  const { delimiters = ['{{', '}}'], transform } = options

  // --- Escape delimiters and create regex.
  const [open, close] = delimiters.map(escapeRegExp)
  const regexp = new RegExp(`${open}(.+?)${close}`, 'g')

  // --- Replace, transform and return.
  return content.replace(regexp, (_, key) => {
    const value = get(data, key)
    return typeof transform === 'function'
      ? transform({ value, key, data })
      : value
  })
}
