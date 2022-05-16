/**
 *
 * @param value
 */
export const pascalCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word.toUpperCase())
  .replace(/[^\da-z]+/gi, '-')
