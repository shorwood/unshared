import { expect, it } from 'vitest'
import { escapeRegExp } from './escapeRegExp'

it('should escape all the special characters', () => {
  expect(escapeRegExp('$()*+.?[\\\]^{|}')).toEqual('\\$\\(\\)\\*\\+\\.\\?\\[\\\\\\]\\^\\{\\|\\}')
})

it('should escape the backslash character', () => {
  expect(escapeRegExp('\\')).toEqual('\\\\')
})
