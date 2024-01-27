export class Token {
  /**
   * A collection of characters that map to a token instance.
   *
   * @param id The internal identifier for the token.
   * @param line The line number where the token was found.
   * @param value The value of the token if it has one.
   */
  constructor(
    public line: number,
    public value?: string,
  ) {}

  /**
   * Compare this token to another token.
   *
   * @param other The token to compare to.
   * @returns `true` if the tokens are equal, `false` otherwise.
   * @example
   * const a = new PropertyToken(1)
   * const b = new PropertyToken(1)
   * a.equals(b) // => true
   */
  equals(other: Token): boolean {
    if (this.constructor.name !== other.constructor.name) return false
    return this.value === other.value
  }

  /**
   * Stringify the token.
   *
   * @returns A string representation of the token.
   * @example
   * const token = new CommentToken('This is a comment.', 1)
   * token.toString() // => 'CommentToken(This is a comment.)'
   */
  toString(): string {
    if (!this.value) return this.constructor.name
    const trimmedValue = this.value.trim()
    return `${this.constructor.name}(${trimmedValue})`
  }
}

export class TokenValue extends Token {
  constructor(line: number, public value: string) {
    super(line, value)
  }
}

export class TokenStreamStart extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenStreamEnd extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenBlockStart extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenBlockEnd extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenColon extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenComma extends Token {
  constructor(line: number) {
    super( line)
  }
}

export class TokenListStart extends Token {
  constructor(line: number) {
    super( line)
  }
}

export class TokenListEnd extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenWhitespace extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}

export class TokenNewline extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}

export class TokenComment extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}

export class TokenExpressionBlock extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}

export class TokenExpressionBlockEnd extends Token {
  constructor(line: number) {
    super(line)
  }
}

export class TokenLiteral extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}

export class TokenQuotedLiteral extends TokenValue {
  constructor(value: string, line: number) {
    super(line, value)
  }
}
