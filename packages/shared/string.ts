
export const trim = (value: string) => value
  .trim()

export const join = (values: string[], separator: string) => values
  .join(separator)

export const split = (value: string, separator: string | RegExp | [separator: string | RegExp, limit: number ]) => (
  Array.isArray(separator)
    ? value.split(separator[0], separator[1])
    : value.split(separator)
)

export const lowerCase = (value: string) => value
  .toLowerCase()

export const upperCase = (value: string) => value
  .toUpperCase()

export const snakeCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[^\da-z]+/gi, '-')

export const kebabCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[^\da-z]+/gi, '-')

export const camelCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
  .replace(/[^\da-z]+/gi, '-')

export const pascalCase = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word.toUpperCase())
  .replace(/[^\da-z]+/gi, '-')

export const capitalize = (value: string) => value
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word.toUpperCase())
