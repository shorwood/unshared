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

  /**
   * The first node in the internal linked list.
   *
   * **Warning**: It is recommended to avoid using this property as it breaks
   * compatibility with the native `Array` implementation; Therefore making this
   * implementation  a mandatory dependency. Switching back to a native `Array`
   * implementation will require refactoring your code.
   */
  private head?: ListNode<T>

  /**
   * The last node in the internal linked list.
   *
   * **Warning**: It is recommended to avoid using this property as it breaks
   * compatibility with the native `Array` implementation; Therefore making this
   * implementation  a mandatory dependency. Switching back to a native `Array`
   * implementation will require refactoring your code.
   */
  private tail?: ListNode<T>

  /** The length of the list. */
  // length = 0

  /**
   * The middle node in the internal linked list. This is used
   * internally to optimize some operations. It is not recommended
   * to use this property directly as it may change during the
   * lifetime of the list.
   *
   * @returns The middle node in the list.
   */
  private get middle(): ListNode<T> | undefined {
    let slow = this.head
    let fast = this.head
    while (fast?.next) {
      slow = slow?.next
      fast = fast.next.next
    }
    return slow
  }

  constructor(...items: T[])
  constructor(listLength?: number)
  constructor(...args: unknown[]) {
    super()
    let list: List<T> | undefined

    // --- If the first argument is a number, create a list of the given length.
    // --- Otherwise, create a list from the given arguments.
    if (args.length > 0) {
      list = typeof args[0] === 'number'
        ? List.from<T>({ length: args[0] })
        : List.of<T>(...args as T[])
    }

    // --- Proxify the list to ensure that we can access the items using the
    // --- native index syntax. This is necessary because the list is implemented
    // --- as a linked list and does not have the same properties as a regular array.
    return new Proxy(list ?? this, {
      get(target, property, receiver) {
        const isIndex = typeof property === 'string' && /^\d+$/.test(property)
        if (!isIndex) return Reflect.get(target, property, receiver) as unknown
        const index = Number.parseInt(property, 10)
        return target.at(index)
      },
      set(target, property, value, receiver) {
        const isIndex = typeof property === 'string' && /^\d+$/.test(property)
        if (!isIndex) return Reflect.set(target, property, value, receiver)
        const index = Number.parseInt(property, 10)
        const from = target.nodeAt(index)
        target.nodeSplice(from, 1, value as T)
        return true
      },
    })
  }

  /**
   * Returns a new array from a set of elements.
   *
   * @param items A set of elements to include in the new array object.
   * @returns A new list containing the elements of the given items.
   * @example List.of(1, 2, 3) // List { 1, 2, 3 }
   */
  static of<T>(...items: T[]): List<T> {
    return List.from(items)
  }

  /**
   * Creates an array from an iterable object.
   *
   * @param arrayLike An array-like object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArgument An object to which the this keyword can refer in the mapfn function.
   * @returns A new list containing the elements of the array-like object.
   * @example
   *
   * // --- Create a list from an array-like object.
   * List.from({ length: 3 }) // List { undefined, undefined, undefined }
   *
   * // --- Create a list from an array-like object with a mapping function.
   * List.from({ length: 3 }, (_, i) => i) // List { 0, 1, 2 }
   */
  static from<T>(arrayLike: ArrayLike<T> | Generator<T> | Iterable<T>): List<T>
  static from<T, U, V = any>(arrayLike: ArrayLike<T> | Generator<T> | Iterable<T>, mapfn: (this: V, value: T, index: number) => U, thisArgument?: V): List<U>
  static from<T, U, V = any>(arrayLike: ArrayLike<T> | Generator<T> | Iterable<T>, mapfn?: (this: V, value: T, index: number) => U, thisArgument?: V): List<T | U>
  static from<T, U, V = any>(arrayLike: ArrayLike<T> | Generator<T> | Iterable<T>, mapfn?: (this: V, value: T, index: number) => U, thisArgument?: V): List<T | U> {
    const list = new List<T | U>()
    let previous: ListNode<T | U> | undefined

    // --- Handle iterable objects.
    if (typeof arrayLike === 'object' && arrayLike !== null && Symbol.iterator in arrayLike) {
      let index = 0
      for (const value of arrayLike) {
        const mappedValue: T | U = mapfn ? mapfn.call(thisArgument as V, value, index++) : value
        const node: ListNode<T | U> = { value: mappedValue, previous }
        if (previous) previous.next = node
        list.head ??= node
        previous = node
        list.length++
      }
      list.tail = previous
    }

    // --- Handle length based on the array-like object.
    else if (typeof arrayLike?.length === 'number') {
    // eslint-disable-next-line unicorn/no-for-loop
      for (let index = 0; index < arrayLike.length; index++) {
        const value: T | U = mapfn ? mapfn.call(thisArgument as V, arrayLike[index], index) : arrayLike[index]
        const node: ListNode<T | U> = { value, previous }
        if (previous) previous.next = node
        list.head ??= node
        previous = node
        list.length++
      }
      list.tail = previous
    }

    return list
  }

  /**
   * Get the node at the specified index.
   *
   * @param index The zero-based index of the node to get.
   * @returns The node at the specified index or undefined if the index is out of range.
   * @example new List(1, 2, 3).nodeAt(1) // ListNode { value: 2, next: ListNode, previous: ListNode }
   */
  nodeAt(index: number): ListNode<T> | undefined {
    if (index === 0) {
      return this.head
    }
    else if (index === -1) {
      return this.tail
    }
    else if (index < 0) {
      let node = this.tail
      let i = -1
      while (node) {
        if (i-- === index) return node
        node = node.previous
      }
    }
    else {
      let node = this.head
      let i = 0
      while (node) {
        if (i++ === index) return node
        node = node.next
      }
    }
  }

  /**
   * Create a chain of list nodes from an array of values.
   *
   * @param from The previous node in the chain.
   * @param deleteCount The number of nodes to delete.
   * @param items The values to create the list nodes from.
   * @returns The first and last nodes in the chain.
   */
  nodeSplice(from: ListNode<T> | undefined, deleteCount = 0, ...items: T[]): List<T> {
    const list = new List<T>()
    if (items.length === 0 && deleteCount === 0) return list
    let head: ListNode<T> | undefined
    let next = from ? from.next : this.head

    // --- If `deleteCount` is defined, we need to remove the nodes
    // --- starting from the `start` node and store them in a new
    // --- list. Additionally, we need to update the `head` and `tail`
    // --- nodes if necessary.
    if (deleteCount > 0 && this.head) {
      list.head = from ?? this.head
      list.tail = list.nodeAt(deleteCount - 1) ?? this.tail

      // --- Unlink the nodes from the list to extract.
      if (list.head) {
        from = list.head.previous
        list.head.previous = undefined
      }
      if (list.tail) {
        next = list.tail.next
        list.tail.next = undefined
      }

      // --- Relink the nodes of the `this` list.
      if (from) from.next = next
      if (next) next.previous = from
      if (this.head === list.head) this.head = next
      if (this.tail === list.tail) this.tail = from

      // --- Recalculate the length of the lists.
      list.length = 0
      let node: ListNode<T> | undefined = list.head
      while (node) { list.length++; node = node.next }
      this.length -= list.length
    }

    // --- Create a node for each value.
    let tail = from
    for (const value of items) {
      tail = { value, previous: tail, next }
      head ??= tail
      if (tail.previous) tail.previous.next = tail
    }

    // --- Update the previous and next nodes.
    if (next) next.previous = tail
    if (head && from === undefined) this.head = head
    if (this.tail === undefined || from === this.tail) this.tail = tail

    // --- Return the first and last nodes.
    this.length += items.length
    return list
  }

  /**
   * Appends new elements to the end of a list, and returns the new length of the list.
   *
   * @param items New elements to add to the list.
   * @returns The new length of the list.
   * @example new List('foo', 'bar', 'baz').push('qux') // 4
   */
  push(...items: T[]): number {
    this.nodeSplice(this.tail, 0, ...items)
    return this.length
  }

  /**
   * Inserts new elements at the start of a list, and returns the new length of the list.
   *
   * @param items  Elements to insert at the start of the list.
   * @returns The new length of the list.
   * @example list.unshift(1, 2, 3) // 3
   */
  unshift(...items: T[]): number {
    this.nodeSplice(undefined, 0, ...items)
    return this.length
  }

  /**
   * Removes the last element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The last element from the list.
   * @example new List('foo', 'bar', 'baz').pop() // 'baz'
   */
  pop(): T | undefined {
    if (!this.tail) return undefined
    const value = this.tail.value
    this.tail = this.tail.previous
    if (this.tail) this.tail.next = undefined
    else this.head = undefined
    this.length--
    return value
  }

  /**
   * Removes the first element from a list and returns it. If the list is empty,
   * undefined is returned and the list is not modified.
   *
   * @returns The first element of the list.
   * @example new List('foo', 'bar', 'baz').shift() // 'foo'
   */
  shift(): T | undefined {
    if (!this.head) return undefined
    const value = this.head.value
    this.head = this.head.next
    if (this.head) this.head.previous = undefined
    else this.tail = undefined
    this.length--
    return value
  }

  /**
   * Gets the value at the specified index.
   *
   * @param index The zero-based index of the value to get.
   * @returns The value at the specified index or undefined if the index is out of range.
   * @example new List(1, 2, 3]).at(1) // 2
   */
  at(index: number): T | undefined {
    return this.nodeAt(index)?.value
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
  concat(...items: Array<Iterable<T> | List<T>>): List<T> {
    const list = new List<T>()
    for (const item of this) list.push(item)
    for (const array of items) for (const item of array) list.push(item)
    return list
  }

  /**
   * Similar to `concat` but sequences the lists in the order they are provided
   * without creating a new list. This means that the first list will be a collection
   * of all the lists combined and the last list we be left unchanged.
   *
   * Keep in mind that the `head` of the subsequent lists will be linked back
   * to the `tail` of the previous list. This means that if you modify the last
   * list, you will also modify the first one.
   *
   * If one of the list is empty, it will be skipped.
   *
   * @param lists Additional items to add to the end of the list.
   * @returns The reference to the first list with the combined items.
   * @example
   *
   * // Create three lists.
   * const list1 = new List('foo', 'bar')
   * const list2 = new List('baz', 'qux')
   * const list3 = new List('quux', 'corge')
   *
   * // Combine the lists.
   * list1.link(list2, list3)
   *
   * list1 // List { 'foo', 'bar', 'baz', 'qux', 'quux', 'corge' }
   * list2 // List { 'baz', 'qux', 'quux', 'corge' }
   * list3 // List { 'quux', 'corge' }
   */
  link(...lists: Array<List<T>>): this {
    if (lists.length === 0) return this

    let length = this.length
    let previous = this as List<T>
    let head: ListNode<T> | undefined = this.head
    let tail: ListNode<T> | undefined = this.tail

    // --- Link each list to the previous one.
    for (const list of lists) {
      if (!list.head) continue
      this.head ??= list.head
      head ??= list.head

      // --- Link the previous list to the current one.
      if (previous.tail) previous.tail.next = list.head
      list.head.previous = previous.tail

      tail = list.tail
      previous = list
      length += list.length
    }

    // --- Loop again and set the tail for each list.
    for (const list of [this, ...lists]) {
      if (!list.head) continue
      length -= list.length
      list.tail = tail
      list.length += length
    }

    return this
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
  join(separator = ','): string {
    let result = ''
    let node = this.head
    while (node) {
      result += String(node.value ?? '')
      node = node.next
      if (node) result += separator
    }
    return result
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
  slice(start = 0, end = this.length): List<T> {
    const list = new List<T>()
    let node = this.head
    let index = 0

    // --- Handle out of bounds indexes.
    if (start < 0) start = this.length + start
    if (end < 0) end = this.length + end

    // --- Iterate over the list to find the nodes to extract.
    while (node) {
      if (start <= index && index < end) list.push(node.value!)
      node = node.next
      index++
    }

    // --- Return the extracted items.
    return list
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
  splice(start = 0, deleteCount = 0, ...items: T[]): List<T> {
    const offset = deleteCount > 0 ? 0 : -1
    const from = (start === 0) ? undefined : this.nodeAt(start + offset)
    return this.nodeSplice(from, deleteCount, ...items)
  }

  /**
   * Reverses the elements in an list in place. This method mutates the list and
   * returns a reference to the same list.
   *
   * @returns The reversed list.
   * @example new List('foo', 'bar', 'baz').reverse() // List { 'baz', 'bar', 'foo' }
   */
  // @ts-expect-error: This function overrides the return type from Array
  reverse(): this {

    // --- Abort early if no changes are needed.
    if (this.tail === this.head) return this

    // --- Swap each node's next and previous references.
    let node: ListNode<T> | undefined = this.head
    let next: ListNode<T> | undefined = this.head?.next
    let previous: ListNode<T> | undefined
    while (node) {
      node.next = previous
      node.previous = next
      previous = node
      node = next
      next = node?.next
    }

    // --- Swap the head and tail.
    this.tail = this.head
    this.head = previous
    return this
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
    if (this.head === this.tail) return this

    // --- When no `compareFunction` is provided, we will use the default
    // --- comparison function to sort the list. Unfortunately, since we dont have
    // --- access to this function directly, we must first convert the list to an
    // --- array, sort it, and then convert it back to a list.
    if (typeof compareFunction !== 'function') {
      // eslint-disable-next-line sonarjs/no-alphabetical-sort
      const sorted = [...this].sort()
      const list = List.from(sorted)
      this.head = list.head
      this.tail = list.tail
      return this
    }

    // --- Otherwise, we will use the provided `compareFunction` to sort the list
    // --- using the merge sort algorithm. The main reason is that we expect linked
    // --- lists to be used with large datasets where merge sort is more efficient.
    const merge = (left?: ListNode<T>, right?: ListNode<T>): ListNode<T> | undefined => {
      const dummy: ListNode<T> = {}
      let tail = dummy
      while (left && right) {
        const result = compareFunction(left.value!, right.value!)
        if (result <= 0) {
          tail.next = left
          left.previous = tail
          left = left.next
        }
        else {
          tail.next = right
          right.previous = tail
          right = right.next
        }
        tail = tail.next
      }
      tail.next = left ?? right
      if (tail.next) tail.next.previous = tail
      return dummy.next
    }

    let size = 1
    const split = (head?: ListNode<T>): ListNode<T> | undefined => {
      if (!head?.next) return
      let current = head
      let i = size
      while (--i && current.next) current = current.next
      const next = current.next
      current.next = undefined
      if (next) next.previous = undefined
      return next
    }

    while (size < this.length) {
      let current = this.head
      let head: ListNode<T> | undefined
      let tail: ListNode<T> | undefined
      while (current) {
        const left = current
        const right = split(left)
        current = split(right)
        const mergedHead = merge(left, right)
        head ??= mergedHead
        if (tail) tail.next = mergedHead
        if (tail && mergedHead) mergedHead.previous = tail
        tail = mergedHead
        while (tail?.next) tail = tail.next
      }
      this.head = head
      size *= 2
    }

    // --- Ensure references are properly linked.
    let current: ListNode<T> | undefined = this.head
    let previous: ListNode<T> | undefined
    while (current) {
      if (current.next) {
        current.previous = previous
        previous = current
        current = current.next
      }
      else {
        current.previous = previous
        this.tail = current
        break
      }
    }

    return this
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
    let node = this.head
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
  lastIndexOf(searchElement: T, fromIndex = this.length - 1): number {
    let index = this.length - 1
    let node = this.tail
    while (node) {
      if (index <= fromIndex && node.value === searchElement) return index
      node = node.previous
      index--
    }
    return -1
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
  every<S extends T>(predicate: (value: T, index: number, list: List<T>) => value is S): this is List<S>
  // @ts-expect-error: This function overrides the parameter type from Array
  every(predicate: (value: T, index: number, list: List<T>) => boolean): boolean
  // @ts-expect-error: This function overrides the parameter type from Array
  every(predicate: (value: T, index: number, list: List<T>) => boolean): boolean {
    let node = this.head
    let index = 0
    while (node) {
      const result = predicate(node.value!, index++, this)
      if (!result) return false
      node = node.next
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
    let node = this.head
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
    let node = this.head
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
    let node = this.head
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
    let node = this.head
    let index = 0
    const result = new List<T>()
    while (node) {
      const value = node.value!
      const passes = predicate.apply(thisArgument, [value, index, this])
      if (passes) result.push(value)
      node = node.next
      index++
    }
    return result
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

    // --- Throw early if the list is empty and no initial value is provided.
    if (!this.head && initialValue === undefined)
      throw new TypeError('Reduce of empty list with no initial value')

    // --- If no initial value is provided, use the first value in the list.
    let index = 0
    let node = this.head
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

    // --- Throw early if the list is empty and no initial value is provided.
    if (!this.head && initialValue === undefined)
      throw new TypeError('Reduce of empty list with no initial value')

    // --- If no initial value is provided, use the last value in the list.
    let node = this.tail
    let index = this.length - 1
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
  // find<S extends T>(predicate: (this: void, value: T, index: number, list: List<T>) => value is S, thisArgument?: any): S | undefined
  // @ts-expect-error: This function overrides the parameter type from Array
  find<S extends T>(predicate: (value: T, index: number, list: List<T>) => value is S, thisArgument?: any): S | undefined
  // @ts-expect-error: This function overrides the parameter type from Array
  find(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: any): T | undefined
  // @ts-expect-error: This function overrides the parameter type from Array
  find(predicate: (value: unknown, index: number, list: List<T>) => unknown, thisArgument?: unknown): unknown {
    let node = this.head
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
   * Determines whether an list includes a certain element, returning true or false as appropriate.
   *
   * @param searchElement The element to search for.
   * @param fromIndex The position in this list at which to begin searching for searchElement.
   * @returns `true` if the searchElement is found, otherwise `false`.
   * @example new List('foo', 'bar', 'baz').includes('bar') // true
   */
  includes(searchElement: T, fromIndex = 0): boolean {
    let node = this.head
    let index = 0
    while (node) {
      if (fromIndex <= index++ && node.value === searchElement) return true
      node = node.next
    }
    return false
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
    let node = this.head
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
  fill(value: T, start = 0, end = this.length): this {
    let node = this.head
    let index = 0

    // --- Handle out of bounds values
    if (start < 0) start = this.length + start
    if (end < 0) end = this.length + end

    // --- Iterate over the list to find the nodes to fill.
    while (node) {
      if (start <= index && index < end) node.value = value
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
  copyWithin(target = 0, start = 0, end = this.length): this {
    const sliceStart = start < 0 ? this.length + start : start
    const sliceEnd = end < 0 ? this.length + end : end
    const sliceLength = Math.min(sliceEnd - sliceStart, this.length - target)
    const slice = this.slice(sliceStart, sliceStart + sliceLength)
    this.splice(target, sliceLength, ...slice)
    return this
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
  flatMap<U, This = undefined>(callback: (this: This, value: T, index: number, list: List<T>) => List<U> | readonly U[] | U, thisArgument?: This ): List<U> {
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
    let node = this.head
    while (node) {
      const value = node.value

      // --- If the value is an array, flatten it.
      if (Array.isArray(value) || value instanceof List) {
        // @ts-expect-error: The `flat` method exists on both arrays and lists.
        const flatValue = depth === 1 ? value : value.flat(depth - 1) as T[]
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
   * Copies a list, then overwrites the value at the provided index with the
   * given value. If the index is negative, then it replaces from the end
   * of the list.
   *
   * @param index The index of the value to overwrite. If the index is
   * negative, then it replaces from the end of the list.
   * @param value The value to write into the copied list.
   * @returns The copied list with the updated value.
   */
  // @ts-expect-error: Overload signatures
  with(index: number, value: T): List<T> {
    const copy = this.slice()
    copy[index] = value
    return copy
  }

  /**
   * Finds the last element in the list that satisfies the provided testing function.
   *
   * @param predicate The function to execute on each value in the list.
   * @param thisArgument The value to use as `this` when executing the predicate.
   * @returns The last element in the list that satisfies the provided testing function, or `undefined` if none is found.
   * @example new List('foo', 'bar', 'baz').findLast(x => x === 'bar') // 'bar'
   */
  // @ts-expect-error: Overload signatures
  findLast<S extends T>(predicate: (value: T, index: number, list: List<T>) => value is S, thisArgument?: any): S | undefined
  // @ts-expect-error: Overload signatures
  findLast(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: any): T | undefined
  // @ts-expect-error: Overload signatures
  findLast(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: unknown): unknown {
    let node = this.tail
    let index = this.length - 1
    while (node) {
      const result = predicate.apply(thisArgument, [node.value!, index, this])
      if (result) return node.value
      node = node.previous
      index--
    }
  }

  /**
   * Finds the last index of an element in the list.
   *
   * @param predicate The function to execute on each value in the list.
   * @param thisArgument The value to use as `this` when executing the predicate.
   * @returns The last index of the element in the list, or -1 if it is not present.
   * @example new List('foo', 'bar', 'baz').findLastIndex(x => x === 'bar') // 1
   */
  // @ts-expect-error: Overload signatures
  findLastIndex(predicate: (value: T, index: number, list: List<T>) => unknown, thisArgument?: any): number {
    let node = this.tail
    let index = this.length - 1
    while (node) {
      const result = predicate.apply(thisArgument, [node.value!, index, this])
      if (result) return index
      node = node.previous
      index--
    }
    return -1
  }

  /**
   * Returns a new list with the elements reversed.
   *
   * @returns A new list with the elements reversed.
   * @example new List('foo', 'bar', 'baz').toReversed() // List { 'baz', 'bar', 'foo' }
   */
  // @ts-expect-error: Overload signatures
  toReversed(): List<T> {
    // eslint-disable-next-line unicorn/no-array-reverse
    return this.slice().reverse()
  }

  /**
   * Returns a new list with the elements sorted according to the provided compare function.
   *
   * @param compareFunction
   * A function that defines the sort order. If omitted, the list is sorted according to each
   * character's Unicode code point value, according to the string conversion of each element.
   * @returns A new list with the elements sorted.
   * @example new List('foo', 'bar', 'baz').toSorted() // List { 'bar', 'baz', 'foo' }
   */
  // @ts-expect-error: Overload signatures
  toSorted(compareFunction?: ((a: T, b: T) => number)): List<T> {
    return this.slice().sort(compareFunction)
  }

  /**
   * Removes elements from an list and, if necessary, inserts new elements in their place,
   * returning the deleted elements.
   *
   * @param start The zero-based location in the list from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the list in place of the deleted elements.
   * @returns An new list containing the elements that were deleted.
   * @example new List('foo', 'bar', 'baz').toSorted() // List { 'bar', 'baz', 'foo' }
   */
  // @ts-expect-error: Overload signatures
  toSpliced(start: number, deleteCount?: number, ...items: T[]): List<T> {
    const copy = this.slice()
    copy.splice(start, deleteCount, ...items)
    return copy
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the list
   *
   * @yields The key, value pairs in the list as an tuple.
   */
  * entries(): ArrayIterator<[number, T]> {
    let node = this.head
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
  * keys(): ArrayIterator<number> {
    let node = this.head
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
  * values(): ArrayIterator<T> {
    let node = this.head
    while (node) {
      yield node.value as T
      node = node.next
    }
  }

  /**
   * A method that returns the default iterator for an object. Called by the semantics of the for-of statement.
   *
   * @returns An iterator over the elements of the list.
   */
  // @ts-expect-error: This function overrides the return type from Array
  [Symbol.iterator](): IterableIterator<T> {
    return this.values()
  }

  /**
   * Returns a string representation of a list.
   *
   * @returns The string representation of the list.
   * @example new List('foo', 'bar', 'baz').toString() // 'foo,bar,baz'
   */
  toString(): string {
    return this.join(',')
  }

  /**
   * Returns a string representation of a list. The elements are converted to
   * string using their toLocaleString methods.
   *
   * @returns The string representation of the list.
   * @example new List('foo', 'bar', 'baz').toLocaleString() // 'foo,bar,baz'
   */
  toLocaleString(): string {
    let result = ''
    let node = this.head
    while (node) {
      result += node.value?.toLocaleString() ?? ''
      node = node.next
      if (node) result += ','
    }
    return result
  }

  /**
   * Returns a string representation of a list.
   *
   * @returns The string representation of the list.
   * @example new List('foo', 'bar', 'baz').toString() // '[ foo, bar, baz ]'
   */
  [Symbol.toPrimitive](): string {
    const value = this.join(', ')
    return `[ ${value} ]`
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
 * @example createList(['foo', 'bar', 'baz']) // List { 'foo', 'bar', 'baz' }
 */
export function createList<T>(values: T[]): List<T>

/**
 * Creates a new list from the given values or with the specified length.
 *
 * @param valuesOrLength Either an array of values to populate the list, or a number specifying the length of an empty list
 * @returns A new list instance
 * @example
 * ```typescript
 * // Create a list from an array of values
 * const list1 = createList([1, 2, 3]);
 *
 * // Create an empty list with specified length
 * const list2 = createList<string>(5);
 *
 * // Create an empty list with default length of 0
 * const list3 = createList();
 * ```
 */
export function createList<T>(valuesOrLength?: number | T[]): List<T>

/**
 * Creates a new List instance from the given values or with the specified length.
 *
 * @template T The type of elements in the list
 * @param valuesOrLength Either an array of values to populate the list, or a number specifying the length of an empty list
 * @param args Additional arguments (not allowed - will throw an error if provided)
 * @returns A new List instance
 *
 * @example
 * ```typescript
 * // Create a list from an array of values
 * const list1 = createList([1, 2, 3]);
 *
 * // Create an empty list with specified length
 * const list2 = createList<string>(5);
 *
 * // Create an empty list with default length of 0
 * const list3 = createList();
 * ```
 */
export function createList<T>(valuesOrLength: number | T[] = 0, ...args: unknown[]): List<T> {

  // --- Assert only one argument is provided. This is to avoid ambiguity from
  // --- legacy array constructors that accept multiple arguments to create an array.
  if (args.length > 0) throw new TypeError('Could not create list: too many arguments were provided.')

  // --- Create a list from the given values or length.
  return Array.isArray(valuesOrLength)
    ? List.of<T>(...valuesOrLength)
    : List.from<T>({ length: valuesOrLength })
}
