// oxlint-disable require-array-join-separator
// oxlint-disable prefer-spread
// oxlint-disable no-array-reverse
// oxlint-disable no-array-method-this-argument
// oxlint-disable no-array-for-each
// oxlint-disable no-magic-array-flat-depth
// oxlint-disable no-array-callback-reference
// oxlint-disable no-array-reduce
// oxlint-disable no-conditional-expect
import { createList, List } from './createList'

interface ExpectListMatchingOptions {
  skipCheckFromEnd?: boolean
  skipCheckFromStart?: boolean
}

/**
 * Helper function to compare the expected signature of a list. This will
 * check that `length`, `firstNode`, and `lastNode` correspond to the expected
 * values based on the provided items.
 *
 * @param list The list to check.
 * @param items The expected items in the list.
 * @param options The options to pass to the function.
 */
function expectListMatching(list: List, items: unknown[], options: ExpectListMatchingOptions = {}) {
  expect(list).toBeInstanceOf(List)
  expect(list.length, 'Length is incorrect').toBe(items.length)
  // @ts-expect-error: accessing private property
  const head = list.head
  // @ts-expect-error: accessing private property
  const tail = list.tail

  // --- Check the list from the start.
  if (!options.skipCheckFromStart) {
    let node = head
    let index = 0
    while (node) {
      const value = items[index++]
      expect(node.value, `Node value at index ${index} from the start"`).toStrictEqual(value)
      if (!node.next) break
      node = node.next
    }

    // --- Check that the last node if the tail.
    expect(node, 'Last node from the start should be the tail').toStrictEqual(tail)
  }

  // --- Check the list from the end.
  if (!options.skipCheckFromEnd) {
    let node = tail
    let index = 0
    while (node) {
      const value = items.at(--index)
      expect(node.value, `Node value at index ${index} from the end`).toStrictEqual(value)
      if (!node.previous) break
      node = node.previous
    }

    // --- Check that the first node if the head.
    expect(node, 'Last node from the end should be the head').toStrictEqual(head)
  }
}

/**
 * Check the behavior of the `List` class and its methods. This will test the
 * a specific method of a list and and array and check that the results are
 * the same.
 *
 * @param items The items to create the list and array from.
 * @param method The method to test.
 * @param args The arguments to pass to the method.
 */
function expectArrayBehaviour(items: unknown[], method: keyof unknown[] & string, ...args: unknown[]) {
  const list = createList(items)
  const array = [...items]

  // @ts-expect-error: ignore the error
  const expected = typeof array[method] === 'function' ? array[method](...args) : array[method]
  // @ts-expect-error: ignore the error
  let result = typeof list[method] === 'function' ? list[method](...args) : list[method]
  if (result instanceof List) result = [...result]

  // --- Check the result of the method matches the expected result.
  expect(result, 'The behaviour of the List class does not match the Array class').toMatchObject(expected)

  // --- Check that the list and array are still the same after the method.
  expect([...list], 'The list transformation is not matching the array transformation').toMatchObject(array)
}

