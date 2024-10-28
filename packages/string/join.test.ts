import { join } from './join'

describe('join', () => {
  test('should join an array of strings', () => {
    const result = join(['a', 'b', 'c'], ',')
    expect(result).toBe('a,b,c')
  })

  test('should join an array of strings with no separator', () => {
    const result = join(['a', 'b', 'c'])
    expect(result).toBe('abc')
  })
})
