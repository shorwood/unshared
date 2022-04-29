
export const camelCase = (string: string) => string
  .replace(/^\w|[A-Z]|\b\w/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
  .replace(/\s+/g, '')
