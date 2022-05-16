/**
 *
 * @param value
 */
export const compact = <T>(value: Array<T>): Array<T> => value.filter(Boolean)
