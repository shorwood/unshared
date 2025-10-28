/* eslint-disable sonarjs/no-nested-assignment */
/* eslint-disable no-cond-assign */

import { GoTmpl } from './types'

const BRANCH_MAP = Object.freeze({
  [GoTmpl.Token.Type.If]: 'If',
  [GoTmpl.Token.Type.Range]: 'Range',
  [GoTmpl.Token.Type.With]: 'With',
})

const TEMPLATE_MAP = Object.freeze({
  [GoTmpl.Token.Type.Define]: 'define',
  [GoTmpl.Token.Type.Block]: 'block',
  [GoTmpl.Token.Type.Template]: 'template',
})

/**
 * Class representing a parser for Go templates. This parser is
 * stateful and processes an array of tokens to produce an Abstract Syntax Tree (AST).
 * It supports parsing of various Go template constructs including actions, variables, and pipelines.
 *
 * @example
 * ```ts
 * const tokens = lex(`{{ if .Condition }}True{{ else }}False{{ end }}`)
 * const ast = new Parser(tokens).parse() // Produces the AST for the provided template
 * ```
 */
export class Parser {

  /** Current index in the tokens array */
  private index = 0

  /**
   * Creates a new Parser instance.
   *
   * @param tokens The array of tokens to parse.
   */
  constructor(private tokens: GoTmpl.Token[]) {}

  /****************************************************/
  /* Helpers                                          */
  /****************************************************/

  /**
   * Peek at the next token without consuming it. If there are no more tokens,
   * it means that we have unexpectedly reached the end of input, in which case
   * an error is thrown.
   *
   * @param offset The number of tokens to look ahead.
   * @returns The next token or undefined if there are no more tokens.
   */
  private peek(offset = 0): GoTmpl.Token {
    const token = this.tokens[this.index + offset]
    if (!token) throw new Error('Unexpected end of input')
    return token
  }

  /**
   * Peek at the next token and check if it matches the expected type. If there are no more tokens,
   * it means that we have unexpectedly reached the end of input, in which case
   * an error is thrown.
   *
   * @param expected The expected token types to validate against.
   * @returns True if the next token matches the expected type, false otherwise.
   */
  private peekWhen<T extends GoTmpl.Token.Type>(...expected: T[]): GoTmpl.Token<T> | undefined {
    const token = this.tokens[this.index]
    if (!token) throw new Error('Unexpected end of input')
    // eslint-disable-next-line unicorn/prefer-includes
    if (expected.some(type => token.type === type)) return token as GoTmpl.Token<T>
    return undefined
  }

  /**
   * Consume and return the next token. If there are no more tokens,
   * it means that we have unexpectedly reached the end of input, in
   * which case an error is thrown.
   *
   * @param expected An optional expected token type to validate against.
   * @returns The consumed token.
   */
  private consume<T extends GoTmpl.Token.Type>(...expected: T[]): GoTmpl.Token<T> {
    const token = this.tokens[this.index++]
    if (!token) throw new SyntaxError(`Unexpected end of input at token index ${this.index - 1}`)

    // --- If an expected type is provided, validate the consumed token.
    if (expected.length > 0 && expected.every(type => token.type !== type))
      throw new SyntaxError(`Unexpected token type "${token.value}" at line ${token.line}:${token.pos}`)

    // --- Return the consumed token, cast to the expected type.
    return token as GoTmpl.Token<T>
  }

  /**
   * Consume if the next token is one of the expected type and
   * return it; otherwise, return undefined without consuming.
   *
   * @param expected An array of expected token types.
   * @returns The consumed token or undefined.
   */
  private consumeWhen<T extends GoTmpl.Token.Type>(...expected: T[]): GoTmpl.Token<T> | undefined {
    const token = this.peek()
    if (expected.length > 0 && expected.every(type => token.type !== type)) return undefined
    return this.consume(...expected)
  }

  /**
   * Consume tokens while the next token matches the expected type.
   *
   * @param type The token type to consume.
   */
  private consumeWhile(type: GoTmpl.Token.Type): void {
    while (this.peek().type === type) this.consume()
  }

