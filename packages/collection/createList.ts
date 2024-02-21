/**
 * A linked list node.
 *
 * @template T The type of the node's value.
 * @example type ListNode = ListNode<number> // { v?: number, n?: ListNode, p?: ListNode }
 */
export interface ListNode<T = unknown> {
  /**
   * The value of the node.
   */
  value?: T
  /**
   * The next node in the list.
   */
  next?: ListNode<T>
  /**
   * The previous node in the list.
   */
  previous?: ListNode<T>
}

/**
 * A linked list implementation of the `Array` interface. This implementation
 * is optimized for adding and removing items at the beginning and end of the
 * list as it (in some cases) minimizes memory allocations and copying of items.
 *
 * It also provides faster iteration than a regular list as it does not need
 * to check for holes in the list. This is because the list is implemented as
 * a linked list of nodes, each of which contains a value and a reference to
 * the next node in the list.
 *
 * Note that this implementation is not optimized for random access. If you need
 * to access items in the middle of the list frequently, you should use the native
 * `Array` implementation instead.
 *
 * @template T The type of the list's items.
 */
export class List<T = unknown> extends Array<T> implements Array<T> {
  constructor(...items: T[])
  constructor(listLength?: number)
  constructor(...args: unknown[]) {
    super()

    // --- If no arguments are given, return an empty list.
    if (args.length === 0) return this

    // --- If the first argument is a number, create a list of the given length.
    // --- Otherwise, create a list from the given arguments.
    const { firstNode, lastNode, length } = typeof args[0] === 'number'
      ? this.createListNodesfromLength<T>(args[0])
      : this.createListNodesfromArray<T>(...args as T[])

    // --- Set the list's properties.
    this.firstNode = firstNode
    this.lastNode = lastNode
    this.length = length
  }

  // --- Re-implement index getter and setter.
  // --- This is required to make the list compatible with the native `Array` type.
  // Example: list[0] = 1
  [Symbol.species]() {
    return List
  }

  /**
   * The first node in the internal linked list.
   *
   * **Warning**: It is recommended to avoid using this property as it breaks
   * compatibility with the native `Array` implementation; Therefore making this
   * implementation  a mandatory dependency. Switching back to a native `Array`
   * implementation will require refactoring your code.
   */
  firstNode?: ListNode<T>

  /**
   * The last node in the internal linked list.
   *
   * **Warning**: It is recommended to avoid using this property as it breaks
   * compatibility with the native `Array` implementation; Therefore making this
   * implementation  a mandatory dependency. Switching back to a native `Array`
   * implementation will require refactoring your code.
   */
  lastNode?: ListNode<T>

  /** The length of the list. */
  // length = 0

  /**
   * Creates a list node with the specified value.
   *
   * @param value The value of the node.
   * @param previous The previous node in the list.
   * @param next The next node in the list.
   * @returns A new list node.
   * @example this.createListNode(1) // { value: 1, next: undefined, prev: undefined }
   */
  private createListNode<T>(value?: T, previous?: ListNode<T>, next?: ListNode<T>): ListNode<T> {
    const newNode = { value, next, previous }
    if (previous) previous.next = newNode
    if (next) next.previous = newNode
    return newNode
  }

  /**
   * Create a list from the given items and chain them together.
   *
   * @param items The items to chain together.
   * @returns An object containing the first node, last node, and length of the list.
   * @example
   * this.createListfromArray(1, 2, 3)
   * // {
   * //   firstNode: { value: 1, next: [Circular], prev: undefined },
   * //   lastNode: { value: 3, next: undefined, prev: [Circular] },
   * //   length: 3
   * // }
   */
  private createListNodesfromArray<T>(...items: T[]): { firstNode?: ListNode<T>; lastNode?: ListNode<T>; length: number } {
    if (items.length === 0) return { firstNode: undefined, lastNode: undefined, length: 0 }
    const firstNode = this.createListNode(items[0])
    let node = firstNode
    for (const item of items.slice(1)) {
      node.next = this.createListNode(item, node)
      node = node.next
    }
    return {
      firstNode,
      lastNode: node,
      length: items.length,
    }
  }

