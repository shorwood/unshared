/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { resolveAncestors } from './resolveAncestors'

it('should resolve ancestors', async() => {
  const json = {
    '/home/user/project/.env': '',
    '/home/user/.env': '',
    '/home/.env': '',
    '/.env': '',
  }
  vol.fromJSON(json)
  const result = await resolveAncestors('.env', '/home/user/project')
  const expected = Object.keys(json)
  expect(result).toEqual(expected)
})

it('should resolve ancestors at root', async() => {
  const json = { '/.env': '' }
  vol.fromJSON(json)
  const result = await resolveAncestors('.env', '/')
  const expected = Object.keys(json)
  expect(result).toEqual(expected)
})

it('should return empty array if no ancestors', async() => {
  const result = await resolveAncestors('.env', '/home/user/project')
  expect(result).toEqual([])
})
