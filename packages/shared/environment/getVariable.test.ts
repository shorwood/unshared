import { expect, it, vi } from 'vitest'
import { getVariable } from './getVariable'

vi.stubGlobal('process', {
  env: {
    FOO_BIN: '/usr/bin',
    FOO_ANSWER_OF_THE_UNIVERSE: '42',
  },
})

it.each([
  ['UNDEFINED', undefined, undefined],
  ['FOO_BIN', '/usr/bin', undefined],
  ['FOO_ANSWER_OF_THE_UNIVERSE', 42, Number.parseInt],
])
('should parse environment variables', (name, expected, transform) => {
  const result = getVariable(name, transform)
  expect(result).toEqual(expected)
})