  /**
   * Create a list of the given length and chain the nodes together.
   *
   * @param length The length of the list.
   * @returns An object containing the first node, last node, and length of the list.
   * @example
   * createListfromLength(3)
   * // {
   * //   firstNode: { value: undefined, next: [Circular], prev: undefined },
   * //   lastNode: { value: undefined, next: undefined, prev: [Circular] },
   * //   length: 3
   * // }
   */
  private createListNodesfromLength<T>(length: number): { firstNode?: ListNode<T>; lastNode?: ListNode<T>; length: number } {
    if (length < 0) throw new RangeError('Invalid list length')
    if (length === 0) return { firstNode: undefined, lastNode: undefined, length: 0 }
    const firstNode = this.createListNode<T>()
    let node = firstNode
    for (let i = 0; i < length - 1; i++) {
      node.next = this.createListNode(undefined, node)
      node = node.next
    }
    return {
      firstNode,
      lastNode: node,
      length,
    }
  }

  /**
   * Returns a string representation of a list.
   *
   * @returns The string representation of the list.
   * @example new List('foo', 'bar', 'baz').toString() // 'foo,bar,baz'
   */
  toString(): string {
    return [...this].toString()
  }

  /**
   * Returns a string representation of a list. The elements are converted to
   * string using their toLocaleString methods.
   *
   * @returns The string representation of the list.
   * @example new List('foo', 'bar', 'baz').toLocaleString() // 'foo,bar,baz'
   */
  toLocaleString(): string {
    return [...this].toLocaleString()
  }

  /**
   * Removes the last element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The last element from the list.
   * @example new List('foo', 'bar', 'baz').pop() // 'baz'
   */
  pop(): T | undefined {
    const lastNode = this.lastNode
    if (!lastNode) return undefined

    // --- If the last node has a previous node, remove the last node.
    if (lastNode.previous) {
      lastNode.previous.next = undefined
      this.lastNode = lastNode.previous
    }

    // --- Otherwise, clear the list.
    else {
      this.firstNode = undefined
      this.lastNode = undefined
    }

    // --- Return last node.
    this.length--
    return lastNode?.value
  }

  /**
   * Appends new elements to the end of a list, and returns the new length of the list.
   *
   * @param items New elements to add to the list.
   * @returns The new length of the list.
   * @example new List('foo', 'bar', 'baz').push('qux') // 4
   */
  push(...items: T[]): number {
    for (const item of items) {
      const newNode = this.createListNode(item, this.lastNode)
      this.lastNode = newNode

      // --- If the list is empty, set the first node.
      if (!this.firstNode) this.firstNode = newNode
      this.length++
    }

    // --- Return the new length.
    return this.length
  }

  /**
   * Combines two or more lists. This method returns a new list without modifying any existing lists.
   *
   * @param items Additional items to add to the end of the list.
   * @returns A new list containing the combined items.
   * @example
   * const listOne = new List('foo', 'bar')
   * const listTwo = new List('baz', 'qux')
   * listOne.concat(listTwo) // List { 'foo', 'bar', 'baz', 'qux' }
   */
  // @ts-expect-error: This method overrides the parameter type.
  concat(...items: Array<List | unknown[]>): List<unknown> {
    const newList = new List<unknown>()

    // --- Copy the items from the current list.
    for (const item of this) newList.push(item)

    // --- Copy the items from the given parameters.
    for (const item of items)
      for (const subitem of item) newList.push(subitem)

    // --- Return the new list.
    return newList
  }

  /**
   * Adds all the elements of a list into a string, separated by the specified separator string.
   *
   * @param separator
   * A string used to separate one element of a list from the next in the resulting string.
   * If omitted, the list elements are separated with a comma.
   * @returns A string with all the list elements joined.
   * @example new List('foo', 'bar', 'baz').join() // 'foo,bar,baz'
   */
  join(separator?: string): string {
    return [...this].join(separator)
  }

