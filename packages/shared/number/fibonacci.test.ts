import { expect, it } from 'vitest'
import { fibonacci } from './fibonacci'

it('computes the Fibonacci number at N non recursively', () => {
  expect(fibonacci(0)).toEqual(0)
  expect(fibonacci(1)).toEqual(1)
  expect(fibonacci(2)).toEqual(1)
  expect(fibonacci(3)).toEqual(2)
  expect(fibonacci(4)).toEqual(3)
  expect(fibonacci(5)).toEqual(5)
  expect(fibonacci(6)).toEqual(8)
  expect(fibonacci(7)).toEqual(13)
  expect(fibonacci(8)).toEqual(21)
  expect(fibonacci(9)).toEqual(34)
  expect(fibonacci(10)).toEqual(55)
})

it('should fail when N is negative', () => {
  expect(() => { fibonacci(-1) }).toThrow(Error)
})
