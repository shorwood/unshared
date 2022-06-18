import { expect, it } from 'vitest'
import { trim } from './trim'

it('removes whitespace from both sides of a string', () => {
  expect(trim('  foo  ')).toEqual('foo')
})
