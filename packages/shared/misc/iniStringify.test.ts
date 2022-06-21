import { expect, it } from 'vitest'
import { iniStringify } from './iniStringify'

it('should stringify an object to an INI file', () => {
  const input = { foo: 'bar', baz: 'qux' }
  const output = iniStringify(input)
  const expectedOutput = 'foo=bar\nbaz=qux'
  expect(output).toEqual(expectedOutput)
})

it.todo('should stringify an object with an array value to an INI file', () => {
  const input = { foo: ['bar', 'baz'] }
  const output = iniStringify(input)
  const expectedOutput = 'foo=bar,baz'
  expect(output).toEqual(expectedOutput)
})

it('should stringify an object with a boolean value to an INI file', () => {
  const input = { foo: true, bar: false }
  const output = iniStringify(input)
  const expectedOutput = 'foo=true\nbar=false'
  expect(output).toEqual(expectedOutput)
})

it('should stringify a nested object to an INI file', () => {
  const input = { foo: { bar: 'baz', qux: 'quux' } }
  const output = iniStringify(input)
  const expectedOutput = '[foo]\nbar=baz\nqux=quux'
  expect(output).toEqual(expectedOutput)
})

it.todo('should strigify objects in nested objects to an INI file', () => {
  const input = { foo: { bar: { baz: 'qux' } } }
  const output = iniStringify(input)
  const expectedOutput = '[foo.bar]\nbaz=qux'
  expect(output).toEqual(expectedOutput)
})
