/* eslint-disable sonarjs/no-duplicate-string */
import { EXPR_BLOCK_KEYS } from './constants'
import {
  Token,
  TokenStreamStart,
  TokenWhitespace,

  TokenComment,
  TokenExpressionBlock,
  TokenLiteral,
  TokenQuotedLiteral,
  TokenNewline,
  TokenColon,
  TokenStreamEnd,
  TokenExpressionBlockEnd,
  TokenBlockStart,
  TokenBlockEnd,
  TokenComma,
  TokenListEnd,
  TokenListStart,
} from './lexerTokens'

/** The EOF character signals the end of the stream. */
export const EOF = '\0' as const

/** Maps a single character to a Token class. */
export const CHARACTER_TO_TOKEN = {
  '{': TokenBlockStart,
  '}': TokenBlockEnd,
  '[': TokenListStart,
  ']': TokenListEnd,
  ',': TokenComma,
  ':': TokenColon,
  ';': TokenExpressionBlockEnd,
} as const

/**
 * Splits a LookML string into a sequence of tokens.
 */
export class Lexer {
  /** Raw LookML to parse, padded with null character to denote end of stream */
  text: string
  /** Position of lexer in characters as it traverses the text */
  index: number
  /** Sequence of tokens that contain the relevant chunks of text */
  tokens: Token[]
  /** Position of lexer in lines as it traverses the text */
  lineNumber: number

  /**
   * Initializes the Lexer with a LookML string and sets the index.
   *
   * @param text The LookML string to be parsed.
   */
  constructor(text: string) {
    this.text = `${text}${EOF}`
    this.index = 0
    this.tokens = []
    this.lineNumber = 1
  }

  /**
   * Returns the character at the current index of the text being lexed
   * with the option to return multiple characters.
   *
   * @param length The number of characters to return.
   * @returns The character at the current index.
   * @example this.peek() // => 'a'
   */
  peek(length = 1): string {
    return this.text.slice(this.index, this.index + length) || EOF
  }

  /**
   * Moves the index forward by n characters.
   *
   * @param length The number of positions forward to move the index.
   * @example
   * const lexer = new Lexer("abc");
   * lexer.seek(2);
   * lexer.peek(); // => 'c'
   */
  seek(length = 1): void {
    this.index += length
  }

  /**
   * Returns the current index character and seeks the index by 1 character.
   *
   * @param length The number of characters to return.
   * @returns The current index character.
   * @example
   * const lexer = new Lexer("abc");
   * lexer.read(); // => 'a'
   * lexer.peek(); // => 'b'
   */
  read(length = 1): string {
    const characters = this.peek(length)
    this.seek(length)
    return characters
  }

  /**
   * Tokenizes LookML into a sequence of tokens.
   *
   * This method skips through the text being lexed until it finds a character that
   * indicates the start of a new token. It reads the relevant characters and adds
   * the tokens to a sequence until it reaches the end of the text.
   *
   * @returns A sequence of tokens.
   * @example
   * const lexer = new Lexer("view: sales { dimension: yes { type: number } }");
   * const tokens = lexer.scan(); // [...Token, ...Token, ...Token]
   */
  scan(): Token[] {
    const tokenStart = new TokenStreamStart(this.lineNumber)
    this.tokens.push(tokenStart)

    let char = this.peek()
    while (char) {

      // --- End of file.
      if (char === EOF) {
        const tokenEOF = new TokenStreamEnd(this.lineNumber)
        this.tokens.push(tokenEOF)
        break
      }

      // --- Whitespace and newlines.
      else if (char === '\n' || char === '\t' || char === ' ') {
        const tokenWhitespace = this.scanWhitespace()
        this.tokens.push(tokenWhitespace)
      }

      // --- Comments.
      else if (char === '#') {
        const tokenComment = this.scanComment()
        this.tokens.push(tokenComment)
      }

      // --- Expression blocks.
      else if (char === ';' && this.peek(2) === ';;') {
        const token = new TokenExpressionBlockEnd(this.lineNumber)
        this.tokens.push(token)
        this.seek(2)
      }

      // --- Literals.
      else if (char === '"') {
        this.seek()
        const tokenQuotedLiteral = this.scanQuotedLiteral()
        this.tokens.push(tokenQuotedLiteral)
      }

      // --- Statically mapped values.
      else if (char in CHARACTER_TO_TOKEN) {
        const token = new CHARACTER_TO_TOKEN[char as keyof typeof CHARACTER_TO_TOKEN](this.lineNumber)
        this.tokens.push(token)
        this.seek()
      }

      // --- If the next 25 characters are an expression block, scan it.
      // TODO: Handle edges here with whitespace and comments
      else if (Lexer.checkForExpressionBlock(this.peek(25))) {
        const tokenLiteral = this.scanLiteral()
        this.seek()
        const tokenValue = new TokenColon(this.lineNumber)
        const tokenExpressionBlock = this.scanExpressionBlock()
        this.tokens.push(tokenLiteral, tokenValue, tokenExpressionBlock)
      }

      // --- Otherwise, scan a literal.
      // TODO: This should actually check for valid literals first
      else {
        const tokenLiteral = this.scanLiteral()
        this.tokens.push(tokenLiteral)
      }

      // --- Peek the next character.
      char = this.peek()
    }

    // --- Return the sequence of tokens.
    return this.tokens
  }

