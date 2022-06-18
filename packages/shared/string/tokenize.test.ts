
import { expect, it } from 'vitest'
import { tokenize } from './tokenize'

it('should tokenize empty strings', () => {
  expect(tokenize('')).toEqual([])
  expect(tokenize(' ')).toEqual([])
  expect(tokenize('\n')).toEqual([])
  expect(tokenize('\r\n')).toEqual([])
  expect(tokenize('\t')).toEqual([])
  expect(tokenize('\r')).toEqual([])
})

it('should trim whitespaces', () => {
  expect(tokenize(' foo bar ')).toEqual(['foo', 'bar'])
  expect(tokenize('\nfoo\nbar\n')).toEqual(['foo', 'bar'])
})

it('should tokenize basic strings', () => {
  expect(tokenize('f')).toEqual(['f'])
  expect(tokenize('foo')).toEqual(['foo'])
  expect(tokenize('fooBar')).toEqual(['foo', 'Bar'])
  expect(tokenize('fooBar FooBar')).toEqual(['foo', 'Bar', 'Foo', 'Bar'])
})

it('should handle numbers as separate tokens', () => {
  expect(tokenize('42')).toEqual(['42'])
  expect(tokenize('foo42')).toEqual(['foo42'])
  expect(tokenize('fooBar42')).toEqual(['foo', 'Bar42'])
  expect(tokenize('foo42Bar')).toEqual(['foo42', 'Bar'])
})
