import { List as IList, createList } from './createList'
import { listAt } from './listAt'
import { listEvery } from './listEvery'
import { listPop } from './listPop'
import { listPush } from './listPush'
import { listReverse } from './listReverse'
import { listShift } from './listShift'
import { listSome } from './listSome'
import { listUnshift } from './listUnshift'

export class List<T> {
  constructor(length: number) {
    this.internalList = createList(length)
  }

  /**
   * The internal list implementation.
   */
  private internalList: IList<T>

  /**
   * Gets the length of the list. This is a number one higher than the highest index in the list.
   *
   * @returns The number of elements in the list.
   * @example
   * const list = new List(3)
   * list.length // 3
   */
  get length(): number {
    return this.internalList.length
  }

  /**
   * Returns a string representation of a list.
   *
   * @returns The string representation of the list.
   * @example
   * const list = List.from(['foo', 'bar', 'baz'])
   * list.toString() // 'foo,bar,baz'
   */
  toString(): string {
    return [...this].toString()
  }

  /**
   * Returns a string representation of a list. The elements are converted to
   * string using their toLocaleString methods.
   *
   * @returns The string representation of the list.
   * @example
   * const list = List.from(['foo', 'bar', 'baz'])
   * list.toLocaleString() // 'foo,bar,baz'
   */
  toLocaleString(): string {
    return [...this].toLocaleString()
  }

  /**
   * Removes the last element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The last element from the list.
   * @example
   * const list = List.from(['foo', 'bar', 'baz'])
   * list.pop() // 'baz'
   * list // ['foo', 'bar']
   */
  pop(): T | undefined {
    return listPop(this.internalList)?.value
  }

  /**
   * Appends new elements to the end of a list, and returns the new length of the list.
   *
   * @param items New elements to add to the list.
   * @returns The new length of the list.
   * @example
   * const list = List.from(['foo', 'bar'])
   * list.push('baz') // 3
   * list // ['foo', 'bar', 'baz']
   */
  push(...items: T[]): number {
    for (const item of items)
      listPush(this.internalList, item)
    return this.internalList.length
  }

  /**
   * Combines two or more lists. This method returns a new list without modifying any existing lists.
   *
   * @param items Additional items to add to the end of the list.
   */
  concat(...items: ConcatArray<T>[]): T[]
  concat(...items: (T | ConcatArray<T>)[]): T[]
  concat(...items?: unknown[]): T[] {}

  /**
   * Adds all the elements of a list into a string, separated by the specified separator string.
   *
   * @param separator
   * A string used to separate one element of a list from the next in the resulting string.
   * If omitted, the list elements are separated with a comma.
   * @returns A string with all the list elements joined.
   * @example
   * const list = List.from(['foo', 'bar', 'baz'])
   * list.join() // 'foo,bar,baz'
   */
  join(separator?: string | undefined): string {
    return [...this].join(separator)
  }

  /**
   * Reverses the elements in an list in place. This method mutates the list and
   * returns a reference to the same list.
   *
   * @returns The reversed list.
   * @example list.reverse().toArray() // ['bar', 'foo', 'foobar']
   */
  reverse(): this {
    listReverse(this.internalList)
    return this
  }

  /**
   * Removes the first element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The first element of the list.
   * @example list.shift() // 'foobar'
   */
  shift(): T | undefined {
    return listShift(this.internalList)?.value
  }

  slice(start?: number | undefined, end?: number | undefined): T[] {
    throw new Error('Method not implemented.')
  }

  sort(compareFunction?: ((a: T, b: T) => number) | undefined): this {
    throw new Error('Method not implemented.')
  }

  splice(start: number, deleteCount?: number | undefined): T[]
  splice(start: number, deleteCount: number, ...items: T[]): T[]
  splice(start: unknown, deleteCount?: unknown, ...rest?: unknown[]): T[] {
    throw new Error('Method not implemented.')
  }

