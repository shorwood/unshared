/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/consistent-function-scoping */
import { expect, it } from 'vitest'
import { validateRule } from './validateRule'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value >= n
const isEqToFoo = (value: number, a: any, context: any): boolean => value === context.foo
const toUpperCase = (value: string): string => value.toUpperCase()

it('passes when valid', async() => {
  const value = 'value'
  const result = await validateRule(value, isRequired)
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(true)
  expect(result.errorMessage).toBeUndefined()
  expect(result.name).toEqual('isRequired')
  expect(result.handler).toEqual(isRequired)
  expect(result.argument).toBeUndefined()
  expect(result.context).toBeUndefined()
})

it('fails when invalid', async() => {
  const value = ''
  const result = await validateRule(value, [isRequired, undefined, 'Invalid value'])
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Invalid value')
  expect(result.name).toEqual('isRequired')
  expect(result.handler).toEqual(isRequired)
  expect(result.argument).toBeUndefined()
  expect(result.context).toBeUndefined()
})

it('passes when valid and provide a transformed value', async() => {
  const value = 'foo'
  const result = await validateRule(value, toUpperCase)
  expect(result.value).toEqual('FOO')
  expect(result.isValid).toEqual(true)
  expect(result.errorMessage).toBeUndefined()
  expect(result.name).toEqual('toUpperCase')
  expect(result.handler).toEqual(toUpperCase)
  expect(result.argument).toBeUndefined()
  expect(result.context).toBeUndefined()
})

it('fails when runtime error occured', async() => {
  const value = 'foo'
  const resultThrowingError = () => { throw new Error('Error') }
  const result = await validateRule(value, [resultThrowingError, undefined, 'Invalid value'])
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Error')
  expect(result.name).toEqual('resultThrowingError')
  expect(result.handler).toEqual(resultThrowingError)
  expect(result.argument).toBeUndefined()
  expect(result.context).toBeUndefined()
})

it('passes with arguments when valid and provide a transformed value', async() => {
  const value = 10
  const result = await validateRule(value, { handler: isGreater, argument: 5 })
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(true)
  expect(result.errorMessage).toBeUndefined()
  expect(result.name).toEqual('isGreater')
  expect(result.handler).toEqual(isGreater)
  expect(result.argument).toEqual(5)
  expect(result.context).toBeUndefined()
})

it('fails with arguments when invalid and provide a transformed value', async() => {
  const value = 10
  const asyncIsGreater = async(value: number, n: number) => isGreater(value, n)
  const result = await validateRule(value, {
    handler: asyncIsGreater,
    argument: () => 20,
    errorMessage: () => 'Invalid value',
  })
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Invalid value')
  expect(result.name).toEqual('asyncIsGreater')
  expect(result.handler).toEqual(asyncIsGreater)
  expect(result.argument).toEqual(20)
  expect(result.context).toBeUndefined()
})

it('passes when valid and provided a context', async() => {
  const value = 'bar'
  const context = { foo: 'bar' }
  const result = await validateRule(value, isEqToFoo, context)
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(true)
  expect(result.errorMessage).toBeUndefined()
  expect(result.name).toEqual('isEqToFoo')
  expect(result.handler).toEqual(isEqToFoo)
  expect(result.context).toEqual(context)
})

it('fails when invalid and provided a context', async() => {
  const value = 'not-bar'
  const context = { foo: 'bar' }
  const result = await validateRule(value, [isEqToFoo, undefined, 'Invalid value'], context)
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Invalid value')
  expect(result.name).toEqual('isEqToFoo')
  expect(result.handler).toEqual(isEqToFoo)
  expect(result.context).toEqual(context)
})

it('fails when valid but context not provided ', async() => {
  const value = 'bar'
  const result = await validateRule(value, { handler: isEqToFoo, errorMessage: 'Invalid value' })
  expect(result.value).toEqual(value)
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Cannot read properties of undefined (reading \'foo\')')
  expect(result.name).toEqual('isEqToFoo')
  expect(result.handler).toEqual(isEqToFoo)
  expect(result.context).toBeUndefined()
})

it('fails a async result when rejected', async() => {
  const value = 'bar'
  const throwsError = async() => { throw new Error('Async Error') }
  const result = await validateRule(value, {
    handler: throwsError,
    errorMessage: 'Invalid value',
  })
  expect(result.value).toBeUndefined()
  expect(result.isValid).toEqual(false)
  expect(result.errorMessage).toEqual('Async Error')
  expect(result.name).toEqual('throwsError')
  expect(result.handler).toEqual(throwsError)
  expect(result.context).toBeUndefined()
})

const symbol = Symbol('foo')
it.each([
  ['regexp', /^bar$/, true, '/^bar$/', 'bar'],
  ['regexp', /^baz$/, false, '/^baz$/', 'bar'],
  ['true', true, true, 'true', 'bar'],
  ['false', false, false, 'false', 'bar'],
  ['Boolean(true)', new Boolean(true), true, 'true', true],
  ['Boolean(false)', new Boolean(false), true, 'false', false],
  ['string', 'foo', true, 'foo', 'foo'],
  ['number', 1, true, '1', 1],
  ['bigint', 1n, true, '1', 1n],
  ['symbol', symbol, true, 'Symbol(foo)', symbol],
  ['undefined', undefined, true, 'undefined', undefined],
  ['null', null, true, 'null', null],
])('validates with "%s" and transform to %s', async(_type, rule, expectedIsValid, expectedName, expectedValue) => {
  const value = 'bar'
  const result = await validateRule(value, rule)
  expect(result.value).toEqual(expectedValue)
  expect(result.isValid).toEqual(expectedIsValid)
  expect(result.errorMessage).toBeUndefined()
  expect(result.name).toEqual(expectedName)
  expect(result.handler).toBeTypeOf('function')
  expect(result.context).toBeUndefined()
})
