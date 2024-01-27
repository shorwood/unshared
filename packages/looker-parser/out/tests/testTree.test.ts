import { beforeEach, describe, expect, it } from 'vitest'
import {
  BlockNode,
  ContainerNode,
  LeftBracket,
  LeftCurlyBrace,
  ListNode,
  PairNode,
  RightBracket,
  RightCurlyBrace,
  SyntaxToken,
  QuotedSyntaxToken,
  ExpressionSyntaxToken,
} from '../tree'
import { LookMlVisitor } from '../visitors'

describe('test_tree', () => {
  describe.each([
    [SyntaxToken, 'foo'],
    [QuotedSyntaxToken, '"foo"'],
  ])('Parameterized tests', (TokenClass, expected) => {
    it(`SyntaxToken string representation should return formatted for ${TokenClass.name}`, () => {
      const token = new TokenClass('foo')
      expect(String(token)).toEqual(expected)
    })
  })

  it('QuotedSyntaxToken should quote double quotes correctly', () => {
    const text = 'This is the "best" dimension'
    const token = new QuotedSyntaxToken(text)
    expect(token.formatValue()).toEqual('"This is the \\"best\\" dimension"')
  })

  it('ExpressionSyntaxToken with expression suffix should be formatted correctly', () => {
    const sql = 'SELECT * FROM orders'
    const token = new ExpressionSyntaxToken(sql, {
      prefix: ' ',
      suffix: ' # A comment',
      exprSuffix: ' ',
    })
    expect(String(token)).toEqual(' SELECT * FROM orders ;; # A comment')
  })

  it('PairNode string representation should return formatted', () => {
    const node = new PairNode({
      type: new SyntaxToken('foo'),
      value: new SyntaxToken('bar'),
    })
    expect(String(node)).toEqual('foo: bar')

    // Add whitespace in an unconventional place
    const nodeWithSpaces = new PairNode({
      type: new SyntaxToken('foo', { suffix: ' ' }),
      value: new SyntaxToken('bar'),
    })
    expect(String(nodeWithSpaces)).toEqual('foo : bar')
  })

  it('PairNode should not have children', () => {
    const node = new PairNode({
      type: new SyntaxToken('foo'),
      value: new SyntaxToken('bar'),
    })
    expect(node.children).toBeUndefined()
  })

  it('ListNode string representation should return formatted', () => {
    // Test a node with PairNodes as items
    const listNodeWithPairs = new ListNode({
      type: new SyntaxToken('filters'),
      leftBracket: new LeftBracket(),
      items: [
        new PairNode({ type: new SyntaxToken('created_date'), value: new QuotedSyntaxToken('7 days') }),
        new PairNode({ type: new SyntaxToken('user.status', { prefix: ' ' }), value: new QuotedSyntaxToken('-disabled') }),
      ],
      rightBracket: new RightBracket(),
    })
    expect(String(listNodeWithPairs)).toEqual(
      'filters: [created_date: "7 days", user.status: "-disabled"]'
    )

    // Test a node with SyntaxTokens as items
    const listNodeWithTokens = new ListNode({
      type: new SyntaxToken('fields'),
      leftBracket: new LeftBracket(),
      items: [
        new SyntaxToken('user.user_id', { prefix: '\n  ' }),
        new SyntaxToken('user.age', { prefix: '\n  ', suffix: '\n' }),
      ],
      rightBracket: new RightBracket(),
    })
    expect(String(listNodeWithTokens)).toEqual('fields: [\n  user.user_id,\n  user.age\n]')

    // Test a node with zero items
    const emptyListNode = new ListNode({
      type: new SyntaxToken('fields'),
      leftBracket: new LeftBracket(),
      items: [],
      rightBracket: new RightBracket(),
    })
    expect(String(emptyListNode)).toEqual('fields: []')
  })

  it('BlockNode string representation should return formatted', () => {
    // Test a regular block
    const blockNode = new BlockNode({
      type: new SyntaxToken('set'),
      name: new SyntaxToken('user_dimensions'),
      leftBrace: new LeftCurlyBrace({ prefix: ' ', suffix: ' ' }),
      container: new ContainerNode({
        items: [
          new ListNode({
            type: new SyntaxToken('fields'),
            leftBracket: new LeftBracket(),
            items: [
              new SyntaxToken('user.user_id'),
              new SyntaxToken('user.age', { prefix: ' ' }),
            ],
            rightBracket: new RightBracket(),
          }),
        ],
      }),
      rightBrace: new RightCurlyBrace({ prefix: ' ' }),
    })
    expect(String(blockNode)).toEqual('set: user_dimensions { fields: [user.user_id, user.age] }')

    // Test a block with no expression
    const emptyBlockNode = new BlockNode({
      type: new SyntaxToken('set'),
      name: new SyntaxToken('foo'),
      leftBrace: new LeftCurlyBrace({ prefix: ' ' }),
      container: new ContainerNode({ items: [] }),
      rightBrace: new RightCurlyBrace(),
    })
    expect(String(emptyBlockNode)).toEqual('set: foo {}')
  })

  it('ContainerNode string representation should return formatted', () => {
    const containerNode = new ContainerNode({
      items: [
        new PairNode({ type: new SyntaxToken('hidden'), value: new SyntaxToken('true') }),
        new BlockNode({
          type: new SyntaxToken('set', { prefix: ' ' }),
          name: new SyntaxToken('foo'),
          leftBrace: new LeftCurlyBrace({ prefix: ' ' }),
          container: new ContainerNode({ items: [] }),
          rightBrace: new RightCurlyBrace(),
        }),
        new ListNode({
          type: new SyntaxToken('fields', { prefix: ' ' }),
          leftBracket: new LeftBracket(),
          items: [],
          rightBracket: new RightBracket(),
        }),
      ],
    })
    expect(String(containerNode)).toEqual('hidden: true set: foo {} fields: []')
  })

  it('SyntaxToken with trivia should render correctly', () => {
    const tokenWithPrefix = new SyntaxToken('foo', { prefix: '# Skip this\n  ' })
    expect(String(tokenWithPrefix)).toEqual('# Skip this\n  foo')

    const tokenWithSuffix = new SyntaxToken('foo', { suffix: '\n# Skip this\n  ' })
    expect(String(tokenWithSuffix)).toEqual('foo\n# Skip this\n  ')

    const tokenWithBoth = new SyntaxToken('foo', { prefix: '\n\t', suffix: '\t\n' })
    expect(String(tokenWithBoth)).toEqual('\n\tfoo\t\n')
  })

  it('LookMlVisitor should visit SyntaxToken correctly', () => {
    const visitor = new LookMlVisitor()
    const token = new SyntaxToken('foo', { suffix: '\n' })
    expect(visitor.visitToken(token)).toEqual('foo\n')
  })
})
