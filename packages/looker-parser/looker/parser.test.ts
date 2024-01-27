/* eslint-disable sonarjs/no-duplicate-string */
import {
  TokenComment,
  TokenStreamStart,
  TokenWhitespace,
  TokenNewline,
  TokenComma,
  TokenLiteral,
  TokenQuotedLiteral,
  TokenExpressionBlock,
  TokenColon,
  TokenListEnd,
  TokenStreamEnd,
  TokenListStart,
  Token,
} from './lexerTokens'
import { Parser } from './parser'
import {
  NodeKV,
  NodeList,
} from './parserNodes'
import {
  SyntaxBracketLeft,
  SyntaxBracketRight,
  SyntaxColon,
  SyntaxComma,
  SyntaxExpressionBlock,
  SyntaxQuotedLiteral,
  SyntaxToken,
} from './parserSyntax'

describe('constructor', () => {
  it('should instantiate a new parser', () => {
    const parser = new Parser([])
    expect(parser).toBeInstanceOf(Parser)
  })
})

describe('peek', () => {
  it('should return the current token', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const result = parser.peek()
    expect(result).toEqual(tokenStart)
  })

  it('should return multiple tokens if length is specified', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    const result = parser.peek(2)
    expect(result).toEqual([tokenStart, tokenComment])
  })

  it('should remain at the same index', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    parser.peek()
    expect(parser.index).toEqual(0)
  })
})

describe('seek', () => {
  it('should return undefined', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    const result = parser.seek()
    expect(result).toBeUndefined()
  })

  it('should seek the index by one if no length is specified', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    parser.seek()
    expect(parser.index).toEqual(1)
  })

  it('should seek the index by the specified length', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    parser.seek(2)
    expect(parser.index).toEqual(2)
  })
})

describe('consume', () => {
  it('should return the current token', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const result = parser.read()
    expect(result).toEqual(tokenStart)
  })

  it('should return multiple tokens if length is specified', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    const result = parser.read(2)
    expect(result).toEqual([tokenStart, tokenComment])
  })

  it('should seek the index by one if no length is specified', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    parser.read()
    expect(parser.index).toEqual(1)
  })

  it('should seek the index by the specified length', () => {
    const tokenStart = new TokenStreamStart(1)
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenStart, tokenComment])
    parser.read(2)
    expect(parser.index).toEqual(2)
  })
})

describe('compare', () => {
  it('should return true if the current token type matches the specified token type', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const result = parser.compare(TokenStreamStart)
    expect(result).toBe(true)
  })

  it('should return true if the current token type matches any of the specified token types', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const result = parser.compare([TokenStreamStart, TokenComment])
    expect(result).toBe(true)
  })

  it('should return false if the current token type does not match the specified token type', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const result = parser.compare(TokenComment)
    expect(result).toBe(false)
  })
})

describe('consumeTokenValue', () => {
  it('should return the value of the current token', () => {
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenComment])
    const result = parser.readValue()
    expect(result).toEqual('# Hello, World!')
  })

  it('should seek the index by one', () => {
    const tokenComment = new TokenComment('# Hello, World!', 1)
    const parser = new Parser([tokenComment])
    parser.readValue()
    expect(parser.index).toEqual(1)
  })

  it('should throw an error if the token has no value', () => {
    const tokenStart = new TokenStreamStart(1)
    const parser = new Parser([tokenStart])
    const shouldThrow = () => parser.readValue()
    expect(shouldThrow).toThrow(Error)
  })
})

describe('consumeTrivia', () => {
  it('should return the trivia\'s value', () => {
    const parser = new Parser([
      new TokenComment('# Hello,', 1),
      new TokenWhitespace('\n', 1),
      new TokenComment('# World!', 1),
      new TokenNewline('\n', 1),
      new TokenComment('# Goodbye,', 2),
    ])
    const result = parser.readTrivia()
    expect(result).toEqual('# Hello,\n# World!')
  })

  it('should return the trivia\'s value if only linebreaks are specified', () => {
    const parser = new Parser([
      new TokenComment('# Hello,', 1),
      new TokenNewline(' ', 1),
      new TokenComment('# World!', 1),
      new TokenWhitespace('\n', 1),
      new TokenComment('# Goodbye,', 2),
    ])
    const result = parser.readTrivia(true)
    expect(result).toEqual('# Hello, # World!')
  })
})

