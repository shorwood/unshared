/* eslint-disable sonarjs/no-duplicate-string */
import { Constructor, MaybeArray } from '@unshared/types'
import {
  TokenComment,
  TokenNewline,
  TokenLiteral,
  TokenColon,
  Token,
  TokenWhitespace,
  TokenQuotedLiteral,
  TokenExpressionBlock,
  TokenComma,
  TokenListEnd,
  TokenListStart,
  TokenStreamStart,
  TokenStreamEnd,
  TokenBlockEnd,
  TokenBlockStart,
  TokenExpressionBlockEnd,
} from './lexerTokens'
import {
  NodeBlock,
  NodeContainer,
  NodeDocument,
  NodeList,
  NodeKV,
} from './parserNodes'
import {
  SyntaxBracketLeft,
  SyntaxBracketRight,
  SyntaxColon,
  SyntaxComma,
  SyntaxCurlyLeft,
  SyntaxCurlyRight,
  SyntaxExpressionBlock,
  SyntaxQuotedLiteral,
  SyntaxToken,
} from './parserSyntax'
import { strip, Backtrack } from './utils'

/**
 * Parses a sequence of tokenized LookML into a parse tree.
 *
 * This parser is a recursive descent parser which uses the grammar listed below (in
 * PEG format). Each grammar rule aligns with a corresponding method (e.g.
 * parse_expression).
 */
export class Parser {
  /** The current position in the token sequence being parsed. */
  index: number = 0
  /** The farthest index of progress during parsing. */
  progress: number = 0
  /** The level of recursion into nested expressions. */
  depth: number = -1

  /**
   * Returns if the current index is at the end of the token sequence.
   *
   * @returns `true` if the current index is at the end of the token sequence.
   */
  get readable(): boolean {
    return this.tokens[this.index] !== undefined
  }

  /**
   * Return the token at the progress index.
   *
   * @returns The token at the progress index.
   */
  get tokenProgress(): Token {
    return this.tokens[this.progress]
  }

  /**
   * Get the current token.
   *
   * @returns The current token.
   */
  get token(): Token {
    return this.tokens[this.index]
  }

  /**
   * Create a new parser with the given tokens.
   *
   * @param tokens A sequence of tokens to be parsed.
   * @returns A new parser instance.
   * @example
   * const lexer = new Lexer('view: foo { dimension: bar {} }').scan()
   * const parser = new Parser(lexer.tokens)
   */
  constructor(public tokens: readonly Token[]) {}

  /**
   * Returns the character at the current index of the text being lexed
   * with the option to return multiple characters.
   *
   * @param length The number of characters to return.
   * @returns The character at the current index.
   * @example
   * const parser = new Parser(lexer.tokens)
   * parser.peek() // => [Token { ... }]
   */
  peek<T extends Token>(): T
  peek<T extends Token>(length: number): T[]
  peek<T extends Token>(length?: number | undefined): T | T[]
  peek(length?: number | undefined): Token | Token[] {
    return length === undefined
      ? this.tokens[this.index]
      : this.tokens.slice(this.index, this.index + length) || []
  }

  /**
   * Moves the index forward by n characters.
   *
   * @param length The number of positions forward to move the index.
   * @example
   * const parser = new Parser(lexer.tokens)
   * parser.seek() // => Token { ... }
   */
  seek(length: number = 1) {
    this.index += length
    this.progress = Math.max(this.progress, this.index)
    this.progress = Math.min(this.progress, this.tokens.length - 1)
  }

  /**
   * Returns the current index character and seeks the index by 1 token.
   *
   * @param length The number of positions forward to move the index.
   * @returns The token at the current index.
   * @example
   * const parser = new Parser([new TokenLiteral('foo', 1)])
   * parser.consume() // => TokenLiteral { ... }
   * parser.index // => 1
   */
  read<T extends Token>(): T // TODO: add `undefined` to return type
  read<T extends Token>(length: number): T[]
  read<T extends Token>(length?: number): T | T[]
  read(length?: number): Token | Token[] {
    const tokens = this.peek(length)
    this.seek(length)
    return tokens
  }

