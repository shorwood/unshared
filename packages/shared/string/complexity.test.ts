
import { expect, it } from 'vitest'
import { complexity } from './complexity'

it('should calculate the complexity of a password', () => {
  expect(complexity('password')).toBe(8)
  expect(complexity('Password')).toBe(9)
  expect(complexity('Password1')).toBe(10)
  expect(complexity('Password!')).toBe(13)
})
