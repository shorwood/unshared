export const trim = (value: string) => value
  .trim()

export const lowerCase = (value: string) => value
  .toLowerCase()

export const upperCase = (value: string) => value
  .toUpperCase()

export const snakeCase = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z]+/gi, '_')

export const kebabCase = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z]+/gi, '-')

export const camelCase = (value: string) => value
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
  .replace(/[^a-z]+/gi, '')

export const pascalCase = (value: string) => value
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word
    .toUpperCase()).replace(/[^a-z]+/gi, '')

export const capitalize = (value: string) => value
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word.toUpperCase())
  .replace(/[^a-z]+/gi, ' ')