  /**
   * Reverses the elements in an list in place. This method mutates the list and
   * returns a reference to the same list.
   *
   * @returns The reversed list.
   * @example new List('foo', 'bar', 'baz').reverse() // ['baz', 'bar', 'foo']
   */
  // @ts-expect-error: This function overrides the return type from Array
  reverse(): this {
    let node: ListNode<T> | undefined = this.firstNode
    let next: ListNode<T> | undefined = this.firstNode?.next
    let previous: ListNode<T> | undefined

    // --- Reverse the list.
    while (node) {
      node.next = previous
      node.previous = next
      previous = node
      node = next
      next = node?.next
    }

    // --- Update the list's first and last nodes.
    this.firstNode = previous
    this.lastNode = this.firstNode

    // --- Return the reversed list.
    return this
  }

  /**
   * Removes the first element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The first element of the list.
   * @example new List('foo', 'bar', 'baz').shift() // 'foo'
   */
  shift(): T | undefined {
    const firstNode = this.firstNode
    if (!firstNode) return undefined

    // --- If the first node has a next node, remove the first node.
    if (firstNode.next) {
      firstNode.next.previous = undefined
      this.firstNode = firstNode.next
    }

    // --- Otherwise, clear the list.
    else {
      this.firstNode = undefined
      this.lastNode = undefined
    }

    // --- Return first node.
    this.length--
    return firstNode?.value
  }

  /**
   * Returns a copy of a section of an list. For both start and end, a negative index
   * can be used to indicate an offset from the end of the list. For example, -2 refers
   * to the second to last element of the list.
   *
   * @param start
   * The beginning index of the specified portion of the list. If start is undefined,
   * then the slice begins at index 0.
   * @param end
   * The end index of the specified portion of the list. This is exclusive of the
   * element at the index 'end'. If end is undefined, then the slice extends to the end of the list.
   * @returns A new list containing the extracted elements.
   * @example new List('foo', 'bar', 'baz').slice(1, 2) // ['bar']
   */
  // @ts-expect-error: This function overrides the return type from Array
  slice(start = 0, end = this.length - 1): List<T> {
    const index = 0
    const result = new List<T>()

    // --- Offset negative indexes.
    if (start < 0) start = this.length + start
    if (end < 0) end = this.length + end

    // --- Handle out of bounds indexes.
    if (start > this.length) return result
    if (end > this.length) end = this.length

    // --- Iterate over the list.
    let node = this.firstNode
    while (node) {
      if (index >= start && index <= end) result.push(node.value as T)
      node = node.next
    }

    // --- Return the new list.
    return result
  }

  /**
   * Sorts an list in place. This method mutates the list and returns a reference to the same list.
   *
   * @param compareFunction
   * Function used to determine the order of the elements. It is expected to return a negative value
   * if the first argument is less than the second argument, zero if they're equal, and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
   * @returns The sorted list.
   * @example new List('foo', 'bar', 'baz').sort() // ['bar', 'baz', 'foo']
   */
  sort(compareFunction?: ((a: T, b: T) => number)): this {
    // --- Since we dont have access to the default compare function, and I don't want to
    // --- implement it myself, we'll just convert the list to an array, sort it, and then
    // --- convert it back to a list.
    const sorted = [...this].sort(compareFunction)
    const { firstNode, lastNode } = this.createListNodesfromArray(...sorted)
    this.firstNode = firstNode
    this.lastNode = lastNode
    return this
  }

  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   *
   * @param start The zero-based location in the list from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the list in place of the deleted elements.
   * @returns An list containing the elements that were deleted.
   * @example new List('foo', 'bar', 'baz').splice(1, 1, 'qux') // List { 'bar' }
   */
  // @ts-expect-error: This function overrides the return type from Array
  splice(start: number, deleteCount = 0, ...items: T[]): List<T> {
    const result = new List<T>()
    const deleteEnd = start + deleteCount
    const newList = this.createListNodesfromArray(...items)

    // --- Handle out of bounds indexes.
    if (start < 0) { start = this.length + start }
    else if (start > this.length) {
      start = this.length
      deleteCount = 0
    }

    // --- Iterate over the list to find the nodes to insert between.
    let index = 0
    let node = this.firstNode
    let startLastNode: ListNode<T> | undefined
    let endFirstNode: ListNode<T> | undefined

    // --- Find the nodes to delete.
    while (node) {
      if (index === start) startLastNode = node.previous
      if (index === deleteEnd) { endFirstNode = node; break }
      index++
      node = node.next
    }

    // --- Extract the deleted items.
    if (startLastNode) result.firstNode = startLastNode.next
    if (endFirstNode) result.lastNode = endFirstNode.previous

    // --- Insert new items into the list.
    if (startLastNode) startLastNode.next = newList.firstNode
    if (endFirstNode) endFirstNode.previous = newList.lastNode

    // --- Return the deleted items.
    return result
  }