  /**
   * Compares the current token is an instance of any of the specified token constructors.
   *
   * @param tokenCtors A tuple of token constructors to compare to.
   * @param skipTrivia If `true`, skip trivia before checking.
   * @returns `true` if the current index token type matches any of the specified token types.
   * @example
   * const token = new TokenLiteral('Hello, World', 1)
   * const parser = new Parser(tokens)
   * parser.compare([TokenLiteral, CommentToken]) // => true
   */
  compare(tokenCtors: MaybeArray<Constructor>, skipTrivia: boolean = false): boolean {
    const mark = this.index
    if (skipTrivia) this.readTrivia()
    tokenCtors = Array.isArray(tokenCtors) ? tokenCtors : [tokenCtors]
    const peeked = this.peek()
    const isMatch = tokenCtors.some(ct => peeked instanceof ct)
    if (skipTrivia) this.index = mark
    return isMatch
  }

  /**
   * Returns the value of the current index token, advancing the index 1 token.
   *
   * @returns The value of the token at the current index.
   * @example
   * const parser = new Parser([new TokenLiteral('foo', 1)])
   * parser.consumeTokenValue() // => 'foo'
   * parser.index // => 1
   */
  readValue(): string {
    const token = this.read()
    if (token.value === undefined)
      throw new Error(`Token ${token} does not have a consumable value.`)
    return token.value
  }

  /**
   * Returns all trivial values from the current index until a non-trivial token is found.
   *
   * @param onlyLinebreaks If `true` comsume linebreaks instead of whitespace.
   * @returns The continuous trivia values.
   * @example
   * const tokens = [
   *   new WhitespaceToken(' ', 1),
   *   new CommentToken('# This is a comment.', 1),
   *   new WhitespaceToken(' ', 1),
   * ]
   *
   * const parser = new Parser(tokens)
   * parser.readTrivia() // => ' # This is a comment. '
   */
  readTrivia(onlyLinebreaks: boolean = false): string {
    const result: string[] = []
    const toConsume: Constructor[] = [TokenComment, onlyLinebreaks ? TokenNewline : TokenWhitespace]

    // --- While there are tokens to consume, consume them.
    while (this.readable) {
      const willConsume = this.compare(toConsume)
      if (!willConsume) break

      // --- Consume the token and add it's value to the result.
      const value = this.readValue()
      result.push(value)
    }

    // --- Return the result.
    return result.join('')
  }

  /**
   * Main method of this class and a wrapper for the container parser.
   *
   * @returns A document node, the root node of the LookML parse tree.
   * @example new Parser(lexer.tokens).parse() // => DocumentNode { ... }
   */
  parse(): NodeDocument {
    // --- Skip the stream start token.
    if (this.compare(TokenStreamStart)) this.seek()

    // --- Parse the top-level container node.
    const prefix = this.readTrivia()
    const container = this.parseContainer()
    const suffix = this.readTrivia()
    return new NodeDocument(container, prefix, suffix)
  }

  /**
   * Returns a `NodeContainer` that represents a container. A container is a
   * top-level node that contains a list of blocks, key-value pairs, and lists.
   *
   * @returns A container node or `undefined` if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseContainer() // => NodeContainer { ... }
   */
  @Backtrack
  parseContainer(): NodeContainer {
    const items: Array<NodeBlock | NodeKV | NodeList> = []

    while (this.readable) {

      if (this.compare([TokenStreamEnd, TokenBlockEnd])) break

      const value = this.parseBlock() ?? this.parseKV() ?? this.parseList()
      if (!value) throw new SyntaxError(`Unable to find a matching expression for '${this.tokenProgress.toString()}' on line ${this.tokenProgress.line}`)


      items.push(value)
    }

    return new NodeContainer(items, this.depth === 0)
  }