  /**
   * Consume tokens until a token of the expected type is found.
   * It also consumes the token of the expected type itself.
   *
   * @param type The token type to consume until.
   */
  private consumeUntil(type: GoTmpl.Token.Type): void {
    while (this.peek().type !== type) this.consume()
    this.consume()
  }

  /**
   * Check if the next token is the EOF token. If there are no more tokens,
   * it means that we have overread the input, in which case an error is thrown.
   *
   * @returns True if the next token is EOF, false otherwise.
   */
  private get isEOF(): boolean {
    return this.peek().type === GoTmpl.Token.Type.EOF
  }

  /****************************************************/
  /* Parse                                            */
  /****************************************************/

  /**
   * Parse the tokens into an AST.
   *
   * @param ignoreEnd If true, the parser will not stop at `end` tokens.
   * @returns The resulting AST as a List node.
   */
  parse(ignoreEnd: boolean): GoTmpl.Node.List {
    const pos = this.index
    const nodes: GoTmpl.Node[] = []

    // --- Parse tokens until EOF is reached.
    while (!this.isEOF) {
      let token: GoTmpl.Token | undefined

      // --- Text tokens become Text nodes
      if (token = this.consumeWhen(GoTmpl.Token.Type.Text)) {
        nodes.push({ type: 'Text', pos: token.pos, text: token.value })
      }

      // --- If a leftDelim is encountered, determine if it's a special node
      // --- (branch/template) or a normal action and parse accordingly.
      else if (this.consumeWhen(GoTmpl.Token.Type.LeftDelim)) {
        this.consumeWhile(GoTmpl.Token.Type.Space)

        // --- If `untilEnd` is true, stop parsing when an `end` token is encountered.
        if (!ignoreEnd && this.consumeWhen(GoTmpl.Token.Type.End)) {
          this.consumeUntil(GoTmpl.Token.Type.RightDelim)
          break
        }

        // --- Branch nodes: if/range/with
        if (this.peekWhen(
          GoTmpl.Token.Type.If,
          GoTmpl.Token.Type.Range,
          GoTmpl.Token.Type.With,
        )) nodes.push(this.parseBranch())

        // --- Template definition/invocation nodes: define/block/template
        else if (this.peekWhen(
          GoTmpl.Token.Type.Define,
          GoTmpl.Token.Type.Block,
          GoTmpl.Token.Type.Template,
        )) nodes.push(this.parseTemplateNode())

        // --- Normal action node
        else nodes.push(this.parseAction())
      }
    }

    // --- Return top-level List node.
    return { type: 'List', pos, nodes }
  }

  private parseAction(): GoTmpl.Node.Action {
    const pos = this.peek().pos
    const pipe = this.parsePipe('generic')
    this.consumeUntil(GoTmpl.Token.Type.RightDelim)
    return { type: 'Action', pos, pipe }
  }