  /**
   * Inserts new elements at the start of a list, and returns the new length of the list.
   *
   * @param items  Elements to insert at the start of the list.
   * @returns The new length of the list.
   * @example list.unshift(1, 2, 3) // 3
   */
  unshift(...items: T[]): number {
    for (const item of items) {
      const newNode = this.createListNode(item, undefined, this.firstNode)
      this.firstNode = newNode

      // --- If the list is empty, set the last node.
      if (!this.lastNode) this.lastNode = newNode
      this.length++
    }

    // --- Return the new length.
    return this.length
  }

  /**
   * Returns the index of the first occurrence of a value in an list, or -1 if it is not present.
   *
   * @param searchElement The value to locate in the list.
   * @param fromIndex The list index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
   * @returns The index of the first occurrence of a value in an list, or -1 if it is not present.
   * @example new List('foo', 'bar', 'baz').indexOf('bar') // 1
   */
  indexOf(searchElement: T, fromIndex = 0): number {
    let index = 0
    let node = this.firstNode
    while (node) {
      if (fromIndex <= index && node.value === searchElement) return index
      node = node.next
      index++
    }
    return -1
  }

  /**
   * Returns the index of the last occurrence of a specified value in an list, or -1 if it is not present.
   *
   * @param searchElement The value to locate in the list.
   * @param fromIndex The list index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the list.
   * @returns The index of the last occurrence of a specified value in an list, or -1 if it is not present.
   * @example new List('foo', 'bar', 'baz', 'bar').lastIndexOf('bar') // 3
   */
  lastIndexOf(searchElement: T, fromIndex = 0): number {
    let index = 0
    let node = this.lastNode
    let result = -1
    while (node) {
      if (fromIndex <= index && node.value === searchElement) result = index
      node = node.previous
      index++
    }
    return result
  }

