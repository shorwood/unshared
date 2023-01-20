import { expect, it } from 'vitest'
import { getPrototypeChain } from './getPrototypeChain'

it('should return the prototype chain of a class', () => {
  class ClassA {}
  class ClassB extends ClassA {}
  class ClassC extends ClassB {}
  const classC = new ClassC()
  const result = getPrototypeChain(classC)
  expect(result).toEqual([ClassB.prototype, ClassA.prototype, Object.prototype])
})

it.each([
  ['null', null, []],
  ['undefined', undefined, []],
  ['an object', {}, []],
  ['a number', 1, [Number.prototype]],
  ['a string', 'foo', [String.prototype]],
  ['a boolean', true, [Boolean.prototype]],
  ['a symbol', Symbol('foo'), [Symbol.prototype]],
  ['an array', [], [Array.prototype]],
  ['a date', new Date(), [Date.prototype]],
  ['a regexp', /foo/, [RegExp.prototype]],
  ['a weakmap', new WeakMap(), [WeakMap.prototype]],
  ['a weakset', new WeakSet(), [WeakSet.prototype]],
])('should return the prototype chain of %s', (_, value, expected) => {
  const result = getPrototypeChain(value)
  expect(result).toEqual(expected)
})
