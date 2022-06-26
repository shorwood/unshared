/* eslint-disable unicorn/consistent-function-scoping */
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
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(true)
  expect(rule.isInvalid).toEqual(false)
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toEqual('isRequired')
  expect(rule.handler).toEqual(isRequired)
  expect(rule.argument).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should fail a validation rule when invalid', async() => {
  const value = ''
  const rule: ValidateRuleResult = await validateRule(value, [isRequired, undefined, 'Invalid value'])
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Invalid value')
  expect(rule.name).toEqual('isRequired')
  expect(rule.handler).toEqual(isRequired)
  expect(rule.argument).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should pass a transformation rule when valid and provide a transformed value', async() => {
  const value = 'foo'
  const rule: ValidateRuleResult = await validateRule(value, toUpperCase)
  expect(rule.value).toEqual('FOO')
  expect(rule.isValid).toEqual(true)
  expect(rule.isInvalid).toEqual(false)
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toEqual('toUpperCase')
  expect(rule.handler).toEqual(toUpperCase)
  expect(rule.argument).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should fail a transformation rule when runtime error occured', async() => {
  const value = undefined
  const ruleThrowingError = () => { throw new Error('Error') }
  const rule: ValidateRuleResult = await validateRule(value, [ruleThrowingError, undefined, 'Invalid value'])
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Error')
  expect(rule.name).toEqual('ruleThrowingError')
  expect(rule.handler).toEqual(ruleThrowingError)
  expect(rule.argument).toBeUndefined()
  expect(rule.context).toBeUndefined()
})

it('should pass a rule with arguments when valid and provide a transformed value', async() => {
  const value = 10
  const rule: ValidateRuleResult = await validateRule(value, { handler: isGreater, argument: 5 })
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(true)
  expect(rule.isInvalid).toEqual(false)
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toEqual('isGreater')
  expect(rule.handler).toEqual(isGreater)
  expect(rule.argument).toEqual(5)
  expect(rule.context).toBeUndefined()
})

it('should fail a rule with arguments when invalid and provide a transformed value', async() => {
  const value = 10
  const asyncIsGreater = async(value: number, n: number) => isGreater(value, n)
  const rule: ValidateRuleResult = await validateRule(value, {
    handler: asyncIsGreater,
    argument: () => 20,
    errorMessage: () => 'Invalid value',
  })
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Invalid value')
  expect(rule.name).toEqual('asyncIsGreater')
  expect(rule.handler).toEqual(asyncIsGreater)
  expect(rule.argument).toEqual(20)
  expect(rule.context).toBeUndefined()
})

it('should pass a rule when valid and provided a context', async() => {
  const value = 'bar'
  const context = { foo: 'bar' }
  const rule: ValidateRuleResult = await validateRule(value, isEqToFoo, context)
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(true)
  expect(rule.isInvalid).toEqual(false)
  expect(rule.errorMessage).toBeUndefined()
  expect(rule.name).toEqual('isEqToFoo')
  expect(rule.handler).toEqual(isEqToFoo)
  expect(rule.context).toEqual(context)
})

it('should fail a rule when invalid and provided a context', async() => {
  const value = 'not-bar'
  const context = { foo: 'bar' }
  const rule: ValidateRuleResult = await validateRule(value, [isEqToFoo, undefined, 'Invalid value'], context)
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Invalid value')
  expect(rule.name).toEqual('isEqToFoo')
  expect(rule.handler).toEqual(isEqToFoo)
  expect(rule.context).toEqual(context)
})

it('should fail a rule when valid but context not provided ', async() => {
  const value = 'bar'
  const rule: ValidateRuleResult = await validateRule(value, { handler: isEqToFoo, errorMessage: 'Invalid value' })
  expect(rule.value).toEqual(value)
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Cannot read properties of undefined (reading \'foo\')')
  expect(rule.name).toEqual('isEqToFoo')
  expect(rule.handler).toEqual(isEqToFoo)
  expect(rule.context).toBeUndefined()
})

it('should fail a async rule when rejected', async() => {
  const value = 'bar'
  const throwsError = async() => { throw new Error('Async Error') }
  const rule: ValidateRuleResult = await validateRule(value, {
    handler: throwsError,
    errorMessage: 'Invalid value',
  })
  expect(rule.value).toBeUndefined()
  expect(rule.isValid).toEqual(false)
  expect(rule.isInvalid).toEqual(true)
  expect(rule.errorMessage).toEqual('Async Error')
  expect(rule.name).toEqual('throwsError')
  expect(rule.handler).toEqual(throwsError)
  expect(rule.context).toBeUndefined()
})
