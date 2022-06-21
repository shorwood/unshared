import { expect, it } from 'vitest'
import { convertToUnit } from './convertToUnit'

it('converts strings and numbers to a CSS unit', () => {
  expect(convertToUnit(10)).toEqual('10px')
  expect(convertToUnit('10')).toEqual('10px')
  expect(convertToUnit(10, 'rem')).toEqual('10rem')
  expect(convertToUnit('10', 'rem')).toEqual('10rem')
  expect(convertToUnit('10%')).toEqual('10%')
  expect(convertToUnit(10, '%')).toEqual('10%')
  expect(convertToUnit()).toEqual('0')
})

it('falls back to input when input is not a number', () => {
  expect(convertToUnit('test')).toEqual('test')
})
