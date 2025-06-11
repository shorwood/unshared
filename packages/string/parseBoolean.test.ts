import { parseBoolean } from './parseBoolean'

describe('parseBoolean', () => {
  const trueCases = ['true', 'TRUE', 'True', '1', 'yes', 'YES', 'on', 'ON', 'y', 'Y', 'enabled', 'ENABLED', ' 1 '] as const
  const falseCases = ['false', 'FALSE', '0', 'no', 'NO', 'off', 'OFF', 'n', 'N', 'disabled', 'DISABLED'] as const

  describe('true values', () => {
    it.each(trueCases)('should return true for "%s"', (value) => {
      const result = parseBoolean(value)
      expect(result).toBe(true)
      expectTypeOf(result).toEqualTypeOf<true>()
    })
  })

  describe('false values', () => {
    it.each(falseCases)('should return false for "%s"', (value) => {
      const result = parseBoolean(value)
      expect(result).toBe(false)
      expectTypeOf(result).toEqualTypeOf<false>()
    })
  })

  describe('non-literal types', () => {
    it('should return boolean if the value is a non-literal', () => {
      const result = parseBoolean('false' as string)
      expect(result).toBe(false)
      expectTypeOf(result).toEqualTypeOf<boolean>()
    })
  })
})
