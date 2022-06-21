/* eslint-disable unicorn/consistent-function-scoping */
import { expect, it } from 'vitest'
import { isStrictMode } from './environment'
import { functionName } from './functionName'

const testArrow = () => {}
function testFunction() {}
const testVariable = function() {}
const testVariableNamed = function named() {}

it('returns the name of the function that called the function', () => {
  expect(functionName(testArrow)).toEqual('testArrow')
  expect(functionName(testFunction)).toEqual('testFunction')
  expect(functionName(testVariable)).toEqual('testVariable')
  expect(functionName(testVariableNamed)).toEqual('named')
})

it.skipIf(isStrictMode)('returns the name of the function that called the function if no target is provided', () => {
  expect(functionName()).toEqual('it')
})
