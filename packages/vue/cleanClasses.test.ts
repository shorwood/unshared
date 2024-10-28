import { cleanClasses } from './cleanClasses'

describe('cleanClasses', () => {
  test('should return a new object', () => {
    const classes = { 'text-red': true }
    const result = cleanClasses(classes)
    expect(result).not.toBe(classes)
  })

  test('should keep valid classes', () => {
    const result = cleanClasses({ 'text-red': true })
    expect(result).toStrictEqual({ 'text-red': true })
  })

  test('should remove empty classes', () => {
    const result = cleanClasses({ '': true })
    expect(result).toStrictEqual({})
  })

  test('should remove `undefined` classes', () => {
    const result = cleanClasses({ undefined: true })
    expect(result).toStrictEqual({})
  })

  test('should remove disabled classes', () => {
    const result = cleanClasses({ 'text-red': false })
    expect(result).toStrictEqual({})
  })
})
