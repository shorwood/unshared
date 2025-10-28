/* eslint-disable sonarjs/no-primitive-wrappers */
export namespace GoTmpl {

  /****************************************************/
  /* Lexer Tokens                                     */
  /****************************************************/

  export namespace Token {
    export enum Type {
      Block = 0,
      Bool = 1,
      Char = 2,
      CharConstant = 3,
      ColonEquals = 4,
      Comma = 5,
      Define = 6,
      Dot = 7,
      Else = 8,
      End = 9,
      EOF = 10,
      Error = 11,
      Field = 12,
      Identifier = 13,
      If = 14,
      LeftDelim = 15,
      LeftParen = 16,
      Nil = 17,
      Number = 18,
      Pipe = 19,
      Range = 20,
      RawString = 21,
      RightDelim = 22,
      RightParen = 23,
      Space = 24,
      StringLiteral = 25,
      Template = 26,
      Text = 27,
      Variable = 28,
      With = 29,
    }
  }

  export interface Token<T extends Token.Type = Token.Type> {
    type: T

    /** The byte offset of the first character in the token. */
    pos: number

    /** The raw slice of the token text. */
    value: string

    /** The 1-based line number where the token appears. */
    line: number
  }

  /****************************************************/
  /* AST Nodes                                        */
  /****************************************************/

  export namespace Node {
    interface Base {
      type: string
      pos: number
    }
    export interface Text extends Base {
      type: 'Text'
      text: string
    }
    export interface List extends Base {
      type: 'List'
      nodes: Node[]
    }
    export interface Pipe extends Base {
      type: 'Pipe'
      declarations: Variable[]
      commands: Command[]
    }
    export interface Action extends Base {
      type: 'Action'
      pipe: Pipe
    }
    export interface Command extends Base {
      type: 'Command'
      args: Node[]
    }
    export interface Identifier extends Base {
      type: 'Identifier'
      name: string
    }
    export interface Variable extends Base {
      type: 'Variable'
      names: string[]
    }
    export interface Dot extends Base {
      type: 'Dot'
    }
    export interface Nil extends Base {
      type: 'Nil'
    }
    export interface Field extends Base {
      type: 'Field'
      identifiers: string[]
    }
    export interface Chain extends Base {
      type: 'Chain'
      node: Node
      field: string[]
    }
    export interface Bool extends Base {
      type: 'Bool'
      value: boolean
    }
    export interface Number extends Base {
      type: 'Number'
      text: string
      value: number
    }
    export interface String extends Base {
      type: 'String'
      value: string
    }
    export interface End extends Base {
      type: 'End'
    }
    export interface Else extends Base {
      type: 'Else'
    }
    export interface Branch extends Base {
      type: 'If' | 'Range' | 'With'
      pipe: Pipe
      list: List
      elseList?: List
    }
    export interface Template extends Base {
      type: 'Template'

      /** Template name (Go requires a string literal) */
      name: String

      /** The action keyword variant */
      keyword: 'block' | 'define' | 'template'

      /** Optional pipeline (template/block). Absent for pure name or define. */
      pipe?: Pipe

      /** Body list for define or block (block default body). */
      list?: List
    }

    // Shorthand aliases
    export type Delimiter =
      | Action
      | Branch
      | Template
  }

  export type Node =
    | Node.Action
    | Node.Bool
    | Node.Branch
    | Node.Chain
    | Node.Command
    | Node.Dot
    | Node.Else
    | Node.End
    | Node.Field
    | Node.Identifier
    | Node.List
    | Node.Nil
    | Node.Number
    | Node.Pipe
    | Node.String
    | Node.Template
    | Node.Text
    | Node.Variable

  /** The root AST node is always a `List`. */
  export type AST = Node.List

  /****************************************************/
  /* Renderer Values                                  */
  /****************************************************/

  export namespace Value {
    export enum Kind {
      Array = 0,
      Bool = 1,
      Function = 2,
      Nil = 3,
      Number = 4,
      Object = 5,
      String = 6,
    }

    interface Base {
      kind: Kind
    }
    export interface Array extends Base {
      kind: Kind.Array
      value: Value[]
    }
    export interface Bool extends Base {
      kind: Kind.Bool
      value: boolean
    }
    export interface Function extends Base {
      kind: Kind.Function
      value: (...args: Value[]) => Value
      raw: (...args: unknown[]) => unknown
    }
    export interface Nil extends Base {
      kind: Kind.Nil
    }
    export interface Number extends Base {
      kind: Kind.Number
      value: number
      raw?: string
    }
    export interface Object extends Base {
      kind: Kind.Object
      value: Record<string, Value>
      raw: object
    }
    export interface String extends Base {
      kind: Kind.String
      value: string
    }
  }

  export type Value =
    | Value.Array
    | Value.Bool
    | Value.Function
    | Value.Nil
    | Value.Number
    | Value.Object
    | Value.String
}
