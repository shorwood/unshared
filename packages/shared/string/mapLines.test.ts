import { expect, it } from 'vitest'
import { mapLines } from './mapLines'

it('should map lines', () => {
  const value = 'foo\nbar\nbaz'
  const result = mapLines(value, (line, index) => `${index}: ${line}`)
  const expected = ['0: foo', '1: bar', '2: baz'].join('\n')
  expect(result).toBe(expected)
})
