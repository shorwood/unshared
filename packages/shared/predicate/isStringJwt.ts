/**
 * Check if string matches JSON Web Token.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches a JSON Web Token, `false` otherwise
 * @see https://jwt.io/
 * @example
 * isStringJwt('eyJhbGciOiJIUz.eyJzdWIiOiIxMjM0NTY3O.SflKxwRJSM6POk6yJV_adQssw5c') // true
 */
export const isStringJwt = (value: string): boolean =>
  typeof value === 'string'
  && /^[\w=-]+\.[\w=-]+\.?[\w+./=-]*$/.test(value)
