import { split } from './split'

describe('split', () => {
  test('should split a string with empty delimiter', () => {
    const result = split('a,b,c')
    expect(result).toMatchObject(['a', 'b', 'c'])
  })

  test('should split a string with a delimiter', () => {
    const result = split('a,b,c', ',')
    expect(result).toMatchObject(['a', 'b', 'c'])
  })

  test('should split a string with a limit', () => {
    const result = split('a,b,c', ',', 2)
    expect(result).toMatchObject(['a', 'b'])
  })

  test('should split a string with a negative limit', () => {
    const result = split('a,b,c', ',', -2)
    expect(result).toMatchObject(['b', 'c'])
  })

  test('should filter out empty strings', () => {
    const result = split('a,,b,c', ',')
    expect(result).toMatchObject(['a', 'b', 'c'])
  })
})
