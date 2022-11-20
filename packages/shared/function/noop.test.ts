import { expect, it } from 'vitest'
import { noop } from './noop'

it('noop should return an empty function', () => {
  const result = noop()
  expect(result).toBeUndefined()
})
