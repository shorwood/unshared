import { noop } from './noop'

describe('noop', () => {
  test('should return undefined', () => {
    const result = noop()
    expect(result).toBeUndefined()
  })
})
