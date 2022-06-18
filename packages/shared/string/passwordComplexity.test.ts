
import { expect, it } from 'vitest'
import { passwordComplexity } from './passwordComplexity'

it('should calculate the complexity of a password', () => {
  expect(passwordComplexity('password')).toBe(8)
  expect(passwordComplexity('Password')).toBe(8)
  expect(passwordComplexity('Password1')).toBe(10)
  expect(passwordComplexity('Password!')).toBe(12)
})
