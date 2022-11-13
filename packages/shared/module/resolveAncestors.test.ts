/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { resolveAncestors } from './resolveAncestors'

it('should resolve ancestors', () => {
  const json = {
    '/home/user/project/.env': '',
    '/home/user/.env': '',
    '/home/.env': '',
    '/.env': '',
  }
  vol.fromJSON(json)
  const result = resolveAncestors('.env', '/home/user/project')
  const expected = Object.keys(json)
  expect(result).toEqual(expected)
})

it('should resolve ancestors at root', () => {
  const json = {
    '/.env': '',
  }
  vol.fromJSON(json)
  const result = resolveAncestors('.env', '/')
  const expected = Object.keys(json)
  expect(result).toEqual(expected)
})

it('should return empty array if no ancestors', () => {
  const result = resolveAncestors('.env', '/home/user/project')
  expect(result).toEqual([])
})
