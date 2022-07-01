import { expect, it } from 'vitest'
import { template } from './template'

it('should template a string', () => {
  expect(template('Hello {{name}}', { name: 'World' })).toEqual('Hello World')
})

it('should escape delimiters', () => {
  expect(template('Hello {{name}}', { name: '{{name}}' })).toEqual('Hello {{name}}')
})

it('should allow custom delimiters', () => {
  expect(template('Hello ((name))', { name: 'World' }, { delimiters: ['((', '))'] })).toEqual('Hello World')
})

it('should handle undefined values', () => {
  expect(template('Hello {{name}}', { name: undefined })).toEqual('Hello ')
})

it('should handle nested data', () => {
  expect(template('Hello {{name.first}} {{name.last}}', { name: { first: 'John', last: 'Doe' } })).toEqual('Hello John Doe')
})

it('should handle functions', () => {
  expect(template('Hello {{name}}', { name: () => 'World' })).toEqual('Hello World')
})

it('should handle objects', () => {
  expect(template('Hello {{name}}', { name: { foo: 'bar' } })).toEqual('Hello {\n  "foo": "bar"\n}')
})
