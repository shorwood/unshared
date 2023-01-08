import { endianness as osEndianness } from 'node:os'
import { expect, it } from 'vitest'
import { endianness, getEndianness, isBigEndian, isLittleEndian } from './getEndianness'

it('returns the endianness of the machine', () => {
  const expected = osEndianness()
  expect(getEndianness()).toEqual(expected)
  expect(endianness).toEqual(expected)
  expect(isLittleEndian).toEqual(expected === 'LE')
  expect(isBigEndian).toEqual(expected === 'BE')
})
