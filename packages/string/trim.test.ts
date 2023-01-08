import { expect, it } from 'vitest'
import { trim } from './trim'

it('removes whitespace from both sides of a string', () => {
  const result = trim(' foo bar ')
  expect(result).toEqual('foo bar')
})
