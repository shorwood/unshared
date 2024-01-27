import { Visitor } from './visitors'

/**
 * Stores a text value with optional prefix or suffix trivia.
 *
 * For example, a syntax token might represent meaningful punctuation like a curly
 * brace or the type or value of a LookML field. A syntax token can also store trivia,
 * comments or whitespace that precede or follow the token value. The parser attempts
 * to assign these prefixes and suffixes intelligently to the corresponding tokens.
 */
export class SyntaxToken {
  /**
   * Initialize a new syntax token.
   *
   * @param value The text represented by the token.
   * @param prefix Comments or whitespace preceding the token.
   * @param suffix Comments or whitespace following the token.
   * @param line The line number where the token appears in the source.
   */
  constructor(
    public value: string,
    public prefix: string = '',
    public suffix: string = '',
    public line?: number,
  ) {}

  accept(visitor: Visitor): unknown {
    return visitor.visitToken(this)
  }

  toString(): string {
    return [this.prefix, this.value, this.suffix].join('')
  }
}

export class SyntaxCurlyLeft extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super('{', prefix, suffix, line)
  }
}

export class SyntaxCurlyRight extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super('}', prefix, suffix, line)
  }
}

export class SyntaxColon extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super(':', prefix, suffix, line)
  }
}

export class SyntaxBracketLeft extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super('[', prefix, suffix, line)
  }
}

export class SyntaxBracketRight extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super(']', prefix, suffix, line)
  }
}

export class SyntaxDoubleSemicolon extends SyntaxToken {
  constructor() {
    super(';;')
  }
}

export class SyntaxComma extends SyntaxToken {
  constructor(prefix?: string, suffix?: string, line?: number) {
    super(',', prefix, suffix, line)
  }
}

export class SyntaxQuotedLiteral extends SyntaxToken {
  toString(): string {
    const escaped = this.value.replaceAll('"', '\\"')
    return [this.prefix, `"${escaped}"`, this.suffix].join('')
  }
}

export class SyntaxExpressionBlock extends SyntaxToken {
  constructor(
    public value: string,
    public prefix: string = '',
    public suffix: string = '',
    public exprPrefix?: string,
    public exprSuffix?: string,
    public line?: number,
  ) {
    super(value, prefix + exprPrefix, suffix, line)
  }

  toString(): string {
    return [this.prefix, this.value, this.exprSuffix, ';;', this.suffix].filter(Boolean).join('')
  }
}
