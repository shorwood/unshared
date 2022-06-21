/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isString, isStringBetween, isStringBetweenOrEq, isStringEmpty, isStringEndingWith, isStringLonger, isStringLongerOrEq, isStringNotEmpty, isStringShorter, isStringShorterOrEq, isStringStartingWith } from './isString'

it('should return true if value is a string', () => {
  expect(isString('')).toBe(true)
  expect(isString('hello world')).toBe(true)
  expect(isString('123')).toBe(true)
  expect(isString(String(123))).toBe(true)
  expect(isString(null)).toBe(false)
  expect(isString(undefined)).toBe(false)
  expect(isString(true)).toBe(false)
  expect(isString(false)).toBe(false)
  expect(isString(0)).toBe(false)
  expect(isString(1)).toBe(false)
  expect(isString([])).toBe(false)
  expect(isString({})).toBe(false)
})

it('should return true if value is an empty string', () => {
  expect(isStringEmpty('')).toBe(true)
  expect(isStringEmpty(' ')).toBe(true)
  expect(isStringEmpty('\n')).toBe(true)
  expect(isStringEmpty('\t')).toBe(true)
  expect(isStringEmpty('hello world')).toBe(false)
  expect(isStringEmpty('123')).toBe(false)
  expect(isStringEmpty(String(123))).toBe(false)
})

it('should return true if value is a non-empty string', () => {
  expect(isStringNotEmpty('hello world')).toBe(true)
  expect(isStringNotEmpty('123')).toBe(true)
  expect(isStringNotEmpty(String(123))).toBe(true)
  expect(isStringNotEmpty('')).toBe(false)
  expect(isStringNotEmpty(' ')).toBe(false)
  expect(isStringNotEmpty('\n')).toBe(false)
  expect(isStringNotEmpty('\t')).toBe(false)
})

it('should return true if value is a string longer than the specified length', () => {
  expect(isStringLonger('hello world', 10)).toBe(true)
  expect(isStringLonger('hello', 4)).toBe(true)
  expect(isStringLonger('hello world', 11)).toBe(false)
  expect(isStringLonger('hello', 5)).toBe(false)
})

it('should return true if value is a string longer or equal to the specified length', () => {
  expect(isStringLongerOrEq('hello world', 10)).toBe(true)
  expect(isStringLongerOrEq('hello', 4)).toBe(true)
  expect(isStringLongerOrEq('hello', 5)).toBe(true)
  expect(isStringLongerOrEq('hello world', 12)).toBe(false)
})

it('should return true if value is a string shorter than the specified length', () => {
  expect(isStringShorter('hello world', 11)).toBe(false)
  expect(isStringShorter('hello', 5)).toBe(false)
  expect(isStringShorter('hello world', 10)).toBe(false)
  expect(isStringShorter('hello', 4)).toBe(false)
})

it('should return true if value is a string shorter or equal to the specified length', () => {
  expect(isStringShorterOrEq('hello world', 11)).toBe(true)
  expect(isStringShorterOrEq('hello', 5)).toBe(true)
  expect(isStringShorterOrEq('hello', 4)).toBe(false)
  expect(isStringShorterOrEq('hello world', 11)).toBe(true)
})

it('should return true if value is a string between the specified min and max length', () => {
  expect(isStringBetween('hello world', { min: 5, max: 10 })).toBe(false)
  expect(isStringBetween('hello', { min: 1, max: 3 })).toBe(false)
  expect(isStringBetween('hello world', { min: 11, max: 20 })).toBe(false)
  expect(isStringBetween('hello', { min: 4, max: 6 })).toBe(true)
  expect(isStringBetween('hello world', { min: 1, max: 5 })).toBe(false)
  expect(isStringBetween('hello', { min: 0, max: 1 })).toBe(false)
})

it('should return true if value is a string between or equal to the specified min and max length', () => {
  expect(isStringBetweenOrEq('hello world', { min: 5, max: 11 })).toBe(true)
  expect(isStringBetweenOrEq('hello', { min: 1, max: 3 })).toBe(false)
  expect(isStringBetweenOrEq('hello world', { min: 11, max: 20 })).toBe(true)
  expect(isStringBetweenOrEq('hello', { min: 4, max: 6 })).toBe(true)
  expect(isStringBetweenOrEq('hello world', { min: 1, max: 5 })).toBe(false)
  expect(isStringBetweenOrEq('hello', { min: 0, max: 1 })).toBe(false)
  expect(isStringBetweenOrEq('hello world', { min: 12, max: 20 })).toBe(false)
  expect(isStringBetweenOrEq('hello', { min: 0, max: 2 })).toBe(false)
})

it('should return true if value starts with the specified substring', () => {
  expect(isStringStartingWith('hello world', 'hello')).toBe(true)
  expect(isStringStartingWith('hello', 'hello')).toBe(true)
  expect(isStringStartingWith('hello world', 'world')).toBe(false)
  expect(isStringStartingWith('hello', 'ello')).toBe(false)
})

it('should return true if value ends with the specified substring', () => {
  expect(isStringEndingWith('hello world', 'world')).toBe(true)
  expect(isStringEndingWith('hello', 'hello')).toBe(true)
  expect(isStringEndingWith('hello world', 'hello')).toBe(false)
  expect(isStringEndingWith('hello', 'elloh')).toBe(false)
})
