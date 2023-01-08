import { expect, it } from 'vitest'
import { deburr } from './deburr'

it.each([
  ['déjà vu', 'deja vu'],
  ['José piña', 'Jose pina'],
])('should replace %s with %s', (value, expected) => {
  const result = deburr(value)
  expect(result).toEqual(expected)
})
