import { lex } from './lexer'
import { parse } from './parse'

function p(template: string) {
  const tokens = lex(template)
  return parse(tokens)
}

// This test suite is kept minimal because the parser and renderer test suites already
// covers most of the parsing logic in detail and this is just to ensure integration
// between lexer and parser works as expected.
describe('parse', () => {
  it('parses plain text', () => {
    const result = p('Hello, World!')
    expect(result).toStrictEqual({
      nodes: [
        {
          pos: 0,
          text: 'Hello, World!',
          type: 'Text',
        },
      ],
      pos: 0,
      type: 'List',
    })
  })

  it('should parse simple if-end', () => {
    const result = p('{{ if true }} Yes {{ end }}')
    expect(result).toStrictEqual({
      nodes: [
        {
          list: {
            nodes: [
              {
                pos: 13,
                text: ' Yes ',
                type: 'Text',
              },
            ],
            pos: 3,
            type: 'List',
          },
          pipe: {
            commands: [
              {
                args: [
                  {
                    pos: 6,
                    type: 'Bool',
                    value: true,
                  },
                ],
                pos: 5,
                type: 'Command',
              },
            ],
            declarations: [],
            pos: 5,
            type: 'Pipe',
          },
          pos: 3,
          type: 'If',
        },
      ],
      pos: 0,
      type: 'List',
    })
  })

})
