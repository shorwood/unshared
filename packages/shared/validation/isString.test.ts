/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isString, isStringBetween, isStringBetweenOrEq, isStringEmpty, isStringEndingWith, isStringLonger, isStringLongerOrEq, isStringNotEmpty, isStringShorter, isStringShorterOrEq, isStringStartingWith } from './isString'

it('should return true if value is a string', () => {
  expect(isString('')).toEqual(true)
  expect(isString('hello world')).toEqual(true)
  expect(isString('123')).toEqual(true)
  expect(isString(String(123))).toEqual(true)
  expect(isString(null)).toEqual(false)
  expect(isString(undefined)).toEqual(false)
  expect(isString(true)).toEqual(false)
  expect(isString(false)).toEqual(false)
  expect(isString(0)).toEqual(false)
  expect(isString(1)).toEqual(false)
  expect(isString([])).toEqual(false)
  expect(isString({})).toEqual(false)
})

it('should return true if value is an empty string', () => {
  expect(isStringEmpty('')).toEqual(true)
  expect(isStringEmpty(' ')).toEqual(true)
  expect(isStringEmpty('\n')).toEqual(true)
  expect(isStringEmpty('\t')).toEqual(true)
  expect(isStringEmpty('hello world')).toEqual(false)
  expect(isStringEmpty('123')).toEqual(false)
  expect(isStringEmpty(String(123))).toEqual(false)
})

it('should return true if value is a non-empty string', () => {
  expect(isStringNotEmpty('hello world')).toEqual(true)
  expect(isStringNotEmpty('123')).toEqual(true)
  expect(isStringNotEmpty(String(123))).toEqual(true)
  expect(isStringNotEmpty('')).toEqual(false)
  expect(isStringNotEmpty(' ')).toEqual(false)
  expect(isStringNotEmpty('\n')).toEqual(false)
  expect(isStringNotEmpty('\t')).toEqual(false)
})

it('should return true if value is a string longer than the specified length', () => {
  expect(isStringLonger('hello world', 10)).toEqual(true)
  expect(isStringLonger('hello', 4)).toEqual(true)
  expect(isStringLonger('hello world', 11)).toEqual(false)
  expect(isStringLonger('hello', 5)).toEqual(false)
})

it('should return true if value is a string longer or equal to the specified length', () => {
  expect(isStringLongerOrEq('hello world', 10)).toEqual(true)
  expect(isStringLongerOrEq('hello', 4)).toEqual(true)
  expect(isStringLongerOrEq('hello', 5)).toEqual(true)
  expect(isStringLongerOrEq('hello world', 12)).toEqual(false)
})

it('should return true if value is a string shorter than the specified length', () => {
  expect(isStringShorter('hello world', 11)).toEqual(false)
  expect(isStringShorter('hello', 5)).toEqual(false)
  expect(isStringShorter('hello world', 10)).toEqual(false)
  expect(isStringShorter('hello', 4)).toEqual(false)
})

it('should return true if value is a string shorter or equal to the specified length', () => {
  expect(isStringShorterOrEq('hello world', 11)).toEqual(true)
  expect(isStringShorterOrEq('hello', 5)).toEqual(true)
  expect(isStringShorterOrEq('hello', 4)).toEqual(false)
  expect(isStringShorterOrEq('hello world', 11)).toEqual(true)
})

it('should return true if value is a string between the specified min and max length', () => {
  expect(isStringBetween('hello world', { min: 5, max: 10 })).toEqual(false)
  expect(isStringBetween('hello', { min: 1, max: 3 })).toEqual(false)
  expect(isStringBetween('hello world', { min: 11, max: 20 })).toEqual(false)
  expect(isStringBetween('hello', { min: 4, max: 6 })).toEqual(true)
  expect(isStringBetween('hello world', { min: 1, max: 5 })).toEqual(false)
  expect(isStringBetween('hello', { min: 0, max: 1 })).toEqual(false)
})

it('should return true if value is a string between or equal to the specified min and max length', () => {
  expect(isStringBetweenOrEq('hello world', { min: 5, max: 11 })).toEqual(true)
  expect(isStringBetweenOrEq('hello', { min: 1, max: 3 })).toEqual(false)
  expect(isStringBetweenOrEq('hello world', { min: 11, max: 20 })).toEqual(true)
  expect(isStringBetweenOrEq('hello', { min: 4, max: 6 })).toEqual(true)
  expect(isStringBetweenOrEq('hello world', { min: 1, max: 5 })).toEqual(false)
  expect(isStringBetweenOrEq('hello', { min: 0, max: 1 })).toEqual(false)
  expect(isStringBetweenOrEq('hello world', { min: 12, max: 20 })).toEqual(false)
  expect(isStringBetweenOrEq('hello', { min: 0, max: 2 })).toEqual(false)
})

it('should return true if value starts with the specified substring', () => {
  expect(isStringStartingWith('hello world', 'hello')).toEqual(true)
  expect(isStringStartingWith('hello', 'hello')).toEqual(true)
  expect(isStringStartingWith('hello world', 'world')).toEqual(false)
  expect(isStringStartingWith('hello', 'ello')).toEqual(false)
})

it('should return true if value ends with the specified substring', () => {
  expect(isStringEndingWith('hello world', 'world')).toEqual(true)
  expect(isStringEndingWith('hello', 'hello')).toEqual(true)
  expect(isStringEndingWith('hello world', 'hello')).toEqual(false)
  expect(isStringEndingWith('hello', 'elloh')).toEqual(false)
})
