
import { expect, it } from 'vitest'
import { mapValues } from '../collection'
import { validateSchema } from './validateSchema'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value >= n
const isEqToFoo = function(this: any, value: number) { return value === this.foo }
const toUpperCase = (value: string): string => value.toUpperCase()

const object = {
  foo: 'bar',
  bar: 10,
  baz: 'baz',
  qux: 'qux',
  quux: 'quux',
}

it.each([

  // --- Validate and transform (passes).
  [object, {
    foo: [isRequired, isEqToFoo],
    bar: [isRequired, [isGreater, 0]],
    baz: [[isGreater], [isRequired, toUpperCase]],
    qux: isRequired,
  }, {
    failed: { foo: [], bar: [], baz: ['isGreater'], qux: [] },
    valid: {
      foo: ['isRequired', 'isEqToFoo'],
      bar: ['isRequired', 'isGreater'],
      baz: ['isRequired', 'toUpperCase'],
      qux: ['isRequired'],
    },
    errors: { foo: undefined, bar: undefined, baz: undefined, qux: undefined },
    value: { foo: 'bar', bar: 10, baz: 'BAZ', qux: 'qux', quux: 'quux' },
    isValid: true,
    areValid: { foo: true, bar: true, baz: true, qux: true },
  }],

  // --- Validate and transform (fails).
  [object, {
    foo: [isRequired, isEqToFoo],
    bar: [isRequired, [isGreater, 20]],
    baz: [[isGreater], [isRequired, toUpperCase]],
    qux: isRequired,
  }, {
    failed: { foo: [], bar: ['isGreater'], baz: ['isGreater'], qux: [] },
    valid: {
      foo: ['isRequired', 'isEqToFoo'],
      bar: ['isRequired'],
      baz: ['isRequired', 'toUpperCase'],
      qux: ['isRequired'],
    },
    errors: {
      foo: undefined,
      bar: 'Failed rule: isGreater',
      baz: undefined,
      qux: undefined,
    },
    value: { foo: 'bar', bar: 10, baz: 'BAZ', qux: 'qux', quux: 'quux' },
    isValid: false,
    areValid: { foo: true, bar: false, baz: true, qux: true },
  }],

])('should validate %s with %s', async(value: any, schema: any, expected: any) => {
  const result = await validateSchema(value, schema, { foo: 'bar' }).catch((error: any) => error.message)

  // --- Clean up result.
  delete result.results
  result.errors = mapValues(result.errors, (error: any) => error?.message)

  expect(result).toEqual(expected)
})
