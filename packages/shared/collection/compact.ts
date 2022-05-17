/* eslint-disable arrow-body-style */

/**
 *
 * @param value
 */
export const compact = <T>(value: Array<T>): Array<NonNullable<T>> => {
  return value.filter(x => x !== undefined && x !== null) as any
}
