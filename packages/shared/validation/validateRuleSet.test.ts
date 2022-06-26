import { expect, it } from 'vitest'
import { validateRuleSet } from './validateRuleSet'

const isRequired = (value: any): boolean => !!value
const isGreater = (value: number, n: number): boolean => value > n
const isEqual = (value: number, n: number): boolean => value === n
const toValue = (value: number, n: number): number => n
const toUndefined = () => {}

it('should pass a rule set when one path is valid', async() => {
  const result = await validateRuleSet(1, [
    [isRequired, [isGreater, 5]],
    [isRequired, [isEqual, 1]],
  ])
  expect(result.isValid).toEqual(true)
  expect(result.value).toEqual(1)
  expect(result.errors).toEqual([])
  expect(result.failed).toEqual(['isGreater'])
  expect(result.valid).toEqual(['isRequired', 'isRequired', 'isEqual'])
})

it('should fail a rule set when all path are invalid', async() => {
  const result = await validateRuleSet(1, [
    [isRequired, [isGreater, 5]],
    [isRequired, [isEqual, 0]],
  ])
  expect(result.isValid).toEqual(false)
  expect(result.value).toEqual(1)
  expect(result.errors).toEqual(['isGreater', 'isEqual'])
  expect(result.failed).toEqual(['isGreater', 'isEqual'])
  expect(result.valid).toEqual(['isRequired', 'isRequired'])
})

it('should pass a rule set when one path is valid but an invalid path had a tranformer', async() => {
  const result = await validateRuleSet(1, [
    [[toValue, 0], isRequired],
    [[isEqual, 1]],
  ])
  expect(result.isValid).toEqual(true)
  expect(result.value).toEqual(1)
  expect(result.errors).toEqual([])
  expect(result.failed).toEqual(['isRequired'])
  expect(result.valid).toEqual(['toValue', 'isEqual'])
})

it('should pass a rule set when one path is valid and has a tranformer', async() => {
  const result = await validateRuleSet(1, [
    [[toValue, 0], isRequired],
    [[isEqual, 1], [toValue, 10]],
  ])
  expect(result.isValid).toEqual(true)
  expect(result.value).toEqual(10)
  expect(result.errors).toEqual([])
  expect(result.failed).toEqual(['isRequired'])
  expect(result.valid).toEqual(['toValue', 'isEqual', 'toValue'])
})

it('should fail a rule set when all path are invalid and has a tranformer', async() => {
  const result = await validateRuleSet(1, [
    [toUndefined, [toValue, 10], [isEqual, 1]],
    [toUndefined, [toValue, 0], isRequired],
  ])
  expect(result.isValid).toEqual(false)
  expect(result.value).toEqual(1)
  expect(result.errors).toEqual(['isEqual', 'isRequired'])
  expect(result.failed).toEqual(['isEqual', 'isRequired'])
  expect(result.valid).toEqual(['toUndefined', 'toValue', 'toUndefined', 'toValue'])
})

it('should throw an error on invalid rule set', async() => {
  const invalidRuleSet = [[false]] as any
  const invalidCall = async() => await validateRuleSet(1, invalidRuleSet)
  expect(await invalidCall().catch(error => error)).toBeInstanceOf(Error)
})
