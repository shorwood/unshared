import { Matrix } from '../types'

/**
 *
 * @param array
 * @param size
 */
export const chunk = <T>(array: Array<T>, size: number): Matrix<T> => {
  const arrayChunked = []
  for (let index = 0; index < array.length; index += size)
    arrayChunked.push(array.slice(index, index + size))
  return arrayChunked
}