describe('parseComma', () => {
  it('should return the node of a comma syntax', () => {
    const tokenComma = new TokenComma(1)
    const parser = new Parser([tokenComma])
    const result = parser.parseComma()
    const expected = new SyntaxComma(undefined, undefined, 1)
    expect(result).toEqual(expected)
  })

  it('should return undefined if the current token is not a comma', () => {
    const tokenWhitespace = new TokenWhitespace(' ', 1)
    const parser = new Parser([tokenWhitespace])
    const result = parser.parseComma()
    expect(result).toBeUndefined()
  })

  it('should preserve prefix and suffix trivia', () => {
    const tokenWhitespace = new TokenWhitespace(' ', 1)
    const tokenComment = new TokenComment('#', 1)
    const tokenComma = new TokenComma(1)
    const parser = new Parser([tokenWhitespace, tokenComma, tokenWhitespace, tokenComment])
    const result = parser.parseComma()
    const expected = new SyntaxComma(' ', ' #', 1)
    expect(result).toEqual(expected)
  })
})

describe('parseKey', () => {
  it('should return the node of a key token', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
    ])
    const result = parser.parseKey()
    const expected = [
      new SyntaxToken('foo', undefined, undefined, 1),
      new SyntaxColon(undefined, undefined, 1),
    ]
    expect(result).toEqual(expected)
  })

  it('should return undefined if the current token is not a key', () => {
    const parser = new Parser([
      new TokenWhitespace(' ', 1),
    ])
    const result = parser.parseKey()
    expect(result).toBeUndefined()
  })

  it('should preserve prefix and suffix trivia', () => {
    const parser = new Parser([
      new TokenWhitespace(' ', 1),
      new TokenLiteral('foo', 1),
      new TokenWhitespace(' ', 1),
      new TokenColon(1),
      new TokenComment('#', 1),
    ])
    const result = parser.parseKey()
    expect(result).toEqual([
      new SyntaxToken('foo', ' ', undefined, 1),
      new SyntaxColon(' ', '#', 1),
    ])
  })
})

describe('parseValue', () => {
  it('should return the node of a literal token', () => {
    const parser = new Parser([
      new TokenLiteral('123', 1),
    ])
    const result = parser.parseValue()
    const expected = new SyntaxToken('123', undefined, undefined, 1)
    expect(result).toEqual(expected)
  })

  it('should return the node of a quoted literal token', () => {
    const parser = new Parser([
      new TokenQuotedLiteral('123', 1),
    ])
    const result = parser.parseValue()
    const expected = new SyntaxQuotedLiteral('123', undefined, undefined, 1)
    expect(result).toEqual(expected)
  })

  it('should return the node of an expression block token', () => {
    const parser = new Parser([
      new TokenExpressionBlock(' foobar ', 1),
      new TokenExpressionBlock(';;', 1),
    ])
    const result = parser.parseValue()
    const expected = new SyntaxExpressionBlock('foobar', undefined, undefined, ' ', ' ', 1)
    expect(result).toEqual(expected)
  })

  it('should return undefined if the current token is not a value', () => {
    const tokenWhitespace = new TokenWhitespace(' ', 1)
    const parser = new Parser([tokenWhitespace])
    const result = parser.parseValue()
    expect(result).toBeUndefined()
  })

  it('should preserve prefix and suffix trivia', () => {
    const tokenWhitespace = new TokenWhitespace(' ', 1)
    const tokenComment = new TokenComment('#', 1)
    const tokenLiteral = new TokenLiteral('123', 1)
    const parser = new Parser([tokenWhitespace, tokenLiteral, tokenWhitespace, tokenComment])
    const result = parser.parseValue()
    const expected = new SyntaxToken('123', ' ', ' #', 1)
    expect(result).toEqual(expected)
  })
})

