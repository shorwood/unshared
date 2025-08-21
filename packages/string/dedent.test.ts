import { dedent } from './dedent'

describe('dedent', () => {
  describe('basic functionality', () => {
    it('should return the string as-is if there is no first line', () => {
      const string = dedent('\n\n\n')
      expect(string).toBe('\n\n\n')
    })

    it('should return the string as is if there is no leading indents', () => {
      const string = dedent('Hello\nWorld')
      expect(string).toBe('Hello\nWorld')
    })

    it('should remove single line indents', () => {
      const string = dedent('\tHello World')
      expect(string).toBe('Hello World')
    })
  })

  describe('handling template literals', () => {
    it('should return the string as-is if there is no first line', () => {
      const string = dedent`\n\n\n`
      expect(string).toBe('\n\n\n')
    })

    it('should return the string as is if there is no leading indents', () => {
      const string = dedent`Hello\nWorld`
      expect(string).toBe('Hello\nWorld')
    })

    it('should remove single line indents', () => {
      const string = dedent`\tHello World`
      expect(string).toBe('Hello World')
    })
  })

  describe('handling indents', () => {
    it('should removes leading indents from a uniform string', () => {
      const string = dedent('\tHello\n\tWorld')
      expect(string).toBe('Hello\nWorld')
    })

    it('should remove leading indents but keep indents in the middle of the string', () => {
      const string = dedent('\n\tHello\n\t\tWorld')
      expect(string).toBe('Hello\n\tWorld')
    })

    it('should not remove leading indents from a string with no leading indents', () => {
      const string = dedent('Hello\n\tWorld')
      expect(string).toBe('Hello\n\tWorld')
    })

    it('should remove leading space indents from all lines', () => {
      const string = dedent('  Hello\n  World')
      expect(string).toBe('Hello\nWorld')
    })

    it('should remove leading spaces but keep indents in the middle of the string', () => {
      const string = dedent('  Hello\n    World')
      expect(string).toBe('Hello\n  World')
    })

    it('should not remove leading spaces from a string with no leading spaces', () => {
      const string = dedent('Hello\n  World')
      expect(string).toBe('Hello\n  World')
    })
  })

  describe('handling newlines', () => {
    it('should remove extra newlines at the end of the string', () => {
      const string = dedent('\tHello\n\tWorld\n\n\n')
      expect(string).toBe('Hello\nWorld')
    })

    it('should remove extra newlines at the beginning of the string', () => {
      const string = dedent('\n\n\n\tHello\n\tWorld')
      expect(string).toBe('Hello\nWorld')
    })

    it('should handle string with only newlines', () => {
      const string = dedent('\n\n\n')
      expect(string).toBe('\n\n\n')
    })

    it('should handle string with mixed content and newlines', () => {
      const string = dedent('\n  Hello\n\n  World\n\n')
      expect(string).toBe('Hello\n\nWorld')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const string = dedent('')
      expect(string).toBe('')
    })

    it('should handle string with only spaces', () => {
      const string = dedent('    ')
      expect(string).toBe('    ')
    })

    it('should handle string with mixed tabs and spaces', () => {
      const string = dedent(' \t Hello\n \t World')
      expect(string).toBe('Hello\nWorld')
    })

    it('should handle string with inconsistent leading indents', () => {
      const string = dedent('  Hello\n    World\n  !')
      expect(string).toBe('Hello\n  World\n!')
    })
  })
})
