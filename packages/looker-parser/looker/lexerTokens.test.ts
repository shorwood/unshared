/* eslint-disable sonarjs/no-duplicate-string */
import { Token, TokenColon, TokenComma, TokenComment } from './lexerTokens'

describe('constructor', () => {
  it('should create a token with an id and line number', () => {
    const token = new Token('test', 0)
    expect(token.id).toEqual('test')
    expect(token.line).toEqual(0)
  })
})

describe('toString', () => {
  it('should return the token name if no value is provided', () => {
    const token = new Token('test', 0)
    const result = token.toString()
    expect(result).toEqual('Token')
  })

  it('should return the token name of a custom token if no value is provided', () => {
    const token = new TokenComment('Hello, World!', 0)
    const result = token.toString()
    expect(result).toEqual('TokenComment(Hello, World!)')
  })

  it('should return the token name and value if a value is provided', () => {
    const token = new Token('test', 0, 'Hello, World!')
    const result = token.toString()
    expect(result).toEqual('Token(Hello, World!)')
  })

  it('should return the token name and trimmed value if a value is provided', () => {
    const token = new Token('test', 0, '  Hello, World!  ')
    const result = token.toString()
    expect(result).toEqual('Token(Hello, World!)')
  })
})

describe('equals', () => {
  it('should return true if two token of the same type have the same value', () => {
    const a = new TokenComment('Hello, World!', 0)
    const b = new TokenComment('Hello, World!', 0)
    const result = a.equals(b)
    expect(result).toEqual(true)
  })

  it('should return false if two token of the same type have different values', () => {
    const a = new TokenComment('Hello, World!', 0)
    const b = new TokenComment('Goodbye, World!', 0)
    const result = a.equals(b)
    expect(result).toEqual(false)
  })

  it('should return true if two tokens of different types have no value', () => {
    const a = new TokenComma(0)
    const b = new TokenComma(0)
    const result = a.equals(b)
    expect(result).toEqual(true)
  })

  it('should return false if two tokens have different types', () => {
    const a = new TokenComma(0)
    const b = new TokenColon(0)
    const result = a.equals(b)
    expect(result).toEqual(false)
  })
})
