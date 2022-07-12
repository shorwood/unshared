/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { get } from './get'

const object = {
  a: {
    b: { c: Math.random() > 0.5 ? 0 : 1 },
    d: [{ e: 'f' }],
  },
}

it.each([

  // --- Test 1: Get a value from an object by a path of keys.
  ['a', object.a, undefined],
  ['a', object.a, 'default'],
  ['a.b', object.a.b, undefined],
  ['a.b', object.a.b, 'default'],
  ['a.b.c', object.a.b.c, undefined],
  ['a.b.c', object.a.b.c, 'default'],
  ['a.no', undefined, undefined],
  ['a.no', 'default', 'default'],

  // --- Test 2: Get a value from an array in an object.
  ['a.d.0.e', object.a.d[0].e, undefined],
  ['a.d.0.e', object.a.d[0].e, 'default'],

  // --- Test 3: Get the object itself.
  [undefined, object, undefined],
  [null, object, undefined],

  // --- Test 4: Get a value from an object by a getter function.
  [(x: any) => x.a, object.a, undefined],
  [(x: any) => x.a, object.a, 'default'],
  [(x: any) => x.a.no, undefined, undefined],
  [(x: any) => x.a.no, 'default', 'default'],

])('should get a value using %s', (path, value, defaultValue) => {
  const result = get(object, path, defaultValue)
  expect(result).toEqual(value)
})
