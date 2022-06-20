/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { compact } from './compact'

it('should filter out undefined and null values', () => {
  expect(compact([0, undefined, 1, null, 2])).toEqual([0, 1, 2])
})
