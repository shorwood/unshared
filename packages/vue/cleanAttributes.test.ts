import { cleanAttributes } from './cleanAttributes'

describe('cleanAttributes', () => {
  describe('keep', () => {
    it('should return a new object', () => {
      const attributes = { value: 42 }
      const result = cleanAttributes(attributes)
      expect(result).not.toBe(attributes)
    })

    it('should keep valid attributes', () => {
      const result = cleanAttributes({ value: 42 })
      expect(result).toStrictEqual({ value: 42 })
    })
  })

  describe('exclude', () => {
    it('should collapse null attributes', () => {
      const result = cleanAttributes({ value: null })
      expect(result).toStrictEqual({})
    })

    it('should collapse undefined attributes', () => {
      const result = cleanAttributes({ value: undefined })
      expect(result).toStrictEqual({})
    })

    it('should collapse empty strings', () => {
      const result = cleanAttributes({ value: '' })
      expect(result).toStrictEqual({})
    })

    it('should collapse strings with only whitespace', () => {
      const result = cleanAttributes({ value: ' ' })
      expect(result).toStrictEqual({})
    })
  })

  describe('class', () => {
    it('should keep class objects with valid classes', () => {
      const result = cleanAttributes({ class: { 'text-red': true } })
      expect(result).toStrictEqual({ class: { 'text-red': true } })
    })

    it('should remove class objects where all classes are disabled', () => {
      const result = cleanAttributes({ class: { 'text-red': false } })
      expect(result).toStrictEqual({})
    })

    it('should remove class objects where class name is empty', () => {
      const result = cleanAttributes({ class: { '': true } })
      expect(result).toStrictEqual({})
    })
  })
})
