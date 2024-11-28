/* eslint-disable sonarjs/no-useless-intersection */
import type { IteratorPath } from './IteratorPath'

describe('IteratorPath', () => {
  interface Person { age: number; name: { first: string; last: string } }

  test('should get the paths of an array', () => {
    type Result = IteratorPath<Person[]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of an object', () => {
    type Result = IteratorPath<{ a: Person; b: Person }>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of a tuple', () => {
    type Result = IteratorPath<[Person, Person]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of a readonly array', () => {
    type Result = IteratorPath<readonly Person[]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of a readonly tuple', () => {
    type Result = IteratorPath<readonly [Person, Person]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of a set', () => {
    type Result = IteratorPath<Set<Person>>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | string & {}>()
  })

  test('should get the paths of a map', () => {
    type Result = IteratorPath<Map<string, Person>>
    expectTypeOf<Result>().toEqualTypeOf<
      `${number}.age` |
      `${number}.name.first` |
      `${number}.name.last` |
      `${number}.name` |
      `${number}` |
      string & {}
    >()
  })
})
