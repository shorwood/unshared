
import { expect, it } from 'vitest'
import { validateRules } from './validateRules'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value > n
const isLower = (value: number, n: number): boolean => value < n
const isEqToFoo = (value: number, a: any, context: any): boolean => value === context.foo
const toUpperCase = (value: string): string => value.toUpperCase()

it('should pass an array of rules when valid', async() => {
  const result = await validateRules(5, [isRequired, [isGreater, 0], [isLower, 10]])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isRequired', 'isGreater', 'isLower'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should fail an array of rules when invalid', async() => {
  const result = await validateRules(20, [isRequired, [isGreater, 0], [isLower, 10]])
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual(['isRequired', 'isGreater'])
  expect(result.failed).toEqual(['isLower'])
  expect(result.errors).toEqual(['isLower'])
  expect(result.value).toBe(20)
  expect(result.results).toBeTypeOf('object')
})

it('should pass and array of tranformation  when valid', async() => {
  const result = await validateRules('foo', [toUpperCase])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['toUpperCase'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe('FOO')
  expect(result.results).toBeTypeOf('object')
})

it('should pass and array of mixed rules and transformation  when valid', async() => {
  const result = await validateRules('foo', [isRequired, toUpperCase])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isRequired', 'toUpperCase'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe('FOO')
  expect(result.results).toBeTypeOf('object')
})

it('should fail an array of mixed rules and transformation when invalid', async() => {
  const result = await validateRules(0, [isRequired, toUpperCase])
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual([])
  expect(result.failed).toEqual(['isRequired'])
  expect(result.errors).toEqual(['isRequired'])
  expect(result.value).toBe(0)
  expect(result.results).toBeTypeOf('object')
})

it('should pass a single rule when valid', async() => {
  const result = await validateRules(5, isRequired)
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isRequired'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should fail a single rule when invalid', async() => {
  const result = await validateRules(0, isRequired)
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual([])
  expect(result.failed).toEqual(['isRequired'])
  expect(result.errors).toEqual(['isRequired'])
  expect(result.value).toBe(0)
  expect(result.results).toBeTypeOf('object')
})

it('should pass a single transformation rule when valid', async() => {
  const result = await validateRules('foo', toUpperCase)
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['toUpperCase'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe('FOO')
  expect(result.results).toBeTypeOf('object')
})

it('should pass a mixed rule and transformation rule when valid', async() => {
  const result = await validateRules('foo', [isRequired, toUpperCase])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isRequired', 'toUpperCase'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe('FOO')
  expect(result.results).toBeTypeOf('object')
})

it('should fail a mixed rule and transformation rule when invalid', async() => {
  const result = await validateRules('', [toUpperCase, [isRequired, undefined, 'Value is required']])
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual(['toUpperCase'])
  expect(result.failed).toEqual(['isRequired'])
  expect(result.errors).toEqual(['Value is required'])
  expect(result.value).toBe('')
  expect(result.results).toBeTypeOf('object')
})

it('should pass a single rule with context when valid', async() => {
  const result = await validateRules(5, [isRequired, isEqToFoo], { foo: 5 })
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isRequired', 'isEqToFoo'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should fail a single rule with context when invalid', async() => {
  const result = await validateRules(5, [isRequired, isEqToFoo], { foo: 10 })
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual(['isRequired'])
  expect(result.failed).toEqual(['isEqToFoo'])
  expect(result.errors).toEqual(['isEqToFoo'])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should pass a single rule with argument when valid', async() => {
  const result = await validateRules(5, [isGreater, 0])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isGreater'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should fail a single rule with argument when invalid', async() => {
  const result = await validateRules(5, [isGreater, 10])
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual([])
  expect(result.failed).toEqual(['isGreater'])
  expect(result.errors).toEqual(['isGreater'])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should pass a single rule with argument and message when valid', async() => {
  const result = await validateRules(5, [isGreater, 0])
  expect(result.isValid).toBeTruthy()
  expect(result.isInvalid).toBeFalsy()
  expect(result.valid).toEqual(['isGreater'])
  expect(result.failed).toEqual([])
  expect(result.errors).toEqual([])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})

it('should fail a single rule with argument and message when invalid', async() => {
  const result = await validateRules(5, [isGreater, 10, 'Must be greater than 10'])
  expect(result.isValid).toBeFalsy()
  expect(result.isInvalid).toBeTruthy()
  expect(result.valid).toEqual([])
  expect(result.failed).toEqual(['isGreater'])
  expect(result.errors).toEqual(['Must be greater than 10'])
  expect(result.value).toBe(5)
  expect(result.results).toBeTypeOf('object')
})
