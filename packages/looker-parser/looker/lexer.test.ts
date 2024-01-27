/* eslint-disable sonarjs/no-duplicate-string */
import { Lexer, CHARACTER_TO_TOKEN } from './lexer'
import {
  TokenNewline,
  TokenWhitespace,
  TokenComment,
  TokenExpressionBlock,
  TokenQuotedLiteral,
  TokenLiteral,
  TokenStreamStart,
  TokenStreamEnd,
  TokenColon,
  TokenExpressionBlockEnd,
} from './lexerTokens'

describe('peek', () => {
  it('should  return one character', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const result = lexer.peek()
    expect(result).toBe('S')
  })

  it('should return multiple characters', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const result1 = lexer.peek(2)
    const result2 = lexer.peek(3)
    expect(result1).toBe('So')
    expect(result2).toBe('Som')
  })

  it('should not increase index', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const index = lexer.index
    lexer.peek()
    expect(lexer.index).toBe(index)
  })
})

describe('seek', () => {
  it('should return undefined', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const result = lexer.seek()
    expect(result).toBeUndefined()
  })

  it('should increase index by one', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const index = lexer.index
    lexer.seek()
    expect(lexer.index).toBe(index + 1)
  })

  it('should increase index by length', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const index = lexer.index
    lexer.seek(3)
    expect(lexer.index).toBe(index + 3)
  })
})

describe('read', () => {
  it('should return current character', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const currentChar = text[lexer.index]
    const result = lexer.read()
    expect(result).toBe(currentChar)
  })

  it('should return multiple characters', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const result1 = lexer.read(2)
    const result2 = lexer.read(3)
    expect(result1).toBe('So')
    expect(result2).toBe('me ')
  })

  it('should increase index by one', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const index = lexer.index
    lexer.read()
    expect(lexer.index).toBe(index + 1)
  })

  it('should increase index by length', () => {
    const text = 'Some sample text for testing.'
    const lexer = new Lexer(text)
    const index = lexer.index
    lexer.read(3)
    expect(lexer.index).toBe(index + 3)
  })
})

describe('scanWhitespace', () => {
  it('should return linebreak token', () => {
    const lexer = new Lexer('\nHello World!')
    const result = lexer.scanWhitespace()
    const expected = new TokenNewline('\n', 1)
    expect(result).toEqual(expected)
  })

  it('should return inline whitespace token', () => {
    const lexer = new Lexer('\t Hello World!')
    const result = lexer.scanWhitespace()
    const expected = new TokenWhitespace('\t ', 1)
    expect(result).toEqual(expected)
  })

  it('should return not mistake inline whitespace for linebreak', () => {
    const lexer = new Lexer('\n\t Hello World!')
    const result1 = lexer.scanWhitespace()
    const result2 = lexer.scanWhitespace()
    const expected1 = new TokenNewline('\n', 1)
    const expected2 = new TokenWhitespace('\t ', 2)
    expect(result1).toEqual(expected1)
    expect(result2).toEqual(expected2)
  })
})

describe('scanComment', () => {
  it('should return scanned comment terminated by end of file', () => {
    const text = '# Make this better'
    const lexer = new Lexer(text)
    const token = lexer.scanComment()
    expect(token).toEqual(new TokenComment('# Make this better', 1))
  })

  it('should return scanned comment terminated by a newline', () => {
    const text = '# Make this better \n\nSomething'
    const lexer = new Lexer(text)
    const token = lexer.scanComment()
    expect(token).toEqual(new TokenComment('# Make this better ', 1))
  })
})

describe('scanExpressionBlock', () => {
  it('should return scanned expression block', () => {
    const text = 'SELECT * FROM ${TABLE} ;;'
    const lexer = new Lexer(text)
    const token = lexer.scanExpressionBlock()
    expect(token).toEqual(new TokenExpressionBlock('SELECT * FROM ${TABLE} ', 1))
  })

  it('scan expression block with complex sql block', () => {
    const lexer = new Lexer('concat(${orders.order_id}, \'|\',\n${orders__items.primary_key}) ;;')
    const result = lexer.scanExpressionBlock()
    const expected = new TokenExpressionBlock('concat(${orders.order_id}, \'|\',\n${orders__items.primary_key}) ', 1)
    expect(result).toEqual(expected)
  })
})

