import { Values } from './Values'
import { Path } from './Path'

/**
 * A type that may match the path of the elements in a collection. This type is
 * used to allow auto-completion in IDEs without losing the ability to match
 * non-literal string types.
 *
 * @template T Type of the collection to get the path from.
 * @example
 * interface Person {
 *   age: number
 *   name: {
 *     first: string
 *     last: string
 *  }
 * }
 *
 * // Wrap the `Person` type in an array.
 * type Persons = Person[]
 *
 * // Get the paths of all items in the collection.
 * type Paths = IteratorPath<Persons> // 'age' | 'name' | 'name.first' | 'name.last'
 */
export type IteratorPath<T> = ({} & string) | Path<Values<T>>

/* v8 ignore next */
if (import.meta.vitest) {
  interface Person { age: number; name: { first: string; last: string } }

  test('should get the paths of an array', () => {
    type Result = IteratorPath<Person[]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of an object', () => {
    type Result = IteratorPath<{ a: Person; b: Person }>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of a tuple', () => {
    type Result = IteratorPath<[Person, Person]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of a readonly array', () => {
    type Result = IteratorPath<readonly Person[]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of a readonly tuple', () => {
    type Result = IteratorPath<readonly [Person, Person]>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of a set', () => {
    type Result = IteratorPath<Set<Person>>
    expectTypeOf<Result>().toEqualTypeOf<'age' | 'name' | 'name.first' | 'name.last' | {} & string>()
  })

  test('should get the paths of a map', () => {
    type Result = IteratorPath<Map<string, Person>>
    expectTypeOf<Result>().toEqualTypeOf<`${number}.age` | `${number}.name.first` | `${number}.name.last` | `${number}.name` | `${number}` | {} & string>()
  })
}
