import { PLURAL_KEYS } from './constants'
import {
  SyntaxColon,
  SyntaxBracketLeft,
  SyntaxBracketRight,
  SyntaxComma,
  SyntaxCurlyRight,
  SyntaxToken,
  SyntaxCurlyLeft,
  SyntaxExpressionBlock,
  SyntaxQuotedLiteral,
} from './parserSyntax'
import { Visitor } from './visitors'

/* Abstract base class for nodes with child nodes. */
abstract class Node {
  abstract get children(): Array<Node | SyntaxToken> | undefined
  abstract get lineNumber(): number | undefined
  abstract accept(visitor: Visitor): unknown
}

/* Represents a LookML pair, e.g., "hidden: yes". */
export class NodeKV extends Node {
  constructor(
    public key: SyntaxToken,
    public value: SyntaxToken,
    public colon: SyntaxColon = new SyntaxColon(),
  ) {
    super()
  }

  get children() {
    return [this.key, this.colon, this.value]
  }

  get lineNumber(): number | undefined {
    return this.key.line
  }

  accept(visitor: Visitor): unknown {
    return visitor.visitPair(this)
  }

  toString(): string {
    return this.children.join('')
  }
}

/* Represents a LookML list enclosed in square brackets, like `fields` or `filters`. */
export class NodeList extends Node {
  constructor(
    public key: SyntaxToken,
    public colon: SyntaxColon = new SyntaxColon(),
    public items: Array<NodeKV | SyntaxExpressionBlock | SyntaxQuotedLiteral | SyntaxToken>,
    public bracketStart: SyntaxBracketLeft = new SyntaxBracketLeft(),
    public bracketEnd: SyntaxBracketRight = new SyntaxBracketRight(),
    public commaLeading: SyntaxComma | undefined,
    public commaTrailing: SyntaxComma | undefined,
  ) {
    super()
  }

  get children(): NodeKV[] {
    return this.items.filter((item): item is NodeKV => item instanceof NodeKV)
  }

  get lineNumber(): number | undefined {
    return this.key.line
  }

  accept(visitor: Visitor): unknown {
    return visitor.visitList(this)
  }

  toString(): string {
    return [
      this.key,
      this.colon,
      this.bracketStart,
      this.commaLeading && this.items.length > 0 ? ',' : '',
      this.items.map(item => item.toString()).join(','),
      this.commaTrailing && this.items.length > 0 ? ',' : '',
      this.bracketEnd,
    ].join('')
  }
}

/* Represents a sequence of nodes, might be top-level or inside a block. */
export class NodeContainer extends Node {
  public items: Array<NodeBlock | NodeKV | NodeList>

  constructor(items: Array<NodeBlock | NodeKV | NodeList>, public topLevel: boolean = false) {
    super()
    this.items = items

    if (!topLevel) {
      const counter = new Map<string, number>()
      items.forEach((item) => {
        const count = counter.get(item.key.value) || 0
        counter.set(item.key.value, count + 1)
      })

      counter.forEach((count, key) => {
        if (count > 1 && key in PLURAL_KEYS === false)
          throw new Error(`Key "${key}" already exists in tree and would overwrite the existing value.`)
      })
    }
  }

  get children(): Array<NodeBlock | NodeKV | NodeList> {
    return this.items
  }

  get lineNumber(): number | undefined {
    if (this.items.length === 0) return undefined
    return this.items[0].lineNumber
  }

  accept(visitor: Visitor): unknown {
    return visitor.visitContainer(this)
  }

  toString(): string {
    return this.items.join('')
  }
}

/* Represents a LookML block enclosed in curly braces, e.g., `view` or `dimension`. */
export class NodeBlock extends Node {
  constructor(
    public type: SyntaxToken,
    public colon: SyntaxColon,
    public name: SyntaxToken,
    public braceStart: SyntaxCurlyLeft = new SyntaxCurlyLeft(),
    public container: NodeContainer = new NodeContainer([]),
    public braceEnd: SyntaxCurlyRight = new SyntaxCurlyRight(),
  ) {
    super()
  }

  get children(): Array<NodeBlock | NodeKV | NodeList> {
    return this.container.children
  }

  get lineNumber(): number | undefined {
    return this.type.line
  }

  accept(visitor: Visitor): unknown {
    return visitor.visitBlock(this)
  }

  toString(): string {
    const { type, colon, name, braceStart: leftBrace, container, braceEnd: rightBrace } = this
    return [type, colon, name, leftBrace, container, rightBrace].join('')
  }
}

/* The root node of the parse tree. */
export class NodeDocument extends Node {
  constructor(
    public container: NodeContainer,
    public prefix: string = '',
    public suffix: string = '',
  ) {
    super()
  }

  get children(): NodeContainer[] {
    return [this.container]
  }

  get lineNumber(): number {
    // --- Document always starts on the first line
    return 0
  }

  accept(visitor: Visitor): unknown {
    return visitor.visit(this)
  }

  toString(): string {
    const { prefix, container, suffix } = this
    return [prefix, container, suffix].join('')
  }
}
