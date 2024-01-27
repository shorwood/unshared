

// Customizable tokenizer rules for the parser.
interface CustomTokenConfig {
  name: string // Token name.
  pattern: RegExp // Token matching pattern.
  ignore?: boolean // Whether to ignore this token in the output.
}

// Rules for parsing tokens into the AST.
interface ParsingRuleConfig {
  name: string // Identifier for the rule.
  match: (tokens: Token[]) => boolean // Function to identify the rule matches.
  process: (tokens: Token[], previousAST: AST) => AST // Function to process the tokens into the AST.
}

// Error type used within the parser.
interface ParseError {
  message: string // Human-readable error message.
  index?: number // Index in the input string where error occurred.
  line?: number // Line number of the error.
  column?: number // Column number of the error.
}

// Representing tokens.
interface Token {
  type: string
  value: string
  // Additional properties may be needed...
}

// Base node type
interface ASTNode {
  type: string // The type of the node, representing the syntactic construct.
  children?: ASTNode[] // Any child nodes.
  value?: boolean | number | string | null
  // Additional properties for positional information, etc.
  locationStart?: ASTLocation
  locationEnd?: ASTLocation
}

// Position in the source code
interface ASTLocation {
  line: number // Line number of the position.
  column: number // Column number of the position.
}

// You would define similar interfaces or classes for nodes of other languages such as LookerML, SQL, TypeScript, etc.

// These language-specific node types could be unioned for a generalized AST type
interface AST{
  content?: string
  children?: ASTNode[]
}