describe('parseKV', () => {
  it('should return the node of a key-value pair', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenLiteral('123', 1),
    ])
    const result = parser.parseKV()
    const expected = new NodeKV(
      new SyntaxToken('foo', undefined, undefined, 1),
      new SyntaxToken('123', undefined, undefined, 1),
      new SyntaxColon(undefined, undefined, 1),
    )
    expect(result).toEqual(expected)
  })

  it('should return undefined if the current token is not a key-value pair', () => {
    const parser = new Parser([
      new TokenWhitespace(' ', 1),
    ])
    const result = parser.parseKV()
    expect(result).toBeUndefined()
  })

  it('should preserve prefix and suffix trivia', () => {
    const parser = new Parser([
      new TokenWhitespace(' ', 1),
      new TokenLiteral('foo', 1),
      new TokenWhitespace(' ', 1),
      new TokenColon(1),
      new TokenWhitespace(' ', 1),
      new TokenLiteral('123', 1),
      new TokenComment('#', 1),
    ])
    const result = parser.parseKV()
    const expected = new NodeKV(
      new SyntaxToken('foo', ' ', '', 1),
      new SyntaxToken('123', '', '#', 1),
      new SyntaxColon(' ', ' ', 1),
    )
    expect(result).toEqual(expected)
  })
})

describe('parseListValues', () => {
  it('should return the nodes of a kv list', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenLiteral('1', 1),
      new TokenComma(1),
      new TokenLiteral('bar', 1),
      new TokenColon(1),
      new TokenQuotedLiteral('2', 1),
      new TokenListEnd(1),
    ])
    const result = parser.parseListValues()
    const expected = [
      new NodeKV(
        new SyntaxToken('foo', undefined, undefined, 1),
        new SyntaxToken('1', undefined, undefined, 1),
        new SyntaxColon(undefined, undefined, 1),
      ),
      new NodeKV(
        new SyntaxToken('bar', undefined, undefined, 1),
        new SyntaxQuotedLiteral('2', undefined, undefined, 1),
        new SyntaxColon(undefined, undefined, 1),
      ),
    ]
    expect(result).toEqual(expected)
  })

  it('should return the nodes of a list', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenComma(1),
      new TokenQuotedLiteral('bar', 1),
    ])
    const result = parser.parseListValues()
    const expected = [
      new SyntaxToken('foo', undefined, undefined, 1),
      new SyntaxQuotedLiteral('bar', undefined, undefined, 1),
    ]
    expect(result).toEqual(expected)
  })

  it('should throw if the list is not separated by commas', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenLiteral('1', 1),
      new TokenLiteral('bar', 1),
    ])
    const shouldThrow = () => parser.parseListValues()
    expect(shouldThrow).toThrow(SyntaxError)
  })

  it('should throw if the list is not terminated by a list end', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenLiteral('1', 1),
      new TokenStreamEnd(1),
    ])
    const shouldThrow = () => parser.parseListValues()
    expect(shouldThrow).toThrow(SyntaxError)
  })

  it('should throw if the list contains an expression block', () => {
    const parser = new Parser([
      new TokenExpressionBlock('1', 1),
    ])
    const shouldThrow = () => parser.parseListValues()
    expect(shouldThrow).toThrow(SyntaxError)
  })

  it('should thrwos if the list does not contain a KV or value', () => {
    const parser = new Parser([
      new Token('<unknown>', 1),
    ])
    const shouldThrow = () => parser.parseListValues()
    expect(shouldThrow).toThrow(SyntaxError)
  })

  it('should throw if the list contains KV and value', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenLiteral('1', 1),
      new TokenComma(1),
      new TokenLiteral('bar', 1),
    ])
    const shouldThrow = () => parser.parseListValues()
    expect(shouldThrow).toThrow(SyntaxError)
  })
})

describe('parseValues', () => {
  it('should return the nodes of a kv list', () => {
    const parser = new Parser([
      new TokenLiteral('foo', 1),
      new TokenColon(1),
      new TokenListStart(1),
      new TokenLiteral('bar', 1),
      new TokenColon(1),
      new TokenLiteral('1', 1),
      new TokenListEnd(1),
    ])
    const result = parser.parseList()
    const expected = new NodeList(
      new SyntaxToken('foo', undefined, undefined, 1),
      new SyntaxColon(undefined, undefined, 1),
      [
        new NodeKV(
          new SyntaxToken('bar', undefined, undefined, 1),
          new SyntaxToken('1', undefined, undefined, 1),
          new SyntaxColon(undefined, undefined, 1),
        ),
      ],
      new SyntaxBracketLeft(undefined, undefined, 1),
      new SyntaxBracketRight(undefined, undefined, 1),
      undefined,
      undefined,
    )
    expect(result).toEqual(expected)
  })
})
