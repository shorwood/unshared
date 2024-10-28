/* eslint-disable sonarjs/no-useless-intersection */
import type { Path } from './Path'
import type { Values } from './Values'

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
