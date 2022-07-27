/* eslint-disable unicorn/prevent-abbreviations */
import { expect, it, vi } from 'vitest'
import { getVariables } from './getVariables'

vi.stubGlobal('process', {
  env: {
    FOO_BIN: '/usr/bin',
    FOO_ANSWER_OF_THE_UNIVERSE: '42',
  },
})

it('should parse environment variables', () => {
  const expected = { bin: '/usr/bin', answerOfTheUniverse: 42 }
  const transformMap = { answerOfTheUniverse: Number.parseInt }
  const result = getVariables<typeof expected>('FOO', transformMap)
  expect(result).toEqual(expected)
})
