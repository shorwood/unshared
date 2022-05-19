/**
 *
 * @param value
 */
export const camelCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
  .replace(/[^\da-z]+/gi, '')