  private parseVariableDeclaration(): [GoTmpl.Node[], GoTmpl.Node.Variable[]] {
    const pos = this.peek().pos
    const variable = this.consume(GoTmpl.Token.Type.Variable)
    const nodes: GoTmpl.Node[] = []
    const variables: GoTmpl.Node.Variable[] = []
    this.consumeWhile(GoTmpl.Token.Type.Space)

    // --- If immediately followed by a field, treat as variable chain not declaration
    // --- Example: {{ $var.Field.SubField }}
    let token: GoTmpl.Token | undefined
    if (token = this.consumeWhen(GoTmpl.Token.Type.Field)) {
      const field = token.value.split('.').filter(Boolean)
      const node: GoTmpl.Node.Variable = { type: 'Variable', pos: variable.pos, names: [variable.value] }
      nodes.push({ type: 'Chain', pos, node, field })
      return [nodes, variables]
    }

    // --- Possible second variable for tuple assignment.
    // --- Example: {{ $a, $b := fn() }}
    let second: GoTmpl.Token | undefined
    if (this.peek().type === GoTmpl.Token.Type.Comma) {
      this.consume(GoTmpl.Token.Type.Comma)
      this.consumeWhile(GoTmpl.Token.Type.Space)
      if (this.peek().type === GoTmpl.Token.Type.Variable) {
        second = this.consume(GoTmpl.Token.Type.Variable)
        this.consumeWhile(GoTmpl.Token.Type.Space)
      }
    }

    // --- After possible second variable, skip spaces then look for ':='
    // --- If found, it's a declaration; otherwise, treat consumed variables as args.
    // --- Example declaration: {{ $x := 42 }}
    // --- Example not declaration: {{ $x | fn }}
    this.consumeWhile(GoTmpl.Token.Type.Space)
    if (this.peek().type === GoTmpl.Token.Type.ColonEquals) {
      this.consume(GoTmpl.Token.Type.ColonEquals)
      variables.push({ type: 'Variable', pos: variable.pos, names: [variable.value] })
      if (second) variables.push({ type: 'Variable', pos: second.pos, names: [second.value] })
      this.consumeWhile(GoTmpl.Token.Type.Space)
      return [[], variables] // do NOT push declared variables as argument nodes; return empty nodes.
    }

    // --- Not a declaration: treat consumed variables as args
    nodes.push({ type: 'Variable', pos: variable.pos, names: [variable.value] })
    if (second) nodes.push({ type: 'Variable', pos: second.pos, names: [second.value] })
    return [nodes, variables]
  }

  private parsePipe(context: 'generic' | 'range'): GoTmpl.Node.Pipe {
    const pipePos = this.peek().pos
    let currentPipePos = this.peek().pos
    const variables: GoTmpl.Node.Variable[] = []
    const commands: GoTmpl.Node.Command[] = []
    let nodes: GoTmpl.Node[] = []

    // --- Helper to flush current argument nodes as a command.
    const flushCommand = () => {
      if (nodes.length === 0) return
      commands.push({ type: 'Command', pos: currentPipePos, args: nodes })
      currentPipePos = this.peek().pos
      nodes = []
    }

    // --- Parse the pipe until we reach the rightDelim. If we reach EOF first, it will
    // --- throw an error in the caller when trying to consume the rightDelim.
    while (this.peek().type !== GoTmpl.Token.Type.RightDelim) {
      let token: GoTmpl.Token | undefined

      // --- Variable declaration only allowed before first command emitted.
      // --- Examples: {{ $x := 42 }}, {{ $a, $b := fn() }}
      if (commands.length === 0
        && nodes.length === 0
        && this.peekWhen(GoTmpl.Token.Type.Variable)) {
        const [declNodes, declVariables] = this.parseVariableDeclaration()
        nodes.push(...declNodes)
        variables.push(...declVariables)
      }

      // --- Variable or identifier followed by field: treat as chain access
      // --- Examples: {{ $var.Field.SubField }}
      else if (
        (this.peekWhen(GoTmpl.Token.Type.Identifier, GoTmpl.Token.Type.Variable))
        && this.peek(1).type === GoTmpl.Token.Type.Field) {
        const baseToken = this.consume(GoTmpl.Token.Type.Identifier, GoTmpl.Token.Type.Variable)
        const fieldToken = this.consume(GoTmpl.Token.Type.Field)
        const field = fieldToken.value.split('.').filter(Boolean)
        const node: GoTmpl.Node = baseToken.type === GoTmpl.Token.Type.Identifier
          ? { type: 'Identifier', pos: baseToken.pos, name: baseToken.value }
          : { type: 'Variable', pos: baseToken.pos, names: [baseToken.value] }
        nodes.push({ type: 'Chain', pos: 0, node, field })
      }

      // --- Root dot field chain: .Field.SubField
      // --- Example: {{ .User.name }}
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Field)) {
        const node: GoTmpl.Node.Dot = { type: 'Dot', pos: token.pos }
        const field = token.value.split('.').filter(Boolean)
        nodes.push({ type: 'Chain', pos: token.pos, node, field })
      }

      // --- Ignore spaces.
      else if (this.consumeWhen(GoTmpl.Token.Type.Space)) {
        /* noop */
      }