  /**
   * Inserts new elements at the start of a list, and returns the new length of the list.
   *
   * @param items  Elements to insert at the start of the list.
   * @returns The new length of the list.
   * @example list.unshift(1, 2, 3) // 3
   */
  unshift(...items: T[]): number {
    for (const item of items)
      listUnshift(this.internalList, item)
    return this.internalList.length
  }

  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error('Method not implemented.')
  }

  lastIndexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error('Method not implemented.')
  }

  every<S extends T>(predicate: (value: T, index: number, list: IList<T>) => value is S): this is S[]
  every(predicate: (value: T, index: number, list: IList<T>) => boolean): boolean
  every(predicate: (value: T, index: number, list: IList<T>) => boolean): boolean {
    return listEvery(this.internalList, predicate)
  }

  /**
   * Determines whether the specified callback function returns true for any
   * element of a list.
   *
   * @param predicate
   * A function that accepts up to three arguments. The some method calls the
   * predicate function for each element in the list until the predicate returns
   * a value which is coercible to the Boolean value true, or until the end of
   * the list.
   * @returns true if the predicate is true for at least one element in the list; otherwise, false.
   * @example list.some(Boolean) // true
   */
  some(predicate: (value: T, index: number, list: IList<T>) => boolean): boolean {
    return listSome(this.internalList, predicate)
  }

  forEach(callbackfn: (value: T, index: number, list: T[]) => void, thisArgument?: any): void {
    throw new Error('Method not implemented.')
  }

  map<U>(callbackfn: (value: T, index: number, list: T[]) => U, thisArgument?: any): U[] {
    throw new Error('Method not implemented.')
  }

  filter<S extends T>(predicate: (value: T, index: number, list: T[]) => value is S, thisArgument?: any): S[]
  filter(predicate: (value: T, index: number, list: T[]) => unknown, thisArgument?: any): T[]
  filter(predicate: unknown, thisArgument?: unknown): T[] | S[] {
    throw new Error('Method not implemented.')
  }

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: T[]) => T): T
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: T[]) => T, initialValue: T): T
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, list: T[]) => U, initialValue: U): U
  reduce(callbackfn: unknown, initialValue?: unknown): T | U {
    throw new Error('Method not implemented.')
  }

  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: T[]) => T): T
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: T[]) => T, initialValue: T): T
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, list: T[]) => U, initialValue: U): U
  reduceRight(callbackfn: unknown, initialValue?: unknown): T | U {
    throw new Error('Method not implemented.')
  }

  find<S extends T>(predicate: (this: void, value: T, index: number, object: T[]) => value is S, thisArgument?: any): S | undefined
  find(predicate: (value: T, index: number, object: T[]) => unknown, thisArgument?: any): T | undefined
  find(predicate: unknown, thisArgument?: unknown): T | S | undefined {
    throw new Error('Method not implemented.')
  }

  findIndex(predicate: (value: T, index: number, object: T[]) => unknown, thisArgument?: any): number {
    throw new Error('Method not implemented.')
  }

  fill(value: T, start?: number | undefined, end?: number | undefined): this {
    throw new Error('Method not implemented.')
  }

  copyWithin(target: number, start: number, end?: number | undefined): this {
    throw new Error('Method not implemented.')
  }

  *entries(): IterableIterator<[number, T]> {
    let node = this.internalList.first
    let index = 0
    while (node) {
      yield [index++, node.value as T]
      node = node.next
    }
  }

  *keys(): IterableIterator<number> {
    let node = this.internalList.first
    let index = 0
    while (node) {
      yield index++
      node = node.next
    }
  }

  *values(): IterableIterator<T> {
    let node = this.internalList.first
    while (node) {
      yield node.value as T
      node = node.next
    }
  }

  includes(searchElement: T, fromIndex?: number | undefined): boolean {
    throw new Error('Method not implemented.')
  }

  flatMap<U, This = undefined>(callback: (this: This, value: T, index: number, list: T[]) => U | readonly U[], thisArgument?: This | undefined): U[] {
    throw new Error('Method not implemented.')
  }

  flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[] {
    throw new Error('Method not implemented.')
  }

  /**
   * Gets the value at the specified index.
   *
   * @param index The zero-based index of the value to get.
   * @returns The value at the specified index or undefined if the index is out of range.
   * @example list.at(0) // 'foobar'
   */
  at(index: number): T | undefined {
    return listAt(this.internalList, index)?.value
  }

  /**
   * A method that returns the default iterator for an object. Called by the semantics of the for-of statement.
   *
   * @yields The next value in the list.
   * @example for (const item of list) console.log(item)
   */
  // eslint-disable-next-line sonarjs/no-identical-functions
  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.internalList.first
    while (node) {
      yield node.value as T
      node = node.next
    }
  }

  [Symbol.unscopables](): { copyWithin: boolean; entries: boolean; fill: boolean; find: boolean; findIndex: boolean; keys: boolean; values: boolean } {
    throw new Error('Method not implemented.')
  }
}