  /**
   * Returns a `NodeBlock` that represents a LookML block. Such a block is
   * defined by a key, a name, and a container.
   *
   * @returns A block node or `undefined` if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseBlock() // => NodeBlock { ... }
   */
  @Backtrack
  parseBlock(): NodeBlock | undefined {

    // --- Extract the key from the current token.
    const key = this.parseKey()
    if (!key) return

    // --- Extract the LookML block name.
    if (!this.compare(TokenLiteral)) return
    const nameToken = this.read<TokenLiteral>()
    const name = new SyntaxToken(nameToken.value, undefined, undefined, nameToken.line )

    // --- Extract the block's left brace.
    const blockStartPrefix = this.readTrivia()
    if (!this.compare(TokenBlockStart)) return
    const blockStartToken = this.read<TokenBlockStart>()
    const blockStartSuffix = this.readTrivia(true)
    const blockStart = new SyntaxCurlyLeft(blockStartPrefix, blockStartSuffix, blockStartToken.line)

    // --- Extract the block's container.
    const container = this.parseContainer()


    // --- Extract the block's right brace.
    const blockEndPrefix = this.readTrivia()
    if (!this.compare(TokenBlockEnd)) return
    const blockEndToken = this.read<TokenBlockEnd>()
    const blockEndSuffix = this.readTrivia(true)
    const blockEnd = new SyntaxCurlyRight(blockEndPrefix, blockEndSuffix, blockEndToken.line)

    // --- Return the block.
    return new NodeBlock(key[0], key[1], name, blockStart, container, blockEnd)
  }

  /**
   * Returns a `NodeKV` that represents a key-value pair. The key is a literal
   * and the value is a literal, quoted literal, or expression block.
   *
   * @returns A key-value node or `undefined` if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseKV() // => NodeKV { ... }
   */
  @Backtrack
  parseKV(): NodeKV | undefined {
    const key = this.parseKey()
    if (!key) return
    const value = this.parseValue()
    if (!value) return
    return new NodeKV(key[0], value, key[1])
  }

  /**
   * Returns a syntax token that represents a literal key and colon character.
   *
   * @returns A syntax token representing a literal key and colon character.
   * @example new Parser(lexer.tokens).parseKey() // => SyntaxToken { ... }
   */
  @Backtrack
  parseKey(): [SyntaxToken, SyntaxColon] | undefined {

    // --- Extract the key.
    const keyPrefix = this.readTrivia()
    if (!this.compare(TokenLiteral)) return
    const keyToken = this.read<TokenLiteral>()
    const key = new SyntaxToken(keyToken.value, keyPrefix, undefined, keyToken.line)

    // --- Extract the colon.
    const colonPrefix = this.readTrivia()
    if (!this.compare(TokenColon)) return
    const colonToken = this.read() as TokenColon
    const colonSuffix = this.readTrivia()
    const colon = new SyntaxColon(colonPrefix, colonSuffix, colonToken.line)

    // --- Return the key and colon.
    return [key, colon]
  }

  /**
   * Returns a syntax token that represents a value.
   *
   * @returns A syntax token with the parsed value or None if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseValue() // => SyntaxToken { ... }
   */
  @Backtrack
  parseValue(): SyntaxExpressionBlock | SyntaxQuotedLiteral | SyntaxToken | undefined {
    const prefix = this.readTrivia()

    // --- Check for a literal.
    if (this.compare(TokenLiteral)) {
      const token = this.read<TokenLiteral>()
      const suffix = this.readTrivia()
      return new SyntaxToken(token.value, prefix, suffix, token.line)
    }

    // --- Check for a quoted literal.
    if (this.compare(TokenQuotedLiteral)) {

      const token = this.read<TokenQuotedLiteral>()
      const suffix = this.readTrivia(true)
      return new SyntaxQuotedLiteral(token.value, prefix, suffix, token.line)
    }

    // --- Check for an LookML expression block.
    if (this.compare(TokenExpressionBlock)) {
      const token = this.read<TokenExpressionBlock>()
      const tokenEnd = this.read<TokenExpressionBlockEnd>()
      if (tokenEnd instanceof TokenExpressionBlockEnd === false)
        throw new SyntaxError(`Expected an expression block end on line ${this.tokenProgress.line}`)
      const suffix = this.readTrivia(true)
      const [exprPrefix, value, exprSuffix] = strip(token.value)
      return new SyntaxExpressionBlock(value, prefix, suffix, exprPrefix, exprSuffix, token.line)
    }
  }

