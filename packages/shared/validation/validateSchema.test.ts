
import { expect, it } from 'vitest'
import { ValidationSchema } from './types'
import { validateSchema } from './validateSchema'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value >= n
const isEqToFoo = (value: number, a: any, context: any): boolean => value === context.foo
const toUpperCase = (value: string): string => value.toUpperCase()

const object = {
  foo: 'foo',
  bar: 10,
  baz: 'baz',
  fou: 'fou',
}

it('should validate an object against a validation schema', async() => {
  const schema: ValidationSchema = {
    foo: [isRequired, isEqToFoo],
    bar: [isRequired, [isGreater, 0]],
    baz: [isRequired, toUpperCase],
  }
  const result = await validateSchema(object, schema, { foo: 'foo' })
  expect(result.isValid).toEqual(true)
  expect(result.errors).toEqual({ foo: [], bar: [], baz: [] })
  expect(result.failed).toEqual({ foo: [], bar: [], baz: [] })
  expect(result.valid.foo).toEqual(['isRequired', 'isEqToFoo'])
  expect(result.valid.bar).toEqual(['isRequired', 'isGreater'])
  expect(result.valid.baz).toEqual(['isRequired', 'toUpperCase'])
  expect(result.valid.fou).toBeUndefined()
  expect(result.value).toEqual({
    foo: 'foo',
    bar: 10,
    baz: 'BAZ',
    fou: 'fou',
  })
})

it('should transform valid fields even if validation failed', async() => {
  const schema: ValidationSchema = {
    foo: [isRequired, isEqToFoo],
    bar: [isRequired, [isGreater, 20]],
    baz: [isRequired, toUpperCase],
  }
  const result = await validateSchema(object, schema, { foo: 'foo' })
  expect(result.isValid).toEqual(false)
  expect(result.errors).toEqual({ foo: [], bar: ['isGreater'], baz: [] })
  expect(result.failed).toEqual({ foo: [], bar: ['isGreater'], baz: [] })
  expect(result.valid.foo).toEqual(['isRequired', 'isEqToFoo'])
  expect(result.valid.bar).toEqual(['isRequired'])
  expect(result.valid.baz).toEqual(['isRequired', 'toUpperCase'])
  expect(result.valid.fou).toBeUndefined()
  expect(result.value).toEqual({
    foo: 'foo',
    bar: 10,
    baz: 'BAZ',
    fou: 'fou',
  })
})
