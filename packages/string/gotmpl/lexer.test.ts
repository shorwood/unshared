import { KEYWORDS, lex } from './lexer'
import { GoTmpl } from './types'

describe('lexer', () => {
  describe('lex', () => {
    it('should tokenize plain text without actions', () => {
      const result = lex('Hello World')
      expect(result).toStrictEqual([
        { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'Hello World' },
        { line: 1, pos: 11, type: GoTmpl.Token.Type.EOF, value: '' },
      ])
    })

    it('should tokenize a simple action with identifier', () => {
      const toks = lex('Hello {{ name }}!')
      expect(toks).toStrictEqual([
        { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'Hello ' },
        { line: 1, pos: 6, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
        { line: 1, pos: 9, type: GoTmpl.Token.Type.Identifier, value: 'name' },
        { line: 1, pos: 13, type: GoTmpl.Token.Type.Space, value: ' ' },
        { line: 1, pos: 14, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
        { line: 1, pos: 16, type: GoTmpl.Token.Type.Text, value: '!' },
        { line: 1, pos: 17, type: GoTmpl.Token.Type.EOF, value: '' },
      ])
    })

    it('should push error token for unclosed action', () => {
      const result = lex('Hello {{ name ')
      expect(result).toStrictEqual([
        { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'Hello ' },
        { line: 1, pos: 6, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
        { line: 1, pos: 8, type: GoTmpl.Token.Type.Error, value: 'unclosed action' },
        { line: 1, pos: 8, type: GoTmpl.Token.Type.EOF, value: '' },
      ])
    })

    it('trims whitespace with opening and closing markers', () => {
      const result = lex(' A {{- 42 -}} B')
      expect(result).toStrictEqual([
        { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: ' A' },
        { line: 1, pos: 3, type: GoTmpl.Token.Type.LeftDelim, value: '{{-' },
        { line: 1, pos: 8, type: GoTmpl.Token.Type.Number, value: '42' },
        { line: 1, pos: 10, type: GoTmpl.Token.Type.Space, value: ' ' },
        { line: 1, pos: 11, type: GoTmpl.Token.Type.RightDelim, value: '-}}' },
        { line: 1, pos: 14, type: GoTmpl.Token.Type.Text, value: 'B' },
        { line: 1, pos: 15, type: GoTmpl.Token.Type.EOF, value: '' },
      ])
    })
  })

  describe('lexAction', () => {
    describe('comments', () => {
      it('should skips comments entirely', () => {
        const result = lex('X {{ /* comment */ }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 19, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 21, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 1, pos: 23, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should handles unclosed comment', () => {
        const result = lex('X {{ /* unclosed }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.Error, value: 'unterminated comment' },
          { line: 1, pos: 17, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 19, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 1, pos: 21, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should handles comment with leading whitespace', () => {
        const result = lex('X {{    /* comment */ }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 22, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 24, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 1, pos: 26, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should not count newlines inside comments for line tracking', () => {
        const result = lex('X {{  /* \n comment \n */ }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 24, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 26, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 1, pos: 28, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('whitespace', () => {
      it('collapses consecutive whitespace into single space token', () => {
        const result = lex('X {{    \n\t  }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 2, pos: 12, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 2, pos: 14, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 2, pos: 16, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('counts newlines in space tokens for line tracking', () => {
        const result = lex('X {{  \n  \n  }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 3, pos: 12, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 3, pos: 14, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 3, pos: 16, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('field chains', () => {
      it('should lex field chains correctly', () => {
        const result = lex('{{ .User.Profile.name }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Field, value: '.User.Profile.name' },
          { line: 1, pos: 21, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 22, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 24, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('dot token', () => {
      it('should lex single dot as dot token', () => {
        const result = lex('{{ . }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Dot, value: '.' },
          { line: 1, pos: 4, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 7, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('identifiers', () => {
      it('should lex identifiers correctly', () => {
        const result = lex('{{ myVar }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Identifier, value: 'myVar' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      const keywords = Object.keys(KEYWORDS)
      it.each(keywords)('lexes the "%s" keyword', (identifier) => {
        const result = lex(`{{ ${identifier} }}`)
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: KEYWORDS[identifier], value: identifier },
          { line: 1, pos: 3 + identifier.length, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 4 + identifier.length, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 6 + identifier.length, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('variables', () => {
      it('should lex variables correctly', () => {
        const result = lex('{{ $varName }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Variable, value: '$varName' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 12, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 14, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('raw strings', () => {
      it('should lex raw strings correctly', () => {
        const result = lex('{{ `hello world` }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.RawString, value: '`hello world`' },
          { line: 1, pos: 16, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 17, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 19, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should track newlines in raw strings for line counting', () => {
        const result = lex('X {{ `hello\nworld` }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.RawString, value: '`hello\nworld`' },
          { line: 2, pos: 18, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 2, pos: 19, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 2, pos: 21, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 2, pos: 23, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('pipe', () => {
      it('should lex pipe tokens correctly', () => {
        const result = lex('{{ .Name | printf "%s" }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Field, value: '.Name' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.Pipe, value: '|' },
          { line: 1, pos: 10, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.Identifier, value: 'printf' },
          { line: 1, pos: 17, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 18, type: GoTmpl.Token.Type.StringLiteral, value: '"%s"' },
          { line: 1, pos: 22, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 23, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 25, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('comma', () => {
      it('should lex comma tokens correctly', () => {
        const result = lex('{{ func .Arg1, .Arg2 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Identifier, value: 'func' },
          { line: 1, pos: 7, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Field, value: '.Arg1' },
          { line: 1, pos: 13, type: GoTmpl.Token.Type.Comma, value: ',' },
          { line: 1, pos: 14, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 15, type: GoTmpl.Token.Type.Field, value: '.Arg2' },
          { line: 1, pos: 20, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 21, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 23, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('parentheses', () => {
      it('should lex parentheses tokens correctly', () => {
        const result = lex('{{ func( .Arg ) }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Identifier, value: 'func' },
          { line: 1, pos: 7, type: GoTmpl.Token.Type.LeftParen, value: '(' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.Field, value: '.Arg' },
          { line: 1, pos: 13, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 14, type: GoTmpl.Token.Type.RightParen, value: ')' },
          { line: 1, pos: 15, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 16, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 18, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('colonEquals', () => {
      it('should lex colonEquals tokens correctly', () => {
        const result = lex('{{ $x := 42 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Variable, value: '$x' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 6, type: GoTmpl.Token.Type.ColonEquals, value: ':=' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.Number, value: '42' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 12, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 14, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('number', () => {
      it('should lex numbers correctly', () => {
        const result = lex('{{ 12345 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Number, value: '12345' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should lex numbers with underscores correctly', () => {
        const result = lex('{{ 1_234_567 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Number, value: '1_234_567' },
          { line: 1, pos: 12, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 13, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 15, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should lex floating point numbers correctly', () => {
        const result = lex('{{ 3.14159 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Number, value: '3.14159' },
          { line: 1, pos: 10, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 11, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 13, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should handle malformed numbers gracefully', () => {
        const result = lex('{{ 123abc }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Number, value: '123' },
          { line: 1, pos: 6, type: GoTmpl.Token.Type.Identifier, value: 'abc' },
          { line: 1, pos: 9, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 10, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 12, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should lex numbers with dots and underscores correctly', () => {
        const result = lex('{{ 1_234.56_78 }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Number, value: '1_234.56_78' },
          { line: 1, pos: 14, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 15, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 17, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('quoted strings', () => {
      it('should lex quoted strings correctly', () => {
        const result = lex('{{ "hello world" }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.StringLiteral, value: '"hello world"' },
          { line: 1, pos: 16, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 17, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 19, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should handle escaped quotes inside strings', () => {
        const result = lex(String.raw`{{ "he said \"hello\"" }}`)
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.StringLiteral, value: String.raw`"he said \"hello\""` },
          { line: 1, pos: 22, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 23, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 25, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })

      it('should track newlines in strings for line counting', () => {
        const result = lex('X {{ "hello\nworld" }} Y')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.Text, value: 'X ' },
          { line: 1, pos: 2, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.StringLiteral, value: '"hello\nworld"' },
          { line: 2, pos: 18, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 2, pos: 19, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 2, pos: 21, type: GoTmpl.Token.Type.Text, value: ' Y' },
          { line: 2, pos: 23, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })

    describe('unrecognized characters', () => {
      it('should lex unrecognized characters as error tokens', () => {
        const result = lex('{{ @# }}')
        expect(result).toStrictEqual([
          { line: 1, pos: 0, type: GoTmpl.Token.Type.LeftDelim, value: '{{' },
          { line: 1, pos: 3, type: GoTmpl.Token.Type.Error, value: 'unexpected character: @' },
          { line: 1, pos: 4, type: GoTmpl.Token.Type.Error, value: 'unexpected character: #' },
          { line: 1, pos: 5, type: GoTmpl.Token.Type.Space, value: ' ' },
          { line: 1, pos: 6, type: GoTmpl.Token.Type.RightDelim, value: '}}' },
          { line: 1, pos: 8, type: GoTmpl.Token.Type.EOF, value: '' },
        ])
      })
    })
  })
})
