
import { expect, it } from 'vitest'
import { complexity } from './complexity'

it('should calculate the complexity of a password', () => {
  expect(complexity('')).toEqual(0)
  expect(complexity('password')).toEqual(8)
  expect(complexity('Password')).toEqual(9)
  expect(complexity('Password1')).toEqual(10)
  expect(complexity('Password!')).toEqual(13)
})