describe('scanStringLiteral', () => {
  it('should return scanned string literal', () => {
    const lexer = new Lexer('This is quoted text."')
    const token = lexer.scanQuotedLiteral()
    expect(token).toEqual(new TokenQuotedLiteral('This is quoted text.', 1))
  })

  it('should return scanned string literal with otherwise illegal chars', () => {
    const lexer = new Lexer('This: is {quoted} \n text."')
    const token = lexer.scanQuotedLiteral()
    expect(token).toEqual(new TokenQuotedLiteral('This: is {quoted} \n text.', 1))
  })

  it('should return scanned string literal with escaped quotes', () => {
    const lexer = new Lexer('#.### \\"M\\""')
    const token = lexer.scanQuotedLiteral()
    expect(token).toEqual(new TokenQuotedLiteral('#.### "M"', 1))
  })
})

describe('scanLiteral', () => {
  it('should return scanned literal', () => {
    const lexer = new Lexer('unquoted_literal')
    const token = lexer.scanLiteral()
    expect(token).toEqual(new TokenLiteral('unquoted_literal', 1))
  })

  it('should return scanned literal with following whitespace', () => {
    const lexer = new Lexer('unquoted_literal \n and text following whitespace')
    const token = lexer.scanLiteral()
    expect(token).toEqual(new TokenLiteral('unquoted_literal ', 1))
  })
})

describe('scan', () => {
  it.each(Object.entries(CHARACTER_TO_TOKEN))('should scan single character token %s', (char, token) => {
    const lexer = new Lexer(char)
    const result = lexer.scan()
    expect(result[1]).toBeInstanceOf(token)
  })

  it('scan comment with surrounding whitespace', () => {
    const text = '\n# A comment\n '
    const lexer = new Lexer(text)
    const output = lexer.scan()
    expect(output).toEqual([
      new TokenStreamStart(1),
      new TokenNewline('\n', 1),
      new TokenComment('# A comment', 2),
      new TokenNewline('\n', 2),
      new TokenWhitespace(' ', 3),
      new TokenStreamEnd(3),
    ])
  })


  it('scan with complex sql block', () => {
    const text = 'sql_distinct_key: concat(${orders.order_id}, \'|\', ${orders__items.primary_key}) ;;'
    const lexer = new Lexer(text)
    const output = lexer.scan()
    expect(output).toEqual([
      new TokenStreamStart(1),
      new TokenLiteral('sql_distinct_key', 1),
      new TokenColon(1),
      new TokenExpressionBlock(' concat(${orders.order_id}, \'|\', ${orders__items.primary_key}) ', 1),
      new TokenExpressionBlockEnd(1),
      new TokenStreamEnd(1),
    ])
  })

  it('scan with non expression block starting with sql', () => {
    const text = 'sql_not_reserved_field: yes'
    const lexer = new Lexer(text)
    const output = lexer.scan()
    expect(output).toEqual([
      new TokenStreamStart(1),
      new TokenLiteral('sql_not_reserved_field', 1),
      new TokenColon(1),
      new TokenWhitespace(' ', 1),
      new TokenLiteral('yes', 1),
      new TokenStreamEnd(1),
    ])
  })

  it('scan with non expression block starting with html', () => {
    const text = 'html_not_reserved_field: yes'
    const lexer = new Lexer(text)
    const output = lexer.scan()
    expect(output).toEqual([
      new TokenStreamStart(1),
      new TokenLiteral('html_not_reserved_field', 1),
      new TokenColon(1),
      new TokenWhitespace(' ', 1),
      new TokenLiteral('yes', 1),
      new TokenStreamEnd(1),
    ])
  })

  it('scan with complex sql block', () => {
    const text = 'sql_distinct_key: concat(${orders.order_id}, \'|\', ${orders__items.primary_key}) ;;'
    const lexer = new Lexer(text)
    const output = lexer.scan()
    expect(output).toEqual([
      new TokenStreamStart(1),
      new TokenLiteral('sql_distinct_key', 1),
      new TokenColon(1),
      new TokenExpressionBlock(' concat(${orders.order_id}, \'|\', ${orders__items.primary_key}) ', 1),
      new TokenExpressionBlockEnd(1),
      new TokenStreamEnd(1),
    ])
  })
})
