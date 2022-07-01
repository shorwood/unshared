import { get } from '../collection/get'

export interface TemplateOptions {
  /**
   * String used to delimit the start and end of the interpolation.
   * @default ['{{', '}}']
   */
  delimiters?: [string, string]
}

/**
 * Template a string by injecting values into it.
 * @param content The string to template.
 * @param data The data to inject into the string.
 * @param options Custom options.
 * @returns The templated string.
 */
export const template = (content: string, data: any, options: TemplateOptions = {}): string => {
  // --- Destructure options.
  const { delimiters = ['{{', '}}'] } = options

  // --- Escape delimiters and create regex.
  const [open, close] = delimiters.map(d => d.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'))
  const matches = new RegExp(`${open}(.+?)${close}`, 'g')

  // --- Replace interpolation.
  return content.replace(matches, (_, key) => {
    let value = get(data, key)
    if (typeof value === 'function') value = value()
    if (typeof value === 'object') return JSON.stringify(value, undefined, 2)
    return value ?? ''
  })
}
