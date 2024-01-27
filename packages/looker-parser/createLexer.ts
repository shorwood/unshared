export interface ParserConfig {

  // Sometimes parsers need hints about what kind of constructs to expect.
  startRule?: string

  // Some languages might need to enable certain features or plugins.
  features?: string[]

  // Option for choosing between strict and lenient parsing modes.
  strict?: boolean

  // Tokenizer specific configuration.
  tokens?: CustomTokenConfig[]

  // Rules for parsing tokens into the AST.
  parsingRules?: ParsingRuleConfig[]

  // Error handling strategies.
  errorStrategy?: 'log' | 'recover' | 'throw'
  customErrorHandler?: (error: ParseError) => void
}

/**
 * The `Parser` class is a generic AST parser that can be used to parse any
 * kind of language described by a grammar and a set of rules.
 *
 * @example
 * const parser = new Parser({ ... })
 * const ast = parser.parse('{ "foo": "bar" }')
 */
export class Lexer {
  constructor(private config: ParserConfig) {}

  /**
   * Parse the given input using the given grammar and rules.
   *
   * @param input The input to parse.
   * @returns The parsed AST.
   * @example
   * const parser = new Parser({ ... })
   * const ast = parser.parse('...')
   */
  public parse(input: string): AST {
    const tokens = this.tokenize(input)
    return this.parseTokens(tokens)
  }
}
