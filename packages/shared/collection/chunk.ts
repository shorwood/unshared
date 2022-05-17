import { Matrix } from '../types'

/**
 *
 * @param array
 * @param size
 */
export const chunk = <T>(array: Array<T>, size: number): Matrix<T> => {
  const result = []
  let index = 0
  while (index < array.length) {
    result.push(array.slice(index, index + size))
    index = index + size
  }
  return result
}