  /**
   * Returns a `NodeList` that represents a list.
   *
   * @returns A syntax token with the parsed list or None if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseList() // => NodeList { ... }
   */
  @Backtrack
  parseList(): NodeList | undefined {
    const key = this.parseKey()
    if (!key) return

    // --- Extract the left bracket.
    const bracketStartPrefix = this.readTrivia()
    if (!this.compare(TokenListStart)) return
    const bracketStartToken = this.read<TokenListStart>()
    const bracketStart = new SyntaxBracketLeft(bracketStartPrefix, undefined, bracketStartToken.line)

    // --- Extract the list values and the surrounding commas.
    const commaLeading = this.parseComma()
    const values = this.parseListValues()
    const commaTrailing = this.parseComma()

    // --- Extract the right bracket.
    const bracketEndPrefix = this.readTrivia()
    if (!this.compare(TokenListEnd)) return
    const bracketEndToken = this.read<TokenListEnd>()
    const bracketEndSuffix = this.readTrivia(true)
    const bracketEnd = new SyntaxBracketRight(bracketEndPrefix, bracketEndSuffix, bracketEndToken.line)

    // --- Return the list node.
    return new NodeList(key[0], key[1], values, bracketStart, bracketEnd, commaLeading, commaTrailing)
  }

  /**
   * Return a list of values that are included in a `NodeList`.
   *
   * @returns A list of values or an empty list if the grammar doesn't match.
   * @throws A `SyntaxError` if the list is invalid.
   * @example new Parser(lexer.tokens).parseListValues() // => [SyntaxToken { ... }]
   */
  // @Backtrack
  // eslint-disable-next-line sonarjs/cognitive-complexity
  parseListValues(): Array<NodeKV | SyntaxExpressionBlock | SyntaxQuotedLiteral | SyntaxToken> {
    const values: Array<NodeKV | SyntaxExpressionBlock | SyntaxQuotedLiteral | SyntaxToken> = []

    // --- While there are more values, parse them.
    let index = 0
    while (this.readable) {
      this.readTrivia()

      // --- Abort if the list ends.
      if (this.compare(TokenListEnd)) break

      // --- Assert there is a comma between values. If so, skip it.
      if (index > 0 && this.read() instanceof TokenComma === false)
        throw new SyntaxError(`Expected a comma between list values on line ${this.tokenProgress.line}`)

      // --- Assert that the list ends before the end of the stream.
      if (this.compare(TokenStreamEnd) || !this.readable)
        throw new SyntaxError(`Unexpected end of stream on line ${this.tokenProgress.line}`)

      // --- Parse, assert and push the value.
      const value = this.parseKV() ?? this.parseValue()
      if (!value) throw new SyntaxError(`Expected a value or key-value pair on line ${this.tokenProgress.line}`)
      if (value instanceof SyntaxExpressionBlock)
        throw new SyntaxError(`Cannot use an expression block in a list on line ${this.tokenProgress.line}`)
      values.push(value)
      index++
    }

    // --- Assert that all values are either key-value pairs or values.
    const isKV = values[0] instanceof NodeKV
    const isUniform = values.every(value => value instanceof NodeKV === isKV)
    if (!isUniform) throw new SyntaxError(`Expected all list items to be ${isKV ? 'values' : 'key-value pairs'} on line ${this.tokenProgress.line}`)

    // --- Return the values.
    return values
  }

  /**
   * Returns a syntax token that represents a comma.
   *
   * @returns A syntax token with the parsed comma or None if the grammar doesn't match.
   * @example new Parser(lexer.tokens).parseComma() // => SyntaxComma { ... }
   */
  @Backtrack
  parseComma(): SyntaxComma | undefined {
    const prefix = this.readTrivia()
    if (!this.compare(TokenComma)) return
    const token = this.read<TokenComma>()
    const suffix = this.readTrivia()
    return new SyntaxComma(prefix, suffix, token.line)
  }
}
