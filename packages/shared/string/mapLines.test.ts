import { it, expect } from 'vitest'
import { mapLines } from './mapLines'

it('should map lines', () => {
  const value = ['foo', 'bar', 'baz'].join('\n')
  const result = mapLines(value, (line, index) => `${index}: ${line}`)
  const expected = ['0: foo', '1: bar', '2: baz'].join('\n')
  expect(result).toBe(expected)
})