  /**
   * Determines whether all the members of an array satisfy the specified test.
   *
   * @param predicate
   * A function that accepts up to three arguments. The every method calls the
   * predicate function for each element in the list until the predicate returns
   * a value which is coercible to the Boolean value false, or until the end of
   * the list.
   * @returns `true` if the predicate is true for all elements in the list. Otherwise, `false`.
   * @example new List(1, 2, 3).every(x => x > 0) // true
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  every<S extends T>(predicate: (value: T, index: number, list: List<T>) => value is S): this is S[]
  // @ts-expect-error: This function overrides the parameter type from Array
  every(predicate: (value: T, index: number, list: List<T>) => boolean): boolean
  // @ts-expect-error: This function overrides the parameter type from Array
  every(predicate: (value: T, index: number, list: List<T>) => boolean): boolean {
    let node = this.firstNode
    let index = 0
    while (node) {
      const result = predicate(node.value!, index, this)
      if (!result) return false
      node = node.next
      index++
    }
    return true
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
  // @ts-expect-error: This function overrides the parameter type from Array
  some(predicate: (value: T, index: number, list: List<T>) => boolean): boolean {
    let node = this.firstNode
    let index = 0
    while (node) {
      const result = predicate(node.value!, index, this)
      if (result) return true
      node = node.next
      index++
    }
    return false
  }

  /**
   * Performs the specified action for each element in an array.
   *
   * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArgument An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value
   * @example new List(1, 2, 3).forEach(x => console.log(x)) // 1 2 3
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  forEach(callbackfn: (value: T, index: number, list: List<T>) => void, thisArgument?: any): void {
    let node = this.firstNode
    let index = 0
    while (node) {
      callbackfn.apply(thisArgument, [node.value!, index, this])
      node = node.next
      index++
    }
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   *
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArgument An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value
   * @returns A new list with each element being the result of the callback function.
   * @example new List(1, 2, 3).map(x => x * 2) // List { 2, 4, 6 }
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  map<U>(callbackfn: (value: T, index: number, list: List<T>) => U, thisArgument?: any): List<U> {
    const result = new List<U>()
    let node = this.firstNode
    let index = 0
    while (node) {
      const value = callbackfn.apply(thisArgument, [node.value!, index, this])
      result.push(value)
      node = node.next
      index++
    }
    return result
  }

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   *
   * @param predicate
   * A function that accepts up to three arguments. The filter method calls the
   * predicate function one time for each element in the list.
   * @param thisArgument
   * An object to which the this keyword can refer in the predicate function. If
   * thisArg is omitted, undefined is used as the this value.
   * @returns A new list with the elements that pass the test. If no elements pass the test, an empty list will be returned.
   * @example new List(1, 2, 3).filter(x => x > 1) // List { 2, 3 }
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  filter<S extends T>(predicate: (value: T, index: number, list: List<T>) => value is S, thisArgument?: any): List<S>
  // @ts-expect-error: This function overrides the parameter type from Array
  filter(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: any): List<T>
  // @ts-expect-error: This function overrides the parameter type from Array
  filter(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: unknown): List<T> {
    let node = this.firstNode
    let index = 0
    const result = new List<T>()
    while (node) {
      const value = node.value!
      const passes = predicate.apply(thisArgument, [value, index, this])
      if (passes) result.push(value)
      node = node.next
      index++
    }
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the
   * callback function is the accumulated result, and is provided as an argument in the next call to
   * the callback function.
   *
   * @param callbackfn
   * A function that accepts up to four arguments. The reduce method calls the
   * callbackfn function one time for each element in the list.
   * @param initialValue
   * If initialValue is specified, it is used as the initial value to start the
   * accumulation. The first call to the callbackfn function provides this value
   * as an argument instead of an element value.
   * @returns The value that results from the reduction.
   * @example new List(1, 2, 3).reduce((a, b) => a + b) // 6
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T): T
  // @ts-expect-error: This function overrides the parameter type from Array
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue: T): T
  // @ts-expect-error: This function overrides the parameter type from Array
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, list: List<T>) => U, initialValue: U): U
  // @ts-expect-error: This function overrides the parameter type from Array
  reduce(callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, list: List<T>) => unknown, initialValue?: unknown): unknown {
    let node = this.firstNode
    let index = 0

    // --- If no initial value is provided, use the first value in the list.
    if (initialValue === undefined) {
      initialValue = node!.value
      node = node?.next
      index++
    }

    // --- Iterate through the list, updating the initial value.
    while (node) {
      initialValue = callbackfn(initialValue, node.value!, index, this)
      node = node.next
      index++
    }

    // --- Return the final value.
    return initialValue
  }

  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The
   * return value of the callback function is the accumulated result, and is provided as an argument
   * in the next call to the callback function.
   *
   * @param callbackfn
   * A function that accepts up to four arguments. The reduceRight method calls
   * the callbackfn function one time for each element in the list.
   * @param initialValue
   * If initialValue is specified, it is used as the initial value to start the
   * accumulation. The first call to the callbackfn function provides this value
   * as an argument instead of an element value.
   * @returns The value that results from the reduction.
   * @example new List(1, 2, 3).reduceRight((a, b) => a - b) // 0
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T): T
  // @ts-expect-error: This function overrides the parameter type from Array
  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, list: List<T>) => T, initialValue: T): T
  // @ts-expect-error: This function overrides the parameter type from Array
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, list: List<T>) => U, initialValue: U): U
  // @ts-expect-error: This function overrides the parameter type from Array
  reduceRight(callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, list: List<T>) => U, initialValue?: unknown): unknown {
    let node = this.lastNode
    let index = this.length - 1

    // --- If no initial value is provided, use the last value in the list.
    if (initialValue === undefined) {
      initialValue = node!.value
      node = node?.previous
      index--
    }

    // --- Iterate through the list, updating the initial value.
    while (node) {
      initialValue = callbackfn(initialValue, node.value!, index, this)
      node = node.previous
      index--
    }

    // --- Return the final value.
    return initialValue
  }

  /**
   * Returns the value of the first element in the array where predicate is true, and undefined otherwise.
   *
   * @param predicate
   * find calls predicate once for each element of the array, in ascending order, until it finds
   * one where predicate returns true. If such an element is found, find immediately returns that
   * element value. Otherwise, find returns undefined.
   * @param thisArgument
   * An object to which the this keyword can refer in the predicate function. If thisArg is omitted,
   * undefined is used as the this value.
   * @returns The value of the first element in the array where predicate is true, and undefined otherwise.
   * @example new List(1, 2, 3).find(x => x > 1) // 2
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  find<S extends T>(predicate: (this: void, value: T, index: number, list: List<T>) => value is S, thisArgument?: any): S | undefined
  // @ts-expect-error: This function overrides the parameter type from Array
  find(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: any): T | undefined
  // @ts-expect-error: This function overrides the parameter type from Array
  find(predicate: (value: unknown, index: number, list: List<T>) => unknown, thisArgument?: unknown): unknown {
    let node = this.firstNode
    let index = 0
    while (node) {
      const value = node.value!
      const passes = predicate.apply(thisArgument, [value, index, this])
      if (passes) return value
      node = node.next
      index++
    }
  }

  /**
   * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
   *
   * @param predicate
   * find calls predicate once for each element of the array, in ascending order, until it finds
   * one where predicate returns true. If such an element is found, findIndex immediately returns
   * that element index. Otherwise, findIndex returns -1.
   * @param thisArgument
   * If provided, it will be used as the this value for each invocation of predicate. If it is not
   * provided, undefined is used instead.
   * @returns The index of the first element in the array where predicate is true, and -1 otherwise.
   * @example new List(1, 2, 3).findIndex(x => x === 2) // 1
   */
  // @ts-expect-error: This function overrides the parameter type from Array
  findIndex(predicate: (value: T, index: number, object: List<T>) => unknown, thisArgument?: any): number {
    let node = this.firstNode
    let index = 0
    while (node) {
      const result = predicate.apply(thisArgument, [node.value!, index, this])
      if (result) return index
      node = node.next
      index++
    }
    return -1
  }

