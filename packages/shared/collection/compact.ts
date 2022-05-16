/* eslint-disable arrow-body-style */
export type Compact = <T>(value: Array<T>) => Array<NonNullable<T>>

/**
 *
 * @param value
 */
export const compact: Compact = (value): any => {
  return value.filter(x => x !== undefined && x !== null)
}
