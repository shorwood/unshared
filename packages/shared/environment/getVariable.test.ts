import { expect, it } from 'vitest'
import { getVariable } from './getVariable'

it('should return undefined if the variable is missing', () => {
  expect(getVariable('MISSING')).toEqual(undefined)
})

it('should return the variable value as a string if no transform is given', () => {
  expect(getVariable('PWD')).toEqual(process.cwd())
})

it('should return the variable value transformed if a transform is given', () => {
  expect(getVariable('SHELL', pwd => pwd.split('/')?.pop())).toMatch('sh')
})
