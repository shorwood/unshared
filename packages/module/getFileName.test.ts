import { expect, it } from 'vitest'
import { getFileName } from './getFileName'

it.each([
  ['/file', 'file'],
  ['file.ext', 'file'],
  ['/path/to/file', 'file'],
  ['/path/to/file.ext', 'file'],
])('should get the file name of %s', (path, expected) => {
  const result = getFileName(path)
  expect(result).toBe(expected)
})

it.each([
  [undefined],
  ['/path//'],
  ['/path/to/file/'],
  ['/path/to/file.ext/'],
  ['/'],
  [''],
  [0],
])('should throw if the path is %s', (path) => {
  const shouldThrow = () => getFileName(path as any)
  expect(shouldThrow).toThrow()
})
