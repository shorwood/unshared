import { expect, it } from 'vitest'
import { isNumber, isNumberDecimal, isNumberEven, isNumberGreater, isNumberGreaterOrEq, isNumberInRange, isNumberInteger, isNumberLower, isNumberLowerOrEq, isNumberNegative, isNumberOdd, isNumberPositive } from './isNumber'

it('is a number', () => {
  expect(isNumber(1)).toEqual(true)
  expect(isNumber(1.1)).toEqual(true)
  expect(isNumber('a')).toEqual(false)
})

it('is a number less than', () => {
  expect(isNumberLower(1, 2)).toEqual(true)
  expect(isNumberLower(2, 1)).toEqual(false)
  expect(isNumberLower(2, 2)).toEqual(false)
})

it('is a number less than or equal to', () => {
  expect(isNumberLowerOrEq(1, 2)).toEqual(true)
  expect(isNumberLowerOrEq(2, 1)).toEqual(false)
  expect(isNumberLowerOrEq(2, 2)).toEqual(true)
})

it('is a number greater than', () => {
  expect(isNumberGreater(2, 1)).toEqual(true)
  expect(isNumberGreater(1, 2)).toEqual(false)
  expect(isNumberGreater(2, 2)).toEqual(false)
})

it('is a number greater than or equal to', () => {
  expect(isNumberGreaterOrEq(2, 1)).toEqual(true)
  expect(isNumberGreaterOrEq(1, 2)).toEqual(false)
  expect(isNumberGreaterOrEq(2, 2)).toEqual(true)
})

it('is a number in range', () => {
  expect(isNumberInRange(2, { min: 1, max: 3 })).toEqual(true)
  expect(isNumberInRange(1, { min: 2, max: 3 })).toEqual(false)
  expect(isNumberInRange(3, { min: 1, max: 2 })).toEqual(false)
  expect(isNumberInRange(2, { min: 2, max: 2 })).toEqual(true)
})

it('is a positive number', () => {
  expect(isNumberPositive(2)).toEqual(true)
  expect(isNumberPositive(0)).toEqual(true)
  expect(isNumberPositive(-2)).toEqual(false)
})

it('is a negative number', () => {
  expect(isNumberNegative(2)).toEqual(false)
  expect(isNumberNegative(0)).toEqual(false)
  expect(isNumberNegative(-2)).toEqual(true)
})

it('is an integer', () => {
  expect(isNumberInteger(2)).toEqual(true)
  expect(isNumberInteger(2.1)).toEqual(false)
})

it('is a decimal number', () => {
  expect(isNumberDecimal(2)).toEqual(false)
  expect(isNumberDecimal(2.1)).toEqual(true)
})

it('should return true if value is odd', () => {
  expect(isNumberOdd(1)).toEqual(true)
  expect(isNumberOdd(2)).toEqual(false)
  expect(isNumberOdd(3)).toEqual(true)
  expect(isNumberOdd(4)).toEqual(false)
})

it('should return true if value is even', () => {
  expect(isNumberEven(1)).toEqual(false)
  expect(isNumberEven(2)).toEqual(true)
  expect(isNumberEven(3)).toEqual(false)
  expect(isNumberEven(4)).toEqual(true)
})
