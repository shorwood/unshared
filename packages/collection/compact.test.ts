/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { compact } from './compact'

it('should filter out undefined and null values', () => {
  const result = compact([1, undefined, 2, null, 3])
  expect(result).toEqual([1, 2, 3])
})