  /**
   * Changes all array elements from start to end index to a static value and returns the modified array
   *
   * @param value Value to fill array section with
   * @param start
   * Index to start filling the array at. If start is negative, it is treated as length+start where length
   * is the length of the array.
   * @param end
   * Index to stop filling the array at. If end is negative, it is treated as length+end.
   * @returns The modified array
   * @example new List(1, 2, 3).fill(0) // List { 0, 0, 0 }
   */
  fill(value: T, start = 0, end = this.length - 1): this {
    let node = this.firstNode
    let index = 0
    if (start < 0) start = this.length + start
    if (end < 0) end = this.length + end
    while (node) {
      if (index >= start && index <= end) node.value = value
      node = node.next
      index++
    }
    return this
  }

  /**
   * Returns the this object after copying a section of the array identified by start and end to the same
   * array starting at position target
   *
   * @param target
   * If target is negative, it is treated as length+target where length is the length of the array.
   * @param start
   * If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. If start is omitted, 0 is used.
   * @param end If not specified, length of the this object is used as its default value.
   * @returns The modified array
   * @example new List(1, 2, 3, 4, 5).copyWithin(0, 3) // List { 4, 5, 3, 4, 5 }
   */
  copyWithin(target: number, start: number, end: number = this.length - 1): this {
    let node = this.firstNode
    let index = 0

    // --- Handle out of bounds values
    if (target < 0) target = this.length + target
    if (start < 0) start = this.length + start
    if (end === undefined) end = this.length
    if (end < 0) end = this.length + end

    // --- Get start and end nodes to copy in between
    const copyItems = []
    while (node) {
      if (index >= start && index <= end) copyItems.push(node.value!)
      node = node.next
      index++
    }

    // --- Copy the nodes into the target
    this.splice(target, 0, ...copyItems)
    return this
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the list
   *
   * @yields The key, value pairs in the list as an tuple.
   */
  *entries(): IterableIterator<[number, T]> {
    let node = this.firstNode
    let index = 0
    while (node) {
      yield [index++, node.value as T]
      node = node.next
    }
  }

  /**
   * Returns an iterable of keys in the list.
   *
   * @yields The keys in the list.
   */
  *keys(): IterableIterator<number> {
    let node = this.firstNode
    let index = 0
    while (node) {
      yield index++
      node = node.next
    }
  }

  /**
   * Returns an iterable of values in the list.
   *
   * @yields The values in the list.
   */
  *values(): IterableIterator<T> {
    let node = this.firstNode
    while (node) {
      yield node.value as T
      node = node.next
    }
  }

  /**
   * Determines whether an list includes a certain element, returning true or false as appropriate.
   *
   * @param searchElement The element to search for.
   * @param fromIndex The position in this list at which to begin searching for searchElement.
   * @returns `true` if the searchElement is found, otherwise `false`.
   * @example new List('foo', 'bar', 'baz').includes('bar') // true
   */
  includes(searchElement: T, fromIndex = 0): boolean {
    let node = this.firstNode
    let index = 0
    while (node) {
      if (fromIndex <= index && node.value === searchElement)
        return true
      node = node.next
      index++
    }
    return false
  }

  /**
   * Calls a defined callback function on each element of an array. Then, flattens the result into a new array. This is identical to a map followed by flat with depth 1.
   *
   * @param callback
   * A function that accepts up to three arguments. The flatMap method calls the callback function one time for each element in the array.
   * @param thisArgument
   * An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value.
   * @returns A new array with each element being the result of the callback function and flattened to a depth of 1.
   * @example new List(1, 2, 3).flatMap(x => [x, x * 2]) // List { 1, 2, 2, 4, 3, 6 }
   */
  // @ts-expect-error: Overload signatures
  flatMap<U, This = undefined>(callback: (this: This, value: T, index: number, list: List<T>) => List<U> | U | readonly U[], thisArgument?: This | undefined): List<U> {
    // eslint-disable-next-line unicorn/prefer-array-flat-map, unicorn/no-array-method-this-argument
    return this.map(callback, thisArgument).flat() as List<U>
  }

  /**
   * Returns a new array with all sub-array elements concatenated into it recursively up to the specified depth.
   *
   * @param depth The maximum recursion depth.
   * @returns A new array with the sub-array elements concatenated into it.
   * @example new List([1, 2, [3, 4]]).flat() // List { 1, 2, 3, 4 }
   */
  // @ts-expect-error: Overload signatures
  flat<D extends number = 1>(depth: D = 1 as D): List<unknown> {
    const flatList = new List()
    let node = this.firstNode
    while (node) {
      const value = node.value

      // --- If the value is an array, flatten it.
      if (Array.isArray(value) || value instanceof List) {
        // @ts-expect-error: The `flat` method exists on both arrays and lists.
        const flatValue = depth === 1 ? value : value.flat(depth - 1)
        for (const item of flatValue) flatList.push(item)
      }

      // --- Otherwise, just add the value to the list.
      else { flatList.push(value as any) }
      node = node.next
    }

    // --- Return the flattened list.
    return flatList
  }

  /**
   * Gets the value at the specified index.
   *
   * @param atIndex The zero-based index of the value to get.
   * @returns The value at the specified index or undefined if the index is out of range.
   * @example new List(1, 2, 3]).at(1) // 2
   */
  at(atIndex: number): T | undefined {
    let node = this.firstNode
    let index = 0
    while (node) {
      if (index === atIndex)
        return node.value as T
      node = node.next
      index++
    }
    return undefined
  }

  /**
   * A method that returns the default iterator for an object. Called by the semantics of the for-of statement.
   *
   * @yields The next value in the list.
   * @example for (const item of list) console.log(item)
   */
  // eslint-disable-next-line sonarjs/no-identical-functions
  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.firstNode
    while (node) {
      yield node.value as T
      node = node.next
    }
  }

