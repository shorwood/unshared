
import { expect, it } from 'vitest'
import { sortBy } from './sortBy'

it('sorts an array by the result of an iterator function or path', () => {
  // expect(sortBy([5, 4, 3, 2, 1], value => -value)).toEqual([5, 4, 3, 2, 1])
  // expect(sortBy([5, 4, 3, 2, 1], value => value)).toEqual([1, 2, 3, 4, 5])
  // expect(sortBy([{ a: 5 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 1 }], 'a')).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }])
  // expect(sortBy([{ foo: '2', bar: '1' }, { foo: '3', bar: '1' }, { foo: '1', bar: '1' }], ['foo', 'bar'])).toEqual([{ foo: '1', bar: '1' }, { foo: '2', bar: '1' }, { foo: '3', bar: '1' }])
})
