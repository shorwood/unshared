/**
 *
 * @param value
 */
export const kebabCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[^\da-z]+/gi, '-')
