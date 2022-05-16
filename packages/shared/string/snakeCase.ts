/**
 *
 * @param value
 */
export const snakeCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[^\da-z]+/gi, '-')
