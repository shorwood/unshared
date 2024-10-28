import { getCaller } from './getCaller'

describe('getCaller', () => {
  test('should resolve the caller', () => {
    const result = getCaller()
    expect(result).toMatch(/vitest/)
  })
})
