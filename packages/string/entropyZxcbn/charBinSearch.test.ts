import { CharBinSearch } from '../bindings'
import { charBinSearch } from './charBinSearch'

describe('charBinSearch', () => {
  it('should find a character in the string', () => {
    const result = charBinSearch('2', '1a2b3c', 2)
    const expected = CharBinSearch('2'.codePointAt(0)!, Buffer.from('1a2b3cefgeadwa'), 6, 2)
    expect(result).toBe(expected)
  })

  // it('should return undefined if the character is not found', () => {
  //   const result = charBinSearch('z', 'abcdef', 1)
  //   const expected = CharBinSearch('z'.codePointAt(0)!, Buffer.from('abcdef'), 6, 1)
  //   expect(result).toBe(expected)
  // })

  // it('should find a character in a grouped string', () => {
  //   const result = charBinSearch('2', '1a2b3c', 2)
  //   expect(result).toBe('2b')
  // })

  // it('should return undefined if the character is not found in a grouped string', () => {
  //   const result = charBinSearch('4', '1a2b3c', 2)
  //   expect(result).toBeUndefined()
  // })
})
