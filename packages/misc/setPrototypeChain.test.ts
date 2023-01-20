import { expect, it } from 'vitest'
import { getPrototypeChain } from './getPrototypeChain'
import { setPrototypeChain } from './setPrototypeChain'

it('should set the prototype chain of a class', () => {
  class ClassA {}
  class ClassB {}
  class ClassC {}
  const classA = new ClassA()
  const classB = new ClassB()
  const classC = new ClassC()
  const result = setPrototypeChain(classC, classB, classA)
  expect(result).toEqual(classC)
  expect(classC).toBeInstanceOf(ClassA)
  expect(classC).toBeInstanceOf(ClassB)
  expect(classC).toBeInstanceOf(ClassC)
})
