import { createText } from './createText'

describe('createText', () => {
  describe('backgroundColor', () => {
    it('should colorize the background', () => {
      const result = createText('Hello', { backgroundColor: [1, 2, 3] })
      expect(result).toEqual('\u001B[48;2;1;2;3mHello\u001B[49m')
    })
  })

  describe('textColor', () => {
    it('should colorize the text', () => {
      const result = createText('Hello', { textColor: [1, 2, 3] })
      expect(result).toEqual('\u001B[38;2;1;2;3mHello\u001B[39m')
    })
  })

  describe('href', () => {
    it('should wrap the text with a string url', () => {
      const result = createText('Hello', { href: 'https://example.com' })
      expect(result).toEqual('\u001B]8;;https://example.com\u0007Hello\u001B]8;;\u0007')
    })

    it('should wrap the text with an URL instance', () => {
      const result = createText('Hello', { href: new URL('https://example.com') })
      expect(result).toEqual('\u001B]8;;https://example.com/\u0007Hello\u001B]8;;\u0007')
    })

    it('should handle query parameters', () => {
      const result = createText('Hello', { href: 'https://example.com?foo=bar' })
      expect(result).toEqual('\u001B]8;;https://example.com?foo=bar\u0007Hello\u001B]8;;\u0007')
    })

    it('should handle hash fragments', () => {
      const result = createText('Hello', { href: 'https://example.com#foo' })
      expect(result).toEqual('\u001B]8;;https://example.com#foo\u0007Hello\u001B]8;;\u0007')
    })
  })

  describe('attributes', () => {
    it('should make the text blink', () => {
      const result = createText('Hello', { isBlinking: true })
      expect(result).toEqual('\u001B[5mHello\u001B[25m')
    })

    it('should stylize the text as bold', () => {
      const result = createText('Hello', { isBold: true })
      expect(result).toEqual('\u001B[1mHello\u001B[22m')
    })

    it('should stylize the text as dim', () => {
      const result = createText('Hello', { isMuted: true })
      expect(result).toEqual('\u001B[2mHello\u001B[22m')
    })

    it('should hide the text', () => {
      const result = createText('Hello', { isHidden: true })
      expect(result).toEqual('\u001B[8mHello\u001B[28m')
    })

    it('should invert the text', () => {
      const result = createText('Hello', { isInverted: true })
      expect(result).toEqual('\u001B[7mHello\u001B[27m')
    })

    it('should stylize the text as italic', () => {
      const result = createText('Hello', { isItalic: true })
      expect(result).toEqual('\u001B[3mHello\u001B[23m')
    })

    it('should stylize the text as strikethrough', () => {
      const result = createText('Hello', { isStrikedthrough: true })
      expect(result).toEqual('\u001B[9mHello\u001B[29m')
    })

    it('should stylize the text as underline', () => {
      const result = createText('Hello', { isUnderlined: true })
      expect(result).toEqual('\u001B[4mHello\u001B[24m')
    })
  })

  describe('multiple attributes', () => {
    it('should combine multiple attributes', () => {
      const result = createText('Hello', { isBold: true, isItalic: true })
      expect(result).toEqual('\u001B[3m\u001B[1mHello\u001B[22m\u001B[23m')
    })

    it('should combine multiple attributes with colors', () => {
      const result = createText('Hello', { textColor: [1, 2, 3], isBold: true, isItalic: true })
      expect(result).toEqual('\u001B[3m\u001B[1m\u001B[38;2;1;2;3mHello\u001B[39m\u001B[22m\u001B[23m')
    })
  })
})