      // --- When a 'pipe' is encountered, flush current arguments as a command and start new.
      // --- Example: {{ cmd1 arg1 | cmd2 arg2 }}
      else if (this.consumeWhen(GoTmpl.Token.Type.Pipe)) {
        this.consumeWhile(GoTmpl.Token.Type.Space)
        flushCommand()
      }

      // --- Handle the rest of the tokens as argument nodes.
      // --- Examples: identifiers, variables, literals.
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Identifier)) {
        nodes.push({ type: 'Identifier', pos: token.pos, name: token.value })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Variable)) {
        nodes.push({ type: 'Variable', pos: token.pos, names: [token.value] })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Dot)) {
        nodes.push({ type: 'Dot', pos: token.pos })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.StringLiteral)) {
        nodes.push({ type: 'String', pos: token.pos, value: token.value.slice(1, -1) })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.RawString)) {
        nodes.push({ type: 'String', pos: token.pos, value: token.value })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Number)) {
        const value = Number.parseFloat(token.value.replaceAll('_', ''))
        nodes.push({ type: 'Number', pos: token.pos, text: token.value, value })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Bool)) {
        nodes.push({ type: 'Bool', pos: token.pos, value: token.value === 'true' })
      }
      else if (token = this.consumeWhen(GoTmpl.Token.Type.Nil)) {
        nodes.push({ type: 'Nil', pos: token.pos })
      }
      else {
        const token = this.peek()
        throw new SyntaxError(`Unknown token "${token.value}" in pipe at ${token.line}:${token.pos}`)
      }
    }

    // --- Flush any remaining arguments as final command
    flushCommand()

    // --- Enforce Go semantics: multi-variable declarations only allowed in range context
    if (context !== 'range' && variables.length > 1)
      throw new SyntaxError('unexpected comma in declaration')
    return { type: 'Pipe', pos: pipePos, declarations: variables, commands }
  }

  /****************************************************/
  /* Branch Parsing                                   */
  /****************************************************/

  private parseBranchElseNodes(): GoTmpl.Node[] {
    this.consumeWhile(GoTmpl.Token.Type.Space)

    // --- Else if: parse nested if branch as elseList
    // --- Example: {{ else if ... }}
    if (this.peekWhen(
      GoTmpl.Token.Type.If,
      GoTmpl.Token.Type.Range,
      GoTmpl.Token.Type.With,
    )) return [this.parseBranch()]

    // --- Plain else. Parse nodes until matching end is reached.
    // --- Example: {{ else }} <capture_body> {{ end }}
    this.consumeUntil(GoTmpl.Token.Type.RightDelim)
    return this.parse(false).nodes
  }

  private parseBranch(): GoTmpl.Node.Branch {
    this.consumeWhile(GoTmpl.Token.Type.Space)
    const branch = this.consume(
      GoTmpl.Token.Type.If,
      GoTmpl.Token.Type.With,
      GoTmpl.Token.Type.Range,
    )

    // --- Capture the pipe following the branch keyword, the pipe conains
    // --- the condition or value to range/with on.
    const pos = branch.pos
    const nodes: GoTmpl.Node[] = []
    const type = BRANCH_MAP[branch.type]
    const pipe = this.parsePipe(type === 'Range' ? 'range' : 'generic')
    this.consumeUntil(GoTmpl.Token.Type.RightDelim)

    // --- Now that we've captured the condition/value pipe, parse the body
    // --- until we reach an {{ else }} or {{ end }}.
    while (!this.isEOF) {
      let token: GoTmpl.Token | undefined

      // --- Capture text outside actions.
      if (token = this.consumeWhen(GoTmpl.Token.Type.Text)) {
        nodes.push({ type: 'Text', pos: token.pos, text: token.value })
      }

      // --- Lookahead for {{ else }} or {{ end }} or {{ else if ... }}
      else if (this.consumeWhen(GoTmpl.Token.Type.LeftDelim)) {
        const save = this.index
        this.consumeWhile(GoTmpl.Token.Type.Space)

        // --- End branch: consume and break out of body parsing.
        // --- Example: {{ end }}
        if (this.consumeWhen(GoTmpl.Token.Type.End)) {
          this.consumeUntil(GoTmpl.Token.Type.RightDelim)
          const list: GoTmpl.Node.List = { type: 'List', pos, nodes }
          return { type, pos, pipe, list }
        }

        // --- Else branch: parse elseList or nested if as elseList
        // --- Examples:
        // --- {{ else }} ... {{ end }}
        // --- {{ else if ... }} ... {{ end }}
        if (this.consumeWhen(GoTmpl.Token.Type.Else)) {
          const elseNodes = this.parseBranchElseNodes()
          const list: GoTmpl.Node.List = { type: 'List', pos, nodes }
          const elseList: GoTmpl.Node.List = { type: 'List', pos, nodes: elseNodes }
          return { type, pos, pipe, list, elseList }
        }

        // --- Nested branch/template detection: if/range/with or define/block/template
        // --- If we see one of those after lookahead, we should parse them accordingly.
        this.index = save
        if (this.peekWhen(
          GoTmpl.Token.Type.If,
          GoTmpl.Token.Type.Range,
          GoTmpl.Token.Type.With,
        )) nodes.push(this.parseBranch())

        else if (this.peekWhen(
          GoTmpl.Token.Type.Define,
          GoTmpl.Token.Type.Block,
          GoTmpl.Token.Type.Template,
        )) nodes.push(this.parseTemplateNode())

        else nodes.push(this.parseAction())
      }

      // --- There should never be other token types here; if so, it's an error.
      else {
        throw new SyntaxError(`unterminated branch at token index ${this.index}`)
      }
    }

    throw new SyntaxError('unexpected end of input while parsing branch')
  }

  /****************************************************/
  /* Template Parsing                                 */
  /****************************************************/

  private parseTemplateNode(): GoTmpl.Node.Template {
    const keyword = this.consume(
      GoTmpl.Token.Type.Define,
      GoTmpl.Token.Type.Block,
      GoTmpl.Token.Type.Template,
    )

    // --- Parse template name
    this.consumeWhile(GoTmpl.Token.Type.Space)
    const nameToken = this.consume(GoTmpl.Token.Type.StringLiteral)
    const name: GoTmpl.Node.String = { type: 'String', value: nameToken.value.slice(1, -1), pos: nameToken.pos }
    this.consumeWhile(GoTmpl.Token.Type.Space)

    // --- For define: no pipeline allowed before right delim. For block/template: optional pipeline until right delim.
    const pipe: GoTmpl.Node.Pipe = (keyword.type !== GoTmpl.Token.Type.Define && this.peek().type !== GoTmpl.Token.Type.RightDelim)
      ? this.parsePipe('generic')
      : { type: 'Pipe', pos: name.pos, declarations: [], commands: [] }
    this.consumeUntil(GoTmpl.Token.Type.RightDelim)

    // --- If define or block, parse body until matching end
    if (keyword.type === GoTmpl.Token.Type.Define || keyword.type === GoTmpl.Token.Type.Block) {
      const list = this.parse(false)
      return {
        type: 'Template',
        pos: keyword.pos,
        keyword: TEMPLATE_MAP[keyword.type],
        name,
        pipe,
        list,
      }
    }

    // --- Template invocation: no body
    return {
      type: 'Template',
      pos: keyword.pos,
      name,
      keyword: TEMPLATE_MAP[keyword.type],
      pipe,
    }
  }
}

/**
 * Parse an array of {@linkcode GoTmpl.Token} into a {@linkcode GoTmpl.AST}.
 *
 * @param tokens The array of tokens to parse.
 * @returns The resulting AST.
 * @example
 * ```ts
 * const tokens = lex(`{{ if .Condition }}True{{ else }}False{{ end }}`)
 * const ast = parse(tokens) // Produces the AST for the provided template
 * ```
 */
export function parse(tokens: GoTmpl.Token[]): GoTmpl.AST {
  return new Parser(tokens).parse(true)
}