  /**
   * Checks if a string is an expression block by checking if it starts with
   * one of the expression block keys such as `sql` or `html`.
   *
   * @param string The string to check.
   * @returns `true` if the string is an expression block, `false` otherwise.
   */
  static checkForExpressionBlock(string: string): boolean {
    return EXPR_BLOCK_KEYS.some(exprBlockKey => string.startsWith(`${exprBlockKey}:`))
  }

  /**
   * Returns a token from one or more whitespace characters.
   *
   * @returns A token from one or more whitespace characters.
   * @example
   * const lexer = new Lexer("\n\n\t Hello");
   * const token = lexer.scanWhitespace();
   * console.log(token); // LinebreakToken('\n\n', 1)
   */
  scanWhitespace(): TokenWhitespace {
    let chars = ''
    let char = this.peek()
    const lineNumber = this.lineNumber

    // --- Consume all whitespace characters.
    while (char) {

      // --- If one or more newlines, return a linebreak token.
      if (char === '\n') {
        while (char === '\n') {
          chars += this.read()
          this.lineNumber += 1
          char = this.peek()
        }
        return new TokenNewline(chars, lineNumber)
      }

      // --- If inline whitespace, read all whitespace characters.
      else if (char === '\t' || char === ' ') {
        chars += this.read()
        char = this.peek()
      }

      // --- Otherwise, break.
      else { break }
    }

    // --- If no newlines, return an inline whitespace token.
    return new TokenWhitespace(chars, lineNumber)
  }

  /**
   * Returns a token from a comment.
   * The initial pound (#) character is readd in the scan method, so this
   * method only scans for a newline or end of file to indicate the end of the token.
   *
   * The pound character is added back to the beginning to the token to emphasize
   * the importance of any leading whitespace that follows.
   *
   * @returns A token from a comment.
   * @example
   * const lexer = new Lexer("# This is a comment");
   * const token = lexer.scanComment(); // => CommentToken('# This is a comment')
   */
  scanComment(): TokenComment {
    let chars = ''
    while (this.peek() !== EOF && this.peek() !== '\n')
      chars += this.read()
    return new TokenComment(chars, this.lineNumber)
  }

  /**
   * Scan an expression block.
   *
   * This method strips any trailing whitespace from the expression string, since
   * Looker usually adds an extra space before the `;;` terminal.
   *
   * @returns A token from an expression block string.
   * @example
   * const lexer = new Lexer("SELECT * FROM ${TABLE} ;;");
   * const token = lexer.scanExpressionBlock();
   * console.log(token); // ExpressionBlockToken(SELECT * FROM ${TABLE})
   */
  scanExpressionBlock(): TokenExpressionBlock {
    let chars = ''
    const lineNumber = this.lineNumber
    while (this.peek(2) !== ';;') {
      if (this.peek() === '\n') this.lineNumber += 1
      chars += this.read()
    }
    return new TokenExpressionBlock(chars, lineNumber)
  }

  /**
   * Scan a literal string.
   *
   * @returns A token from a literal string.
   * @example
   * const lexer = new Lexer('hello');
   * const token = lexer.scanLiteral();
   * console.log(token); // LiteralToken('hello')
   */
  scanLiteral(): TokenLiteral {
    let chars = ''
    let char = this.peek()

    // --- Consume all characters until a literal exit character is reached.
    while (char) {
      chars += this.read()
      char = this.peek()

      // --- If the current character is a literal exit character, break.
      const isLiteralExit = '\0\n\t:}{,]'.includes(char)
      if (isLiteralExit) break
    }

    // --- Return a literal token.
    return new TokenLiteral(chars, this.lineNumber)
  }

  /**
   * Scan a quoted literal string.
   *
   * The initial double quote character is readd in the scan method, so this
   * method only scans for the trailing quote to indicate the end of the token.
   *
   * @returns A token from a quoted literal string.
   * @example
   * const lexer = new Lexer('"Label"');
   * const token = lexer.scanQuotedLiteral();
   * console.log(token); // StringLiteralToken(Label)
   */
  scanQuotedLiteral(): TokenQuotedLiteral {
    let chars = ''
    const lineNumber = this.lineNumber

    // --- Consume all characters until a trailing quote is reached.
    let char = this.peek()
    while (char) {
      if (char === EOF) throw new Error('Unterminated string literal.')
      if (char === '"') break
      else if (char === '\\') chars += this.read() // Extra read to skip the escaped character
      else if (char === '\n') this.lineNumber += 1
      chars += this.read()
      char = this.peek()
    }

    // --- Return a quoted literal token.
    this.seek()
    chars = chars.replaceAll('\\', '')
    return new TokenQuotedLiteral(chars, lineNumber)
  }
}