  // [Symbol.unscopables](): { copyWithin: boolean; entries: boolean; fill: boolean; find: boolean; findIndex: boolean; keys: boolean; values: boolean } {
  //   throw new Error('Method not implemented.')
  // }
  with(index: number, value: T): T[] {
    throw new Error('Method not implemented.')
  }

  findLast<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArgument?: any): S | undefined
  findLast(predicate: (value: T, index: number, array: T[]) => unknown, thisArgument?: any): T | undefined
  findLast(predicate: unknown, thisArgument?: unknown): S | T | undefined {
    throw new Error('Method not implemented.')
  }

  findLastIndex(predicate: (value: T, index: number, array: T[]) => unknown, thisArgument?: any): number {
    throw new Error('Method not implemented.')
  }

  toReversed(): T[] {
    throw new Error('Method not implemented.')
  }

  toSorted(compareFunction?: ((a: T, b: T) => number) | undefined): T[] {
    throw new Error('Method not implemented.')
  }

  toSpliced(start: number, deleteCount: number, ...items: T[]): T[]
  toSpliced(start: number, deleteCount?: number | undefined): T[]
  toSpliced(start: unknown, deleteCount?: unknown, ...items?: unknown[]): T[] {
    throw new Error('Method not implemented.')
  }
}

/**
 * Creates a new list with a given length.
 *
 * @param length The length of the list.
 * @returns A new list containing the given values.
 * @example createList(3) // List { undefined, undefined, undefined }
 */
