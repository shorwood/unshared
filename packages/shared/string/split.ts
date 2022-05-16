/**
 *
 * @param value
 * @param separator
 */
export const split = (value: string, separator: string | RegExp | [separator: string | RegExp, limit: number]) => (
  Array.isArray(separator)
    ? value.split(separator[0], separator[1])
    : value.split(separator)
)
