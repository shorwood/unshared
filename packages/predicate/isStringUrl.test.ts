import { expect, it } from 'vitest'
import { isStringUrl } from './isStringUrl'

it.each([

  // --- Returns true
  [true, 'example.com'],
  [true, 'https://example.com'],
  [true, 'https://example.com/'],
  [true, 'https://example.com/path'],
  [true, 'https://example.com/path/'],
  [true, 'https://example.com/path?query=1'],
  [true, 'https://example.com/path?query=1#hash/'],

  // --- Returns false
  [false, 'https://example'],
  [false, 'https://example.'],
  [false, 'https:/example.com/path/path'],

])('should return %s when checking if %s is string url', (expected, value) => {
  const result = isStringUrl(value)
  expect(result).toEqual(expected)
})
