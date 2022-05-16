/**
 *
 * @param array
 */
export const uniq = <T>(array?: Array<T>) => [...new Set(array)]
