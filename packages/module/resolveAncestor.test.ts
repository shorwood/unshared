import { expect, it } from 'vitest'
import { vol } from 'memfs'
import { resolveAncestor } from './resolveAncestor'

it('should resolve the first ancestor', async() => {
  const json = {
    '/home/user/project/.env': '',
    '/home/user/.env': '',
    '/home/.env': '',
    '/.env': '',
  }
  vol.fromJSON(json)
  const result = await resolveAncestor('.env', '/home/user/project')
  const expected = Object.keys(json)[0]
  expect(result).toBe(expected)
})

it('should throw if no ancestors', () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const shouldReject = () => resolveAncestor('.env', '/home/user/project')
  expect(shouldReject).rejects.toThrow()
})