import { Matrix } from '../types'

export type Chunk = <T>(array: Array<T>, size: number) => Matrix<T>

/**
 *
 * @param array
 * @param size
 */
export const chunk: Chunk = (array, size) => {
  const result = []
  let index = 0
  while (index < array.length) {
    result.push(array.slice(index, index + size))
    index = index + size
  }
  return result
}
