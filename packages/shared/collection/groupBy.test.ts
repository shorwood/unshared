/* eslint-disable unicorn/consistent-function-scoping */
import { expect, it } from 'vitest'
import { groupBy } from './groupBy'

it('groups array by iterator function', () => {
  const object = [1, 2, 3, 4, 5] as const
  const iterator = (value: number) => (value % 2 === 0 ? 'even' : 'odd')
  const result = groupBy(object, iterator)
  expect(result).toEqual({
    even: [2, 4],
    odd: [1, 3, 5],
  })
})

it('groups array by path', () => {
  const object = [
    { name: 'one', value: 1 },
    { name: 'two', value: 2 },
    { name: 'two', value: 3 },
  ] as const
  const result = groupBy(object, 'name')
  expect(result).toEqual({
    one: [{ name: 'one', value: 1 }],
    two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
  })
})

it('groups object by iterator function', () => {
  const object = {
    1: { name: 'one', value: 1 },
    2: { name: 'two', value: 2 },
    3: { name: 'two', value: 3 },
  } as const
  const result = groupBy(object, value => value.name)
  expect(result).toEqual({
    one: [{ name: 'one', value: 1 }],
    two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
  })
})