describe('createList', () => {
  describe('constructor', () => {
    it('should create an empty list', () => {
      const result = new List()
      expectListMatching(result, [])
    })

    it('should create list with given elements', () => {
      const result = new List('foo', 'bar', 'baz')
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })

    it('should create list with given length', () => {
      const result = new List(3)
      expectListMatching(result, [undefined, undefined, undefined])
    })

    it('should be a prototype of the Array class', () => {
      const list = new List()

      const result = Array.isArray(list)
      expect(result).toBe(true)
    })

    it('should return true for the `isArray` method', () => {
      const list = new List()
      const result = Array.isArray(list)
      expect(result).toBe(true)
    })
  })

  describe('at', () => {
    it('should get the value at the specified index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.at(0)).toBe('foo')
      expect(result.at(1)).toBe('bar')
      expect(result.at(2)).toBe('baz')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'at', 0)
    })

    it('should get the value at the specified negative index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.at(-1)).toBe('baz')
      expect(result.at(-2)).toBe('bar')
      expect(result.at(-3)).toBe('foo')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'at', -1)
    })

    it('should return undefined if the index is out of range', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.at(3)).toBe(undefined)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'at', 3)
    })

    it('should return undefined if the index is negative and out of range', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.at(-4)).toBe(undefined)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'at', -4)
    })

    it('should return undefined if the list is empty', () => {
      const result = createList(0)
      expect(result.at(0)).toBe(undefined)
      expectArrayBehaviour([], 'at', 0)
    })
  })

  describe('get list[index]', () => {
    it('should get the value at the specified index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result[0]).toBe('foo')
      expect(result[1]).toBe('bar')
      expect(result[2]).toBe('baz')
    })

    it('should return undefined if the index is out of range', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result[3]).toBe(undefined)
    })

    it('should get undefined if the index is negative', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result[-1]).toBe(undefined)
      expect(result[-2]).toBe(undefined)
      expect(result[-3]).toBe(undefined)
    })

    it('should return undefined if the list is empty', () => {
      const result = createList(0)
      expect(result[0]).toBe(undefined)
    })
  })

  describe('set list[index]', () => {
    it('should set the value at 0', () => {
      const result = createList(['foo', 'bar', 'baz'])
      result[0] = 'FOO'
      expectListMatching(result, ['FOO', 'bar', 'baz'])
    })

    it('should set the value at 1', () => {
      const result = createList(['foo', 'bar', 'baz'])
      result[1] = 'BAR'
      expectListMatching(result, ['foo', 'BAR', 'baz'])
    })

    it('should set the value at 2', () => {
      const result = createList(['foo', 'bar', 'baz'])
      result[2] = 'BAZ'
      expectListMatching(result, ['foo', 'bar', 'BAZ'])
    })

    it('should not set using negative index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      result[-1] = 'qux'
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })
  })

  describe('of', () => {
    it('should create list using the `of` method', () => {
      const result = List.of('foo', 'bar', 'baz')
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })
  })

  describe('from', () => {
    it('should create list given a length', () => {
      const result = List.from({ length: 3 })
      expectListMatching(result, [undefined, undefined, undefined])
    })

    it('should create list from an array', () => {
      const result = List.from(['foo', 'bar', 'baz'])
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })

    it('should create list from a string', () => {
      const result = List.from('foo')
      expectListMatching(result, ['f', 'o', 'o'])
    })

    it('should create list from an iterable', () => {
      const iterable = new Set(['foo', 'bar', 'baz'])
      const result = List.from(iterable)
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })

    it('should create list from a generator function', () => {
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const generator = function * () { yield 'foo'; yield 'bar'; yield 'baz' }
      const result = List.from(generator())
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })
  })

  describe('from with mapping function', () => {
    it('should create a list given a length and a mapping function', () => {
      const result = List.from({ length: 3 }, (_, index) => index)
      expectListMatching(result, [0, 1, 2])
    })

    it('should pass the `thisArg`, `value` and `index` to the mapping function', () => {
      const result = List.from({ length: 3 }, function(value: undefined, index) { return `${this}-${value}-${index}` }, 'prefix')
      expectListMatching(result, ['prefix-undefined-0', 'prefix-undefined-1', 'prefix-undefined-2'])
    })

    it('should create list from a generator function with a mapping function', () => {
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const generator = function * () { yield 'foo'; yield 'bar'; yield 'baz' }
      const result = List.from(generator(), value => value.toUpperCase())
      expectListMatching(result, ['FOO', 'BAR', 'BAZ'])
    })

    it('should create list from a generator and pass the `thisArg`, `value` and `index` to the mapping function', () => {
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const generator = function * () { yield 'foo'; yield 'bar'; yield 'baz' }
      const result = List.from(generator(), function(value, index) { return `${this}-${value}-${index}` }, 'prefix')
      expectListMatching(result, ['prefix-foo-0', 'prefix-bar-1', 'prefix-baz-2'])
    })
  })

  describe('createList', () => {
    it('should create an empty list by default', () => {
      const result = createList()
      expectListMatching(result, [])
    })

    it('should create list using the `createList` function', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expectListMatching(result, ['foo', 'bar', 'baz'])
    })

    it('should create list using the `createList` function with a length', () => {
      const result = createList(3)
      expectListMatching(result, [undefined, undefined, undefined])
    })

    it('should not have ambguious input parameters', () => {
      // @ts-expect-error: This should throw an error
      const shouldThrow = () => createList(3, ['foo', 'bar', 'baz'])
      expect(shouldThrow).toThrowError(TypeError)
      expect(shouldThrow).toThrowError('Could not create list: too many arguments were provided.')
    })
  })

  describe('nodeAt', () => {
    it('should get the node at the specified index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.nodeAt(0)?.value).toBe('foo')
      expect(result.nodeAt(1)?.value).toBe('bar')
      expect(result.nodeAt(2)?.value).toBe('baz')
    })

    it('should get the node at the specified negative index', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.nodeAt(-1)?.value).toBe('baz')
      expect(result.nodeAt(-2)?.value).toBe('bar')
      expect(result.nodeAt(-3)?.value).toBe('foo')
    })

    it('should return undefined if the index is out of range', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.nodeAt(3)).toBe(undefined)
    })

    it('should return undefined if the index is negative and out of range', () => {
      const result = createList(['foo', 'bar', 'baz'])
      expect(result.nodeAt(-4)).toBe(undefined)
    })

    it('should return undefined if the list is empty', () => {
      const result = createList(0)
      expect(result.nodeAt(0)).toBe(undefined)
    })
  })

  describe('nodeSplice', () => {
    describe('insert one node', () => {
      it('should insert a new node at the start of the list', () => {
        const list = createList(['bar', 'baz'])
        const result = list.nodeSplice(undefined, 0, 'foo')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
      })

      it('should insert a new node at the end of the list', () => {
        const list = createList(['foo', 'bar'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail, 0, 'baz')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
      })

      it('should insert a new node after the first node', () => {
        const list = createList(['foo', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head, 0, 'bar')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
      })
    })

    describe('insert multiple nodes', () => {
      it('should insert multiple nodes at the start of the list', () => {
        const list = createList(['baz', 'qux'])
        const result = list.nodeSplice(undefined, 0, 'foo', 'bar')
        expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
        expectListMatching(result, [])
      })

      it('should insert multiple nodes at the end of the list', () => {
        const list = createList(['foo', 'bar'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail, 0, 'baz', 'qux')
        expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
        expectListMatching(result, [])
      })

      it('should insert multiple nodes after the first node', () => {
        const list = createList(['foo', 'qux'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head, 0, 'bar', 'baz')
        expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
        expectListMatching(result, [])
      })
    })

    describe('delete one node', () => {
      it('should delete the first node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.nodeSplice(undefined, 1)
        expectListMatching(result, ['foo'])
        expectListMatching(list, ['bar', 'baz'])
      })

      it('should delete the last node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail, 1)
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar'])
      })

      it('should delete the second node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head!.next, 1)
        expectListMatching(result, ['bar'])
        expectListMatching(list, ['foo', 'baz'])
      })
    })

    describe('delete multiple nodes', () => {
      it('should delete the first two nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.nodeSplice(undefined, 2)
        expectListMatching(result, ['foo', 'bar'])
        expectListMatching(list, ['baz', 'qux'])
      })

      it('should delete the last two nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail!.previous, 2)
        expectListMatching(result, ['baz', 'qux'])
        expectListMatching(list, ['foo', 'bar'])
      })

      it('should delete the second and third nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head!.next, 2)
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo', 'qux'])
      })
    })

    describe('remplace one node', () => {
      it('should replace the first node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.nodeSplice(undefined, 1, 'FOO')
        expectListMatching(result, ['foo'])
        expectListMatching(list, ['FOO', 'bar', 'baz'])
      })

      it('should replace the last node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail, 1, 'BAZ')
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar', 'BAZ'])
      })

      it('should replace the second node', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head!.next, 1, 'BAR')
        expectListMatching(result, ['bar'])
        expectListMatching(list, ['foo', 'BAR', 'baz'])
      })
    })

    describe('replace multiple nodes', () => {
      it('should replace the first two nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.nodeSplice(undefined, 2, 'FOO', 'BAR')
        expectListMatching(result, ['foo', 'bar'])
        expectListMatching(list, ['FOO', 'BAR', 'baz', 'qux'])
      })

      it('should replace the last two nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail!.previous, 2, 'BAZ', 'QUX')
        expectListMatching(result, ['baz', 'qux'])
        expectListMatching(list, ['foo', 'bar', 'BAZ', 'QUX'])
      })

      it('should replace the second and third nodes', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head!.next, 2, 'BAR', 'BAZ')
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo', 'BAR', 'BAZ', 'qux'])
      })
    })

    describe('edge cases', () => {
      it('should delete nodes out of range from the start', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.nodeSplice(undefined, 4)
        expectListMatching(result, ['foo', 'bar', 'baz'])
        expectListMatching(list, [])
      })

      it('should delete nodes out of range from the end', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.tail, 4)
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar'])
      })

      it('should delete nodes out of range from the middle', () => {
        const list = createList(['foo', 'bar', 'baz'])
        // @ts-expect-error: accessing private property
        const result = list.nodeSplice(list.head!.next, 4)
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo'])
      })

      it('should abort early if no nodes are added or removed', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.nodeSplice(undefined, 0)
        expectListMatching(result, [])
        expectListMatching(list, ['foo', 'bar', 'baz'])
      })
    })
  })

  describe('push', () => {
    it('should append new elements to an empty list', () => {
      const list = createList(0)
      const length = list.push('foo')
      expect(length).toBe(1)
      expectListMatching(list, ['foo'])
      expectArrayBehaviour([], 'push', 'foo')
    })

    it('should append new elements to the end of the list', () => {
      const list = createList(['foo', 'bar'])
      const length = list.push('baz')
      expect(length).toBe(3)
      expectListMatching(list, ['foo', 'bar', 'baz'])
      expectArrayBehaviour(['foo', 'bar'], 'push', 'baz')
    })

    it('should append multiple new elements to the end of the list', () => {
      const list = createList(['foo', 'bar'])
      const length = list.push('baz', 'qux')
      expect(length).toBe(4)
      expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar'], 'push', 'baz', 'qux')
    })

    it('should abort early if no elements are provided', () => {
      const list = createList(['foo', 'bar'])
      const length = list.push()
      expect(length).toBe(2)
      expectListMatching(list, ['foo', 'bar'])
      expectArrayBehaviour(['foo', 'bar'], 'push')
    })

    it('should abort early if no elements are provided in an empty list', () => {
      const list = createList(0)
      const length = list.push()
      expect(length).toBe(0)
      expectListMatching(list, [])
      expectArrayBehaviour([], 'push')
    })
  })

  describe('unshift', () => {
    it('should prepend new elements to an empty list', () => {
      const list = createList(0)
      const length = list.unshift('foo')
      expect(length).toBe(1)
      expectListMatching(list, ['foo'])
      expectArrayBehaviour([], 'unshift', 'foo')
    })

    it('should prepend new elements to the beginning of the list', () => {
      const list = createList(['bar', 'baz'])
      const length = list.unshift('foo')
      expect(length).toBe(3)
      expectListMatching(list, ['foo', 'bar', 'baz'])
      expectArrayBehaviour(['bar', 'baz'], 'unshift', 'foo')
    })

    it('should prepend multiple new elements to the beginning of the list', () => {
      const list = createList(['baz', 'qux'])
      const length = list.unshift('foo', 'bar')
      expect(length).toBe(4)
      expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
      expectArrayBehaviour(['baz', 'qux'], 'unshift', 'foo', 'bar')
    })

    it('should abort early if no elements are provided', () => {
      const list = createList(['foo', 'bar'])
      const length = list.unshift()
      expect(length).toBe(2)
      expectListMatching(list, ['foo', 'bar'])
      expectArrayBehaviour(['foo', 'bar'], 'unshift')
    })

    it('should abort early if no elements are provided in an empty list', () => {
      const list = createList(0)
      const length = list.unshift()
      expect(length).toBe(0)
      expectListMatching(list, [])
      expectArrayBehaviour([], 'unshift')
    })
  })

  describe('pop', () => {
    it('should remove and return the last element from the list', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.pop()
      expect(result).toBe('baz')
      expectListMatching(list, ['foo', 'bar'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'pop')
    })

    it('should return undefined if the list is empty', () => {
      const list = createList(0)
      const result = list.pop()
      expect(result).toBe(undefined)
      expectListMatching(list, [])
      expectArrayBehaviour([], 'pop')
    })

    it('should clear the list if the last element is popped', () => {
      const list = createList(['foo'])
      const result = list.pop()
      expect(result).toBe('foo')
      expectListMatching(list, [])
      expectArrayBehaviour(['foo'], 'pop')
    })
  })

  describe('shift', () => {
    it('should remove and return the first element from the list', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.shift()
      expect(result).toBe('foo')
      expectListMatching(list, ['bar', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'shift')
    })

    it('should return undefined if the list is empty', () => {
      const list = createList(0)
      const result = list.shift()
      expect(result).toBe(undefined)
      expectListMatching(list, [])
      expectArrayBehaviour([], 'shift')
    })

    it('should clear the list if the first element is shifted', () => {
      const list = createList(['foo'])
      const result = list.shift()
      expect(result).toBe('foo')
      expectListMatching(list, [])
      expectArrayBehaviour(['foo'], 'shift')
    })
  })

  describe('concat', () => {
    it('should combine two lists', () => {
      const listOne = createList(['foo', 'bar'])
      const listTwo = createList(['baz', 'qux'])
      const result = listOne.concat(listTwo)
      expectListMatching(listOne, ['foo', 'bar'])
      expectListMatching(listTwo, ['baz', 'qux'])
      expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar'], 'concat', ['baz', 'qux'])
    })

    it('should combine a list with an array', () => {
      const list = createList(['foo', 'bar'])
      const result = list.concat(['baz', 'qux'])
      expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar'], 'concat', ['baz', 'qux'])
    })

    it('should combine with list and array', () => {
      const items1 = createList(['foo', 'bar'])
      const items2 = createList(['baz', 'qux'])
      const itesm3 = ['quux', 'corge']
      const result = items1.concat(items2, itesm3)
      expectListMatching(result, ['foo', 'bar', 'baz', 'qux', 'quux', 'corge'])
    })

    it('should combine a list with an empty array', () => {
      const list = createList(['foo', 'bar'])
      const result = list.concat([])
      expectListMatching(result, ['foo', 'bar'])
    })

    it('should create empty clone if the list is empty', () => {
      const list = createList(['foo', 'bar'])
      const result = list.concat()
      expect(result).not.toBe(list)
      expectListMatching(result, ['foo', 'bar'])
    })

    it('should not mutate the original list', () => {
      const list = createList(['foo', 'bar'])
      const result = list.concat(['baz'])
      expect(result).not.toBe(list)
    })
  })

  describe('link', () => {
    it('should link two lists together', () => {
      const listOne = createList(['foo', 'bar'])
      const listTwo = createList(['baz', 'qux'])
      const result = listOne.link(listTwo)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar', 'baz', 'qux'])
      expectListMatching(listTwo, ['baz', 'qux'], { skipCheckFromEnd: true })
    })

    it('should link three lists together', () => {
      const listOne = createList(['foo', 'bar'])
      const listTwo = createList(['baz', 'qux'])
      const listThree = createList(['quux', 'corge'])
      const result = listOne.link(listTwo, listThree)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar', 'baz', 'qux', 'quux', 'corge'])
      expectListMatching(listTwo, ['baz', 'qux', 'quux', 'corge'], { skipCheckFromEnd: true })
      expectListMatching(listThree, ['quux', 'corge'], { skipCheckFromEnd: true })
    })

    it('should abort early if no lists are provided', () => {
      const listOne = createList(['foo', 'bar'])
      const result = listOne.link()
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar'])
    })

    it('should abort early if the second list is empty', () => {
      const listOne = createList(['foo', 'bar'])
      const listTwo = createList<string>(0)
      const result = listOne.link(listTwo)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar'])
      expectListMatching(listTwo, [])
    })

    it('should link an empty list with a non-empty list', () => {
      const listOne = createList<string>(0)
      const listTwo = createList(['foo', 'bar'])
      const result = listOne.link(listTwo)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar'])
      expectListMatching(listTwo, ['foo', 'bar'])
    })

    it('should link an empty list with a non-empty list in the middle', () => {
      const listOne = createList<string>(0)
      const listTwo = createList<string>(0)
      const listThree = createList(['foo', 'bar'])
      const result = listOne.link(listTwo, listThree)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar'])
      expectListMatching(listTwo, [])
      expectListMatching(listThree, ['foo', 'bar'])
    })

    it('should skip linking an empty list when in the middle', () => {
      const listOne = createList(['foo', 'bar'])
      const listTwo = createList<string>(0)
      const listThree = createList(['baz', 'qux'])
      const result = listOne.link(listTwo, listThree)
      expect(result).toBe(listOne)
      expectListMatching(listOne, ['foo', 'bar', 'baz', 'qux'])
      expectListMatching(listTwo, [])
      expectListMatching(listThree, ['baz', 'qux'], { skipCheckFromEnd: true })
    })

    it('should ignore two empty lists', () => {
      const listOne = createList<string>(0)
      const listTwo = createList<string>(0)
      const result = listOne.link(listTwo)
      expect(result).toBe(listOne)
      expectListMatching(listOne, [])
      expectListMatching(listTwo, [])
    })
  })

  describe('join', () => {
    it('should join the elements of the list into a string with default separator', () => {
      const result = createList(['foo', 'bar', 'baz']).join()
      expect(result).toBe('foo,bar,baz')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'join')
    })

    it('should cast elements to strings before joining', () => {
      const result = createList(['Hello', true, null, {}, undefined, 42, () => {}]).join()
      expect(result).toBe('Hello,true,,[object Object],,42,() => {\n      }')
      expectArrayBehaviour(['Hello', true, null, {}, undefined, 42, () => {}], 'join')
    })

    it('should join the elements of the list into a string with a different separator', () => {
      const result = createList(['foo', 'bar', 'baz']).join('-')
      expect(result).toBe('foo-bar-baz')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'join', '-')
    })

    it('should join the elements of an empty list into an empty string', () => {
      const result = createList(0).join(',')
      expect(result).toBe('')
      expectArrayBehaviour([], 'join', ',')
    })
  })

  describe('slice', () => {
    it('should return a shallow copy of the entire list', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.slice()
      expect(result).not.toBe(list)
      expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'slice')
    })

    it('should return a shallow copy of the list starting at the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.slice(1)
      expect(result).not.toBe(list)
      expectListMatching(result, ['bar', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'slice', 1)
    })

    it('should return a shallow copy of the list starting at the specified negative index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.slice(-2)
      expect(result).not.toBe(list)
      expectListMatching(result, ['baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'slice', -2)
    })

    it('should return a shallow copy of the list starting at the specified index and ending at the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.slice(1, 3)
      expect(result).not.toBe(list)
      expectListMatching(result, ['bar', 'baz'])
    })

    it('should return a shallow copy of the list starting at the specified index and ending at the specified negative index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.slice(1, -1)
      expect(result).not.toBe(list)
      expectListMatching(result, ['bar', 'baz'])
    })
  })

  describe('splice', () => {
    describe('insert one element', () => {
      it('should default to inserting at the start of the list', () => {
        const list = createList(['bar', 'baz'])
        const result = list.splice(undefined, 0, 'foo')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['bar', 'baz'], 'splice', undefined, 0, 'foo')
      })

      it('should insert a new element at the start of the list', () => {
        const list = createList(['bar', 'baz'])
        const result = list.splice(0, 0, 'foo')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['bar', 'baz'], 'splice', 0, 0, 'foo')
      })

      it('should insert a new element at the end of the list', () => {
        const list = createList(['foo', 'bar'])
        const result = list.splice(2, 0, 'baz')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'bar'], 'splice', 2, 0, 'baz')
      })

      it('should insert a new element after the first element', () => {
        const list = createList(['foo', 'baz'])
        const result = list.splice(1, 0, 'bar')
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'baz'], 'splice', 1, 0, 'bar')
      })

      it('should insert a new element before the last element', () => {
        const list = createList(['foo', 'bar'])
        const result = list.splice(-1, 0, 'baz')
        expectListMatching(list, ['foo', 'baz', 'bar'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'bar'], 'splice', 1, 0, 'baz')
      })
    })

    describe('insert multiple elements', () => {
      it('should default to inserting at the start of the list', () => {
        const list = createList(['bar', 'baz'])
        const result = list.splice(undefined, 0, 'foo', 'qux')
        expectListMatching(list, ['foo', 'qux', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['bar', 'baz'], 'splice', undefined, 0, 'foo', 'qux')
      })

      it('should insert multiple elements at the start of the list', () => {
        const list = createList(['bar', 'baz'])
        const result = list.splice(0, 0, 'foo', 'qux')
        expectListMatching(list, ['foo', 'qux', 'bar', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['bar', 'baz'], 'splice', 0, 0, 'foo', 'qux')
      })

      it('should insert multiple elements at the end of the list', () => {
        const list = createList(['foo', 'bar'])
        const result = list.splice(2, 0, 'baz', 'qux')
        expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'bar'], 'splice', 2, 0, 'baz', 'qux')
      })

      it('should insert multiple elements after the first element', () => {
        const list = createList(['foo', 'baz'])
        const result = list.splice(1, 0, 'bar', 'qux')
        expectListMatching(list, ['foo', 'bar', 'qux', 'baz'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'baz'], 'splice', 1, 0, 'bar', 'qux')
      })

      it('should insert multiple elements before the last element', () => {
        const list = createList(['foo', 'qux'])
        const result = list.splice(-1, 0, 'bar', 'baz')
        expectListMatching(list, ['foo', 'bar', 'baz', 'qux'])
        expectListMatching(result, [])
        expectArrayBehaviour(['foo', 'qux'], 'splice', -1, 0, 'bar', 'baz')
      })
    })

    describe('delete one element', () => {
      it('should default to deleting the first element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(undefined, 1)
        expectListMatching(result, ['foo'])
        expectListMatching(list, ['bar', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', undefined, 1)
      })

      it('should delete the first element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(0, 1)
        expectListMatching(result, ['foo'])
        expectListMatching(list, ['bar', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 0, 1)
      })

      it('should delete the second element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(1, 1)
        expectListMatching(result, ['bar'])
        expectListMatching(list, ['foo', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 1, 1)
      })

      it('should delete the last element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(-1, 1)
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', -1, 1)
      })
    })

    describe('delete multiple elements', () => {
      it('should delete the first two elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(0, 2)
        expectListMatching(result, ['foo', 'bar'])
        expectListMatching(list, ['baz', 'qux'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', 0, 2)
      })

      it('should delete the last two elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(-2, 2)
        expectListMatching(result, ['baz', 'qux'])
        expectListMatching(list, ['foo', 'bar'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', -2, 2)
      })

      it('should delete the second and third elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(1, 2)
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo', 'qux'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', 1, 2)
      })
    })

    describe('replace one element', () => {
      it('should replace the first element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(0, 1, 'FOO')
        expectListMatching(result, ['foo'])
        expectListMatching(list, ['FOO', 'bar', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 0, 1, 'FOO')
      })

      it('should replace the last element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(-1, 1, 'BAZ')
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar', 'BAZ'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', -1, 1, 'BAZ')
      })

      it('should replace the second element', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(1, 1, 'BAR')
        expectListMatching(result, ['bar'])
        expectListMatching(list, ['foo', 'BAR', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 1, 1, 'BAR')
      })
    })

    describe('replace multiple elements', () => {
      it('should replace the first two elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(0, 2, 'FOO', 'BAR')
        expectListMatching(result, ['foo', 'bar'])
        expectListMatching(list, ['FOO', 'BAR', 'baz', 'qux'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', 0, 2, 'FOO', 'BAR')
      })

      it('should replace the last two elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(-2, 2, 'BAZ', 'QUX')
        expectListMatching(result, ['baz', 'qux'])
        expectListMatching(list, ['foo', 'bar', 'BAZ', 'QUX'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', -2, 2, 'BAZ', 'QUX')
      })

      it('should replace the second and third elements', () => {
        const list = createList(['foo', 'bar', 'baz', 'qux'])
        const result = list.splice(1, 2, 'BAR', 'BAZ')
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo', 'BAR', 'BAZ', 'qux'])
        expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'splice', 1, 2, 'BAR', 'BAZ')
      })
    })

    describe('edge cases', () => {
      it('should delete elements out of range from the start', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(0, 4)
        expectListMatching(result, ['foo', 'bar', 'baz'])
        expectListMatching(list, [])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 0, 4)
      })

      it('should delete elements out of range from the end', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(-1, 4)
        expectListMatching(result, ['baz'])
        expectListMatching(list, ['foo', 'bar'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', -1, 4)
      })

      it('should delete elements out of range from the middle', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(1, 4)
        expectListMatching(result, ['bar', 'baz'])
        expectListMatching(list, ['foo'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 1, 4)
      })

      it('should abort early if no elements are added or removed', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.splice(0, 0)
        expectListMatching(result, [])
        expectListMatching(list, ['foo', 'bar', 'baz'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'splice', 0, 0)
      })
    })
  })

  describe('reverse', () => {
    it('should reverse the elements of the list in place', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.reverse()
      expect(result).toBe(list)
      expectListMatching(list, ['baz', 'bar', 'foo'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'reverse')
    })

    it('should reverse the elements of an empty list', () => {
      const list = createList(0)
      const result = list.reverse()
      expect(result).toBe(list)
      expectListMatching(list, [])
      expectArrayBehaviour([], 'reverse')
    })
  })

  describe('sort', () => {
    describe('with a compare function', () => {
      it('should sort the elements of the list in place', () => {
        const list = createList([3, 1, 5, 8, 10, -5, 4, 2])
        const result = list.sort((a, b) => a - b)
        expect(result).toBe(list)
        expectListMatching(list, [-5, 1, 2, 3, 4, 5, 8, 10])
        expectArrayBehaviour([3, 1, 5, 8, 10, -5, 4, 2], 'sort', (a: number, b: number) => b - a)
      })

      it('should keep a sorted list unchanged', () => {
        const list = createList([1, 2, 3])
        const result = list.sort((a, b) => a - b)
        expect(result).toBe(list)
        expectListMatching(list, [1, 2, 3])
        expectArrayBehaviour([1, 2, 3], 'sort', (a: number, b: number) => a - b)
      })

      it('should abort early if the list is empty', () => {
        const list = createList<number>(0)
        const result = list.sort((a, b) => a - b)
        expect(result).toBe(list)
        expectListMatching(list, [])
        expectArrayBehaviour([], 'sort', (a: number, b: number) => a - b)
      })
    })

    describe('without a compare function', () => {
      it('should sort the elements of the list in place', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const result = list.sort()
        expect(result).toBe(list)
        expectListMatching(list, ['bar', 'baz', 'foo'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'sort')
      })

      it('should keep a sorted list unchanged', () => {
        const list = createList(['bar', 'baz', 'foo'])
        const result = list.sort()
        expect(result).toBe(list)
        expectListMatching(list, ['bar', 'baz', 'foo'])
        expectArrayBehaviour(['foo', 'bar', 'baz'], 'sort')
      })

      it('should abort early if the list is empty', () => {
        const list = createList<string>(0)
        const result = list.sort()
        expect(result).toBe(list)
        expectListMatching(list, [])
        expectArrayBehaviour([], 'sort')
      })
    })
  })

  describe('indexOf', () => {
    it('should return the index of the first occurrence of an element', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.indexOf('baz')
      expect(result).toBe(2)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'indexOf', 'baz')
    })

    it('should return -1 if the element is not found', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.indexOf('corge')
      expect(result).toBe(-1)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'indexOf', 'corge')
    })

    it('should return the index of the first occurrence of an element starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux', 'baz'])
      const result = list.indexOf('baz', 3)
      expect(result).toBe(4)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux', 'baz'], 'indexOf', 'baz', 3)
    })

    it('should return -1 if the element is not found starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux', 'baz'])
      const result = list.indexOf('corge', 3)
      expect(result).toBe(-1)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux', 'baz'], 'indexOf', 'corge', 3)
    })

    it('should return -1 if the specified index is out of range', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.indexOf('baz', 4)
      expect(result).toBe(-1)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'indexOf', 'baz', 4)
    })
  })

  describe('lastIndexOf', () => {
    it('should return the index of the last occurrence of an element', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux', 'baz'])
      const result = list.lastIndexOf('baz')
      expect(result).toBe(4)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux', 'baz'], 'lastIndexOf', 'baz')
    })

    it('should return -1 if the element is not found', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.lastIndexOf('corge')
      expect(result).toBe(-1)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'lastIndexOf', 'corge')
    })

    it('should return the index of the last occurrence of an element starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux', 'baz'])
      const result = list.lastIndexOf('baz', 3)
      expect(result).toBe(2)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux', 'baz'], 'lastIndexOf', 'baz', 3)
    })

    it('should return -1 if the element is not found starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux', 'baz'])
      const result = list.lastIndexOf('corge', 3)
      expect(result).toBe(-1)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux', 'baz'], 'lastIndexOf', 'corge', 3)
    })

    it('should return then index if the specified index is out of range', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.lastIndexOf('baz', 4)
      expect(result).toBe(2)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'lastIndexOf', 'baz', 4)
    })
  })

  describe('every', () => {
    it('should return true if all elements pass the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.every(value => typeof value === 'string')
      expect(result).toBe(true)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'every', (value: string) => typeof value === 'string')
    })

    it('should return false if any element fails the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.every(value => value.length > 3)
      expect(result).toBe(false)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'every', (value: string) => value.length > 3)
    })

    it('should return true for an empty list', () => {
      const list = createList(0)
      const result = list.every(() => false)
      expect(result).toBe(true)
      expectArrayBehaviour([], 'every', () => false)
    })
  })

  describe('some', () => {
    it('should return true if any element passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.some(value => value.length > 1)
      expect(result).toBe(true)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'some', (value: string) => value.length > 1)
    })

    it('should return false if all elements fail the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.some(value => typeof value === 'number')
      expect(result).toBe(false)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'some', (value: string) => typeof value === 'number')
    })

    it('should return false for an empty list', () => {
      const list = createList(0)
      const result = list.some(() => true)
      expect(result).toBe(false)
      expectArrayBehaviour([], 'some', () => true)
    })
  })

  describe('forEach', () => {
    it('should iterate over each element in the list', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn()
      list.forEach(callback)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 'baz', 2, list)
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.forEach(callback, thisArgument)
    })

    it('should iterate over each element in an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      list.forEach(callback)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('map', () => {
    it('should return a new list with the results of applying the callback to each element', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.toUpperCase())
      const result = list.map(callback)
      expect(result).not.toBe(list)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 'baz', 2, list)
      expectListMatching(result, ['FOO', 'BAR', 'BAZ'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'map', (value: string) => value.toUpperCase())
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn()
      list.map(callback, thisArgument)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 'baz', 2, list)
    })

    it('should return an empty list for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.map(callback)
      expect(callback).not.toHaveBeenCalled()
      expectListMatching(result, [])
    })
  })

  describe('filter', () => {
    it('should return a new list with elements that pass the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.startsWith('b'))
      const result = list.filter(callback)
      expect(result).not.toBe(list)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 'baz', 2, list)
      expectListMatching(result, ['bar', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'filter', (value: string) => value.startsWith('b'))
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.filter(callback, thisArgument)
    })

    it('should return an empty list for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.filter(callback)
      expect(callback).not.toHaveBeenCalled()
      expectListMatching(result, [])
    })
  })

  describe('reduce', () => {
    it('should return the accumulated value from left to right', () => {
      const list = createList([1, 2, 3])
      const callback = vi.fn((accumulator: number, value: number) => accumulator + value)
      const result = list.reduce(callback, 0)
      expect(result).toBe(6)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 0, 1, 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 1, 2, 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 3, 3, 2, list)
      expectArrayBehaviour([1, 2, 3], 'reduce', (accumulator: number, value: number) => accumulator + value, 0)
    })

    it('should return the initial value for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.reduce(callback, 0)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(0)
    })

    it('should return the first element for a single element list without an initial value', () => {
      const list = createList([42])
      const callback = vi.fn()
      const result = list.reduce(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(42)
      expectArrayBehaviour([42], 'reduce', callback)
    })

    it('should throw an error for an empty list without an initial value', () => {
      const list = createList(0)
      const callback = vi.fn()
      const shouldThrow = () => list.reduce(callback)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Reduce of empty list with no initial value')
    })
  })

  describe('reduceRight', () => {
    it('should return the accumulated value from right to left', () => {
      const list = createList([1, 2, 3])
      const callback = vi.fn((accumulator: number, value: number) => accumulator + value)
      const result = list.reduceRight(callback, 0)
      expect(result).toBe(6)
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 0, 3, 2, list)
      expect(callback).toHaveBeenNthCalledWith(2, 3, 2, 1, list)
      expect(callback).toHaveBeenNthCalledWith(3, 5, 1, 0, list)
      expectArrayBehaviour([1, 2, 3], 'reduceRight', (accumulator: number, value: number) => accumulator + value, 0)
    })

    it('should return the initial value for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.reduceRight(callback, 0)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(0)
    })

    it('should return the first element for a single element list without an initial value', () => {
      const list = createList([42])
      const callback = vi.fn()
      const result = list.reduceRight(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(42)
      expectArrayBehaviour([42], 'reduceRight', callback)
    })

    it('should throw an error for an empty list without an initial value', () => {
      const list = createList(0)
      const callback = vi.fn()
      const shouldThrow = () => list.reduceRight(callback)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Reduce of empty list with no initial value')
    })
  })

  describe('find', () => {
    it('should return the first element that passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.startsWith('b'))
      const result = list.find(callback)
      expect(result).toBe('bar')
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'find', (value: string) => value.startsWith('b'))
    })

    it('should return undefined if no element passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn(() => false)
      const result = list.find(callback)
      expect(result).toBeUndefined()
      expect(callback).toHaveBeenCalledTimes(3)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'find', (value: string) => value.startsWith('z'))
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.find(callback, thisArgument)
    })

    it('should return undefined for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.find(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe('includes', () => {
    it('should return true if the list contains the element', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.includes('bar')
      expect(result).toBe(true)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'includes', 'bar')
    })

    it('should return false if the list does not contain the element', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.includes('qux')
      expect(result).toBe(false)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'includes', 'qux')
    })

    it('should return true if the list contains the element starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.includes('baz', 2)
      expect(result).toBe(true)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'includes', 'baz', 2)
    })

    it('should return false if the list does not contain the element starting from the specified index', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.includes('bar', 2)
      expect(result).toBe(false)
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'includes', 'bar', 2)
    })

    it('should return false if the specified index is out of range', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.includes('baz', 3)
      expect(result).toBe(false)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'includes', 'baz', 3)
    })
  })

  describe('findIndex', () => {
    it('should return the index of the first element that passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.startsWith('b'))
      const result = list.findIndex(callback)
      expect(result).toBe(1)
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 'foo', 0, list)
      expect(callback).toHaveBeenNthCalledWith(2, 'bar', 1, list)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findIndex', (value: string) => value.startsWith('b'))
    })

    it('should return -1 if no element passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn(() => false)
      const result = list.findIndex(callback)
      expect(result).toBe(-1)
      expect(callback).toHaveBeenCalledTimes(3)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findIndex', (value: string) => value.startsWith('z'))
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.findIndex(callback, thisArgument)
    })

    it('should return -1 for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.findIndex(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(-1)
    })
  })

  describe('fill', () => {
    it('should fill the entire list with the specified value', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux')
      expect(result).toBe(list)
      expectListMatching(list, ['qux', 'qux', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux')
    })

    it('should fill a range of the list with the specified start', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux', 1)
      expect(result).toBe(list)
      expectListMatching(list, ['foo', 'qux', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux', 1)
    })

    it('should fill a range of the list with the specified end', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux', 0, 2)
      expect(result).toBe(list)
      expectListMatching(list, ['qux', 'qux', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux', 0, 2)
    })

    it('should fill a range of the list with the specified start and end', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux', 1, 2)
      expect(result).toBe(list)
      expectListMatching(list, ['foo', 'qux', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux', 1, 2)
    })

    it('should fill a range of the list with the specified value starting from the end', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux', -2, -1)
      expect(result).toBe(list)
      expectListMatching(list, ['foo', 'qux', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux', -2, -1)
    })

    it('should fill the entire list with the specified value starting from the end', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.fill('qux', -3)
      expect(result).toBe(list)
      expectListMatching(list, ['qux', 'qux', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'fill', 'qux', -3)
    })
  })

  describe('copyWithin', () => {
    it('should copy a range of the list to the specified target with a specified end', () => {
      // const list = createList(['foo', 'bar', 'baz', 'qux'])
      // const result = list.copyWithin(1, 2, 3)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'baz', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1, 2, 3)
    })

    it('should copy a range of the list to the specified target', () => {
      // const list = createList(['foo', 'bar', 'baz', 'qux'])
      // const result = list.copyWithin(1, 2)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'baz', 'qux', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1, 2)
    })

    it('should copy an overlapping range of the list to the specified target', () => {
      // const list = createList(['foo', 'bar', 'baz', 'qux'])
      // const result = list.copyWithin(1, 0, 2)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'foo', 'bar', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1, 0, 2)
    })

    it('should copy the entire list to the specified target', () => {
      // const list = createList(['foo', 'bar', 'baz'])
      // const result = list.copyWithin(1)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'foo', 'bar'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1)
    })

    it('should copy a range of the list to the specified target starting from the end', () => {
      // const list = createList(['foo', 'bar', 'baz', 'qux'])
      // const result = list.copyWithin(1, -2)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'baz', 'qux', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1, -2)
    })

    it('should copy a range of the list to the specified target with a specified end starting from the end', () => {
      // const list = createList(['foo', 'bar', 'baz', 'qux'])
      // const result = list.copyWithin(1, -2, -1)
      // expect(result).toBe(list)
      // expectListMatching(list, ['foo', 'baz', 'baz', 'qux'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'copyWithin', 1, -2, -1)
    })
  })

  describe('flat', () => {
    describe('nested arrays', () => {
      it('should flatten the list by one level', () => {
        const list = createList(['foo', ['bar', 'baz'], 'qux'])
        const result = list.flat()
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
        expectArrayBehaviour(['foo', ['bar', 'baz'], 'qux'], 'flat')
      })

      it('should flatten the list by multiple levels', () => {
        const list = createList(['foo', ['bar', ['baz', 'qux']], 'corge'])
        const result = list.flat(2)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux', 'corge'])
        expectArrayBehaviour(['foo', ['bar', ['baz', 'qux']], 'corge'], 'flat', 2)
      })

      it('should flatten the list by an infinite number of levels', () => {
        const list = createList(['foo', ['bar', ['baz', ['qux']]], 'corge'])
        const result = list.flat(Number.POSITIVE_INFINITY)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux', 'corge'])
        expectArrayBehaviour(['foo', ['bar', ['baz', ['qux']]], 'corge'], 'flat', Number.POSITIVE_INFINITY)
      })

      it('should remove empty arrays from the list', () => {
        const list = createList(['foo', [], 'bar', [], 'baz'])
        const result = list.flat()
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz'])
        expectArrayBehaviour(['foo', [], 'bar', [], 'baz'], 'flat')
      })

      it('should remove empty arrays from the list by multiple levels', () => {
        const list = createList(['foo', ['bar', [], 'baz'], 'qux'])
        const result = list.flat(2)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
        expectArrayBehaviour(['foo', ['bar', [], 'baz'], 'qux'], 'flat', 2)
      })
    })

    describe('nested lists', () => {
      it('should flatten the list by one level', () => {
        const list = createList(['foo', createList(['bar', 'baz']), 'qux'])
        const result = list.flat()
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      })

      it('should flatten the list by multiple levels', () => {
        const list = createList(['foo', createList(['bar', createList(['baz', 'qux'])]), 'corge'])
        const result = list.flat(2)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux', 'corge'])
      })

      it('should flatten the list by an infinite number of levels', () => {
        const list = createList(['foo', createList(['bar', createList(['baz', createList(['qux'])])]), 'corge'])
        const result = list.flat(Number.POSITIVE_INFINITY)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux', 'corge'])
      })

      it('should remove empty lists from the list', () => {
        const list = createList(['foo', createList(0), 'bar', createList(0), 'baz'])
        const result = list.flat()
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz'])
      })

      it('should remove empty lists from the list by multiple levels', () => {
        const list = createList(['foo', createList(['bar', createList(0), 'baz']), 'qux'])
        const result = list.flat(2)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      })
    })
  })

  describe('flatMap', () => {
    describe('nested arrays', () => {
      it('should map and flatten the list by one level', () => {
        const list = createList(['foo', ['bar', 'baz'], 'qux'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
        expectArrayBehaviour(['foo', ['bar', 'baz'], 'qux'], 'flatMap', callback)
      })

      it('should use the `thisArg` for the callback', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const thisArgument = {}
        const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
        list.flatMap(callback, thisArgument)
      })

      it('should only flatten the list by one level', () => {
        const list = createList(['foo', ['bar', ['baz', 'qux']], 'corge'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', ['baz', 'qux'], 'corge'])
        expectArrayBehaviour(['foo', ['bar', ['baz', 'qux']], 'corge'], 'flatMap', callback)
      })

      it('should remove empty arrays from the list', () => {
        const list = createList(['foo', [], 'bar', [], 'baz'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz'])
        expectArrayBehaviour(['foo', [], 'bar', [], 'baz'], 'flatMap', callback)
      })
    })

    describe('nested lists', () => {
      it('should map and flatten the list by one level', () => {
        const list = createList(['foo', createList(['bar', 'baz']), 'qux'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz', 'qux'])
      })

      it('should use the `thisArg` for the callback', () => {
        const list = createList(['foo', 'bar', 'baz'])
        const thisArgument = {}
        const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
        list.flatMap(callback, thisArgument)
      })

      it('should only flatten the list by one level', () => {
        const list = createList(['foo', createList(['bar', createList(['baz', 'qux'])]), 'corge'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', createList(['baz', 'qux']), 'corge'])
      })

      it('should remove empty lists from the list', () => {
        const list = createList(['foo', createList(0), 'bar', createList(0), 'baz'])
        const callback = vi.fn((v: unknown) => v)
        const result = list.flatMap(callback)
        expect(result).not.toBe(list)
        expectListMatching(result, ['foo', 'bar', 'baz'])
      })
    })
  })

  describe('with', () => {
    it('should return a list with the specified element set at the specified index', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.with(1, 'qux')
      expect(result).not.toBe(list)
      expectListMatching(result, ['foo', 'qux', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'with', 1, 'qux')
    })
  })

  describe('findLast', () => {
    it('should return the last element that passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.startsWith('b'))
      const result = list.findLast(callback)
      expect(result).toBe('baz')
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenNthCalledWith(1, 'baz', 2, list)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findLast', (value: string) => value.startsWith('b'))
    })

    it('should return undefined if no element passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn(() => false)
      const result = list.findLast(callback)
      expect(result).toBeUndefined()
      expect(callback).toHaveBeenCalledTimes(3)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findLast', (value: string) => value.startsWith('z'))
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.findLast(callback, thisArgument)
    })

    it('should return undefined for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.findLast(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe('findLastIndex', () => {
    it('should return the index of the last element that passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn((value: string) => value.startsWith('b'))
      const result = list.findLastIndex(callback)
      expect(result).toBe(2)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenNthCalledWith(1, 'baz', 2, list)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findLastIndex', callback)
    })

    it('should return -1 if no element passes the test', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const callback = vi.fn(() => false)
      const result = list.findLastIndex(callback)
      expect(result).toBe(-1)
      expect(callback).toHaveBeenCalledTimes(3)
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'findLastIndex', (value: string) => value.startsWith('z'))
    })

    it('should pass the `thisArg` to the callback', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const thisArgument = {}
      const callback = vi.fn(function(this: any) { expect(this).toBe(thisArgument) })
      list.findLastIndex(callback, thisArgument)
    })

    it('should return -1 for an empty list', () => {
      const list = createList(0)
      const callback = vi.fn()
      const result = list.findLastIndex(callback)
      expect(callback).not.toHaveBeenCalled()
      expect(result).toBe(-1)
    })
  })

  describe('toReversed', () => {
    it('should return a reversed list', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.toReversed()
      expect(result).not.toBe(list)
      expectListMatching(result, ['baz', 'bar', 'foo'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'toReversed')
    })
  })

  describe('toSorted', () => {
    it('should return a sorted list', () => {
      const list = createList([3, 1, 2])
      const result = list.toSorted()
      expect(result).not.toBe(list)
      expectListMatching(result, [1, 2, 3])
      expectArrayBehaviour([3, 1, 2], 'toSorted')
    })

    it('should return a sorted list using a custom comparator', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const result = list.toSorted((a, b) => a.length - b.length)
      expect(result).not.toBe(list)
      expectListMatching(result, ['foo', 'bar', 'baz'])
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'toSorted', (a: string, b: string) => a.length - b.length)
    })
  })

  describe('toSliced', () => {
    it('should return a sliced list', () => {
      const list = createList(['foo', 'bar', 'baz', 'qux'])
      const result = list.toSpliced(1, 3)
      expect(result).not.toBe(list)
      expectListMatching(result, ['foo'])
      expectArrayBehaviour(['foo', 'bar', 'baz', 'qux'], 'toSpliced', 1, 3)
    })
  })

  describe('entries iterator', () => {
    it('should return an iterator over the index-value pairs', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const iterator = list.entries()
      expect(iterator.next()).toEqual({ value: [0, 'foo'], done: false })
      expect(iterator.next()).toEqual({ value: [1, 'bar'], done: false })
      expect(iterator.next()).toEqual({ value: [2, 'baz'], done: false })
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })

    it('should return an empty iterator for an empty list', () => {
      const list = createList(0)
      const iterator = list.entries()
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('keys iterator', () => {
    it('should return an iterator over the indices', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const iterator = list.keys()
      expect(iterator.next()).toEqual({ value: 0, done: false })
      expect(iterator.next()).toEqual({ value: 1, done: false })
      expect(iterator.next()).toEqual({ value: 2, done: false })
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })

    it('should return an empty iterator for an empty list', () => {
      const list = createList(0)
      const iterator = list.keys()
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('values iterator', () => {
    it('should return an iterator over the values', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const iterator = list.values()
      expect(iterator.next()).toEqual({ value: 'foo', done: false })
      expect(iterator.next()).toEqual({ value: 'bar', done: false })
      expect(iterator.next()).toEqual({ value: 'baz', done: false })
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })

    it('should return an empty iterator for an empty list', () => {
      const list = createList(0)
      const iterator = list.values()
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('Symbol.iterator', () => {
    it('should return an iterator over the values', () => {
      const list = createList(['foo', 'bar', 'baz'])
      const iterator = list[Symbol.iterator]()
      expect(iterator.next()).toEqual({ value: 'foo', done: false })
      expect(iterator.next()).toEqual({ value: 'bar', done: false })
      expect(iterator.next()).toEqual({ value: 'baz', done: false })
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })

    it('should return an empty iterator for an empty list', () => {
      const list = createList(0)
      const iterator = list[Symbol.iterator]()
      expect(iterator.next()).toEqual({ value: undefined, done: true })
    })
  })

  describe('toString', () => {
    it('should return a string representation of the list', () => {
      const result = createList(['foo', 'bar', 'baz']).toString()
      expect(result).toBe('foo,bar,baz')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'toString')
    })

    it('should return an empty string for an empty list', () => {
      const result = createList(0).toString()
      expect(result).toBe('')
      expectArrayBehaviour([], 'toString')
    })
  })

  describe('toLocaleString', () => {
    it('should return a localized string representation of the list', () => {
      const result = createList(['foo', 'bar', 'baz']).toLocaleString()
      expect(result).toBe('foo,bar,baz')
      expectArrayBehaviour(['foo', 'bar', 'baz'], 'toLocaleString')
    })

    it('should convert each element to a string using `toLocaleString`', () => {
      vi.useFakeTimers({ now: new Date(2020, 0, 1) })
      const list = createList([new Date(2020, 0, 1), 42])
      const result = list.toLocaleString()
      expect(result).toBe('1/1/2020, 12:00:00 AM,42')
      expectArrayBehaviour([new Date(2020, 0, 1), 42], 'toLocaleString')
      vi.useRealTimers()
    })

    it('should return an empty string for an empty list', () => {
      const result = createList(0).toLocaleString()
      expect(result).toBe('')
      expectArrayBehaviour([], 'toLocaleString')
    })
  })

  describe('Symbol.toPrimitive', () => {
    it('should implicitly stringify the list', () => {
      // oxlint-disable-next-line @typescript-eslint/restrict-template-expressions
      const result = `${createList(['foo', 'bar', 'baz'])}`
      expect(result).toBe('[ foo, bar, baz ]')
    })
  })
})