export function createList<T>(length: number): List<T>
/**
 * Creates a new list from the given values.
 *
 * @param values The values to create the list from.
 * @returns A new list containing the given values.
 * @example createList('foo', 'bar', 'baz') // List { 'foo', 'bar', 'baz' }
 */
export function createList<T>(values: T[]): List<T>
export function createList(valuesOrLength: unknown[] | number): List<unknown> {
  return Array.isArray(valuesOrLength)
    ? new List(...valuesOrLength)
    : new List(valuesOrLength)
}

/** c8 ignore next */
if (import.meta.vitest) {

  describe('constructor', () => {
    it('should create an empty list', () => {
      const result = new List()
      expect(result.length).toBe(0)
      expect(result.firstNode).toEqual(undefined)
      expect(result.lastNode).toEqual(undefined)
    })

    it('should create list with given elements with first node', () => {
      const result = new List('foo', 'bar', 'baz')
      expect(result.length).toBe(3)
      expect(result.firstNode).toStrictEqual({
        value: 'foo',
        next: result.firstNode?.next,
        previous: undefined,
      })
      expect(result.firstNode?.next).toStrictEqual({
        value: 'bar',
        next: result.firstNode?.next?.next,
        previous: result.firstNode,
      })
      expect(result.firstNode?.next?.next).toStrictEqual({
        value: 'baz',
        next: undefined,
        previous: result.firstNode?.next,
      })
      expect(result.lastNode).toBe(result.firstNode?.next?.next)
    })

    it('should create list with given length', () => {
      const result = new List(3)
      expect(result.length).toBe(3)
      expect(result.firstNode).toEqual({
        value: undefined,
        next: result.firstNode?.next,
        previous: undefined,
      })
      expect(result.firstNode?.next).toEqual({
        value: undefined,
        next: result.firstNode?.next?.next,
        previous: result.firstNode,
      })
      expect(result.firstNode?.next?.next).toEqual({
        value: undefined,
        next: undefined,
        previous: result.firstNode?.next,
      })
      expect(result.lastNode).toBe(result.firstNode?.next?.next)
    })
  })

  describe('at', () => {
    it('should get the value at the specified index', () => {
      const result = new List('foo', 'bar', 'baz')
      const node0 = result.at(0)
      const node1 = result.at(1)
      const node2 = result.at(2)
      expect(node0).toEqual('foo')
      expect(node1).toEqual('bar')
      expect(node2).toEqual('baz')
    })

    it('should return undefined if the index is out of range', () => {
      const result = new List('foo', 'bar', 'baz').at(3)
      expect(result).toBe(undefined)
    })

    it('should return undefined if the list is empty', () => {
      const result = new List().at(0)
      expect(result).toBe(undefined)
    })
  })
}
