import { expect, it } from 'vitest'
import { convertToUnit } from './convertToUnit'

it.each([
  [10, undefined, '10px'],
  ['10', undefined, '10px'],
  [10, 'rem', '10rem'],
  ['10', 'rem', '10rem'],
  ['10%', undefined, '10%'],
  [10, '%', '10%'],
  [undefined, undefined, '0'],
])('converts strings and numbers to a CSS unit', (input, unit, expected) => {
  const result = convertToUnit(input, <any>unit)
  expect(result).toEqual(expected)
})

it('falls back to input when input is not a number', () => {
  const result = convertToUnit('test')
  expect(result).toEqual('test')
})
