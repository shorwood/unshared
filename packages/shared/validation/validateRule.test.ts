import { expect, it } from 'vitest'
import { ValidateRuleResult } from './types'
import { validateRule } from './validateRule'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value >= n
const isEqToFoo = (value: number, a: any, context: any): boolean => value === context.foo
const toUpperCase = (value: string): string => value.toUpperCase()

it('should pass a validation rule when valid', async() => {
  const value = 'value'
  const rule: ValidateRuleResult = await validateRule(value, isRequired)
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeTruthy()
  expect(rule.isInvalid).toBeFalsy()
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toBe('isRequired')
  expect(rule.handler).toBe(isRequired)
  expect(rule.args).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should fail a validation rule when invalid', async() => {
  const value = ''
  const rule: ValidateRuleResult = await validateRule(value, [isRequired, undefined, 'Invalid value'])
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeFalsy()
  expect(rule.isInvalid).toBeTruthy()
  expect(rule.errorMessage).toBe('Invalid value')
  expect(rule.name).toBe('isRequired')
  expect(rule.handler).toBe(isRequired)
  expect(rule.args).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should pass a transformation rule when valid and provide a transformed value', async() => {
  const value = 'foo'
  const rule: ValidateRuleResult = await validateRule(value, toUpperCase)
  expect(rule.value).toBe('FOO')
  expect(rule.isValid).toBeTruthy()
  expect(rule.isInvalid).toBeFalsy()
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toBe('toUpperCase')
  expect(rule.handler).toBe(toUpperCase)
  expect(rule.args).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should fail a transformation rule when runtime error occured', async() => {
  const value = undefined
  const rule: ValidateRuleResult = await validateRule(value, [toUpperCase, undefined, 'Invalid value'])
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeFalsy()
  expect(rule.isInvalid).toBeTruthy()
  expect(rule.errorMessage).toBe('Cannot read properties of undefined (reading \'toUpperCase\')')
  expect(rule.name).toBe('toUpperCase')
  expect(rule.handler).toBe(toUpperCase)
  expect(rule.args).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should pass a rule with arguments when valid and provide a transformed value', async() => {
  const value = 10
  const rule: ValidateRuleResult = await validateRule(value, [isGreater, 5])
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeTruthy()
  expect(rule.isInvalid).toBeFalsy()
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toBe('isGreater')
  expect(rule.handler).toBe(isGreater)
  expect(rule.args).toBe(5)
  expect(rule.context).toBeUndefined()
})

it('should fail a rule with arguments when invalid and provide a transformed value', async() => {
  const value = 10
  const rule: ValidateRuleResult = await validateRule(value, [isGreater, 20, 'Invalid value'])
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeFalsy()
  expect(rule.isInvalid).toBeTruthy()
  expect(rule.errorMessage).toBe('Invalid value')
  expect(rule.name).toBe('isGreater')
  expect(rule.handler).toBe(isGreater)
  expect(rule.args).toBe(20)
  expect(rule.context).toBeUndefined()
})

it('should pass a rule when valid and provided a context', async() => {
  const value = 'bar'
  const context = { foo: 'bar' }
  const rule: ValidateRuleResult = await validateRule(value, isEqToFoo, context)
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeTruthy()
  expect(rule.isInvalid).toBeFalsy()
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toBe('isEqToFoo')
  expect(rule.handler).toBe(isEqToFoo)
  expect(rule.context).toEqual(context)
})

it('should fail a rule when invalid and provided a context', async() => {
  const value = 'not-bar'
  const context = { foo: 'bar' }
  const rule: ValidateRuleResult = await validateRule(value, [isEqToFoo, undefined, 'Invalid value'], context)
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeFalsy()
  expect(rule.isInvalid).toBeTruthy()
  expect(rule.errorMessage).toBe('Invalid value')
  expect(rule.name).toBe('isEqToFoo')
  expect(rule.handler).toBe(isEqToFoo)
  expect(rule.context).toEqual(context)
})

it('should fail a rule when valid but context not provided ', async() => {
  const value = 'bar'
  const rule: ValidateRuleResult = await validateRule(value, [isEqToFoo, undefined, 'Invalid value'])
  expect(rule.value).toBe(value)
  expect(rule.isValid).toBeFalsy()
  expect(rule.isInvalid).toBeTruthy()
  expect(rule.errorMessage).toBe('Cannot read properties of undefined (reading \'foo\')')
  expect(rule.name).toBe('isEqToFoo')
  expect(rule.handler).toBe(isEqToFoo)
  expect(rule.context).toBeUndefined()
})
