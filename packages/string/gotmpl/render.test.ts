import { lex } from './lexer'
import { parse } from './parse'
import { render as baseRender } from './render'

function render(template: string, context: unknown = {}) {
  const tokens = lex(template)
  const ast = parse(tokens)
  return baseRender(ast, context)
}

describe('render', () => {
  describe('basic', () => {
    it('should render plain text', () => {
      const result = render('Hello, World!')
      expect(result).toBe('Hello, World!')
    })

    it('should render string literal', () => {
      const result = render('{{ "Hello, World!" }}')
      expect(result).toBe('Hello, World!')
    })

    it('should render number literal', () => {
      const result = render('{{ 42 }}')
      expect(result).toBe('42')
    })

    it('should render boolean literal', () => {
      const result = render('{{ true }}')
      expect(result).toBe('true')
    })

    it('should render nil literal', () => {
      const result = render('{{ nil }}')
      expect(result).toBe('')
    })

    it('should render array', () => {
      const result = render('{{ . }}', [1, 2, 3])
      expect(result).toBe('1 2 3')
    })

    it('should render object', () => {
      const result = render('{{ . }}', { Name: 'Alice' })
      expect(result).toBe('Name:Alice')
    })

    it('should render nested object', () => {
      const result = render('{{ . }}', { Users: [{ Name: 'Bob' }, { Name: 'Charlie' }] })
      expect(result).toBe('Users:Name:Bob Name:Charlie')
    })

    it('should render empty template', () => {
      const result = render('')
      expect(result).toBe('')
    })
  })

  describe('fields', () => {
    it('should evaluate field from context', () => {
      const result = render('{{ .Name }}', { Name: 'Alice' })
      expect(result).toBe('Alice')
    })

    it('should evaluate nested field chain from context', () => {
      const result = render('{{ .User.Name }}', { User: { Name: 'Bob' } })
      expect(result).toBe('Bob')
    })
  })

  describe('branches', () => {
    describe('if-end', () => {
      it('should render if branch when condition is true', () => {
        const result = render('{{ if .Show }}Yes{{ end }}', { Show: true })
        expect(result).toBe('Yes')
      })

      it('should not render if branch when condition is false', () => {
        const result = render('{{ if .Show }}Yes{{ end }}', { Show: false })
        expect(result).toBe('')
      })
    })

    describe('if-else-end', () => {
      it('should render if branch when condition is true', () => {
        const result = render('{{ if .Show }}Yes{{ else }}No{{ end }}', { Show: true })
        expect(result).toBe('Yes')
      })

      it('should render else branch when condition is false', () => {
        const result = render('{{ if .Show }}Yes{{ else }}No{{ end }}', { Show: false })
        expect(result).toBe('No')
      })
    })

    describe('if-else-if-end', () => {
      it('should render first true branch', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ end }}', { Show1: true, Show2: false })
        expect(result).toBe('First')
      })

      it('should render second true branch', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ end }}', { Show1: false, Show2: true })
        expect(result).toBe('Second')
      })

      it('should not render if all conditions are false', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ end }}', { Show1: false, Show2: false })
        expect(result).toBe('')
      })
    })

    describe('if-else-if-else-end', () => {
      it('should render first true branch', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ else }}Third{{ end }}', { Show1: true, Show2: false })
        expect(result).toBe('First')
      })

      it('should render second true branch', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ else }}Third{{ end }}', { Show1: false, Show2: true })
        expect(result).toBe('Second')
      })

      it('should render else branch when all conditions are false', () => {
        const result = render('{{ if .Show1 }}First{{ else if .Show2 }}Second{{ else }}Third{{ end }}', { Show1: false, Show2: false })
        expect(result).toBe('Third')
      })
    })

    describe('if-else-body-end', () => {
      it('should render action in if branch', () => {
        const result = render('{{ if .Show }}{{ "Yes" }}{{ else }}{{ "No" }}{{ end }}', { Show: true })
        expect(result).toBe('Yes')
      })

      it('should render nested action in else branch', () => {
        const result = render('{{ if .Show }}{{ "Yes" }}{{ else }}{{ "No" }}{{ end }}', { Show: false })
        expect(result).toBe('No')
      })
    })

    describe('if-nested-if-else-end', () => {
      it('should render nested if branch', () => {
        const result = render('{{ if .Outer }}{{ if .Inner }}Yes{{ else }}No{{ end }}{{ end }}', { Outer: true, Inner: true })
        expect(result).toBe('Yes')
      })

      it('should render nested else branch', () => {
        const result = render('{{ if .Outer }}{{ if .Inner }}Yes{{ else }}No{{ end }}{{ end }}', { Outer: true, Inner: false })
        expect(result).toBe('No')
      })

      it('should not render anything when outer condition is false', () => {
        const result = render('{{ if .Outer }}{{ if .Inner }}Yes{{ else }}No{{ end }}{{ end }}', { Outer: false, Inner: true })
        expect(result).toBe('')
      })
    })

    describe('with-end', () => {
      it('should set dot to the value of the with pipe', () => {
        const result = render('{{ with .User }}{{ .Name }}{{ end }}', { User: { Name: 'Charlie' } })
        expect(result).toBe('Charlie')
      })

      it('should render else branch when with pipe is falsey', () => {
        const result = render('{{ with .User }}{{ .Name }}{{ else }}No User{{ end }}', {})
        expect(result).toBe('No User')
      })
    })

    describe('range-end', () => {
      it('should iterate over array and render body for each item', () => {
        const result = render('{{ range .Items }}{{ . }}-{{ end }}', { Items: ['a', 'b', 'c'] })
        expect(result).toBe('a-b-c-')
      })

      it('should not render body when array is empty', () => {
        const result = render('{{ range .Items }}{{ . }}-{{ end }}', { Items: [] })
        expect(result).toBe('')
      })

      it('should render else branch when array is empty', () => {
        const result = render('{{ range .Items }}{{ . }}{{ else }}EMPTY{{ end }}', { Items: [] })
        expect(result).toBe('EMPTY')
      })

      it('should iterate over object values (order unspecified)', () => {
        const out = render('{{ range .Obj }}{{ . }}-{{ end }}', { Obj: { a: 'A', b: 'B' } })
        // Order is not guaranteed; accept either ordering.
        expect(['A-B-', 'B-A-']).toContain(out)
      })

      it('should iterate over object and expose $key (non-standard interim)', () => {
        const out = render('{{ range .Obj }}{{ $key }}={{ . }},{{ end }}', { Obj: { x: 1, y: 2 } })
        const possibilities = ['x=1,y=2,', 'y=2,x=1,']
        expect(possibilities).toContain(out)
      })

      it('should render else branch when object empty', () => {
        const out = render('{{ range .Obj }}{{ . }}{{ else }}NONE{{ end }}', { Obj: {} })
        expect(out).toBe('NONE')
      })

      it('should support single variable declaration for array values', () => {
        const template = '{{ range $v := .Items }}{{ $v }};{{ end }}'
        const out = render(template, { Items: ['x', 'y'] })
        expect(out).toBe('x;y;')
      })

      it('should support two variable declaration for array index & value', () => {
        const template = '{{ range $i, $v := .Items }}{{ $i }}={{ $v }},{{ end }}'
        const out = render(template, { Items: ['x', 'y', 'z'] })
        expect(out).toBe('0=x,1=y,2=z,')
      })

      it('should support single variable declaration for object value', () => {
        const template = '{{ range $v := .Obj }}{{ $v }},{{ end }}'
        const out = render(template, { Obj: { a: 'A', b: 'B' } })
        const possibilities = ['A,B,', 'B,A,']
        expect(possibilities).toContain(out)
      })

      it('should support two variable declaration for object key & value', () => {
        const template = '{{ range $k, $v := .Obj }}{{ $k }}={{ $v }},{{ end }}'
        const out = render(template, { Obj: { a: 1, b: 2 } })
        const possibilities = ['a=1,b=2,', 'b=2,a=1,']
        expect(possibilities).toContain(out)
      })
    })

    describe('nested if (deeper levels)', () => {
      const template = '{{ if .A }}{{ if .B }}{{ if .C }}ABC{{ else }}AB-elseC{{ end }}{{ else }}A-elseB{{ end }}{{ else }}elseA{{ end }}'
      it('renders deepest true path', () => {
        const result = render(template, { A: true, B: true, C: true })
        expect(result).toBe('ABC')
      })
      it('renders middle else when C false', () => {
        const result = render(template, { A: true, B: true, C: false })
        expect(result).toBe('AB-elseC')
      })
      it('renders B false branch', () => {
        const result = render(template, { A: true, B: false, C: true })
        expect(result).toBe('A-elseB')
      })
      it('renders outer else when A false', () => {
        const result = render(template, { A: false, B: true, C: true })
        expect(result).toBe('elseA')
      })
    })

    describe('nested else-if inside outer if body', () => {
      const template = '{{ if .Outer }}{{ if .Inner1 }}I1{{ else if .Inner2 }}I2{{ else }}I3{{ end }}{{ else }}OUTER-ELSE{{ end }}'
      it('renders Inner1', () => {
        const result = render(template, { Outer: true, Inner1: true, Inner2: false })
        expect(result).toBe('I1')
      })
      it('renders Inner2', () => {
        const result = render(template, { Outer: true, Inner1: false, Inner2: true })
        expect(result).toBe('I2')
      })
      it('renders inner else', () => {
        const result = render(template, { Outer: true, Inner1: false, Inner2: false })
        expect(result).toBe('I3')
      })
      it('renders outer else branch', () => {
        const result = render(template, { Outer: false, Inner1: true, Inner2: true })
        expect(result).toBe('OUTER-ELSE')
      })
    })

    describe('nested if inside outer else branch', () => {
      const template = '{{ if .Outer }}OUTER{{ else }}{{ if .Inner }}INNER{{ else }}NONE{{ end }}{{ end }}'
      it('renders outer branch', () => {
        const result = render(template, { Outer: true, Inner: true })
        expect(result).toBe('OUTER')
      })
      it('renders inner branch inside outer else', () => {
        const result = render(template, { Outer: false, Inner: true })
        expect(result).toBe('INNER')
      })
      it('renders inner else inside outer else', () => {
        const result = render(template, { Outer: false, Inner: false })
        expect(result).toBe('NONE')
      })
    })

    describe('multi else-if chain at top level', () => {
      const template = '{{ if .Outer }}OUTER{{ else if .Mid }}MID{{ else if .Inner }}INNER{{ else }}NONE{{ end }}'
      it('chooses first true (Outer)', () => {
        const result = render(template, { Outer: true, Mid: true, Inner: true })
        expect(result).toBe('OUTER')
      })
      it('chooses Mid when Outer false', () => {
        const result = render(template, { Outer: false, Mid: true, Inner: true })
        expect(result).toBe('MID')
      })
      it('chooses Inner when Outer & Mid false', () => {
        const result = render(template, { Outer: false, Mid: false, Inner: true })
        expect(result).toBe('INNER')
      })
      it('falls back to else', () => {
        const result = render(template, { Outer: false, Mid: false, Inner: false })
        expect(result).toBe('NONE')
      })
    })
  })

  describe('variables', () => {
    describe('basic declaration and usage', () => {
      it('should declare and render a variable', () => {
        const result = render('{{ $greeting := "Hello" }}{{ $greeting }}')
        expect(result).toBe('Hello')
      })

      it('should declare and reuse a number variable', () => {
        const result = render('{{ $num := 42 }}{{ $num }}')
        expect(result).toBe('42')
      })
    })

    // Scoping tests: highlight missing scope isolation in if branches
    describe('variable scoping inside if branches', () => {
      it('does not leak variable declared inside if (condition true)', () => {
        const template = '{{ $x := "root" }}{{ if .Cond }}{{ $x := "inner" }}{{ end }}{{ $x }}'
        const result = render(template, { Cond: true })
        expect(result).toBe('root')
      })
      it('does not leak variable declared inside if (condition false)', () => {
        const template = '{{ $x := "root" }}{{ if .Cond }}{{ $x := "inner" }}{{ end }}{{ $x }}'
        const result = render(template, { Cond: false })
        expect(result).toBe('root')
      })
      it('does not leak variable declared inside else branch', () => {
        const template = '{{ $x := "root" }}{{ if .Cond }}OK{{ else }}{{ $x := "else" }}{{ end }}{{ $x }}'
        const result = render(template, { Cond: false })
        expect(result).toBe('root')
      })
      it('inner redeclaration should not override outer for nested if', () => {
        const template = '{{ $a := "root" }}{{ if .Outer }}{{ if .Inner }}{{ $a := "X" }}{{ end }}{{ end }}{{ $a }}'
        const result = render(template, { Outer: true, Inner: true })
        expect(result).toBe('root')
      })
    })

    // Scoping tests: highlight override of variables in nested branches
    describe('variable overriding in nested branches', () => {
      it('inner declaration should override outer in inner scope', () => {
        const template = '{{ $v := "root" }}{{ if .A }}{{ $v := "A1" }}{{ $v }}{{ end }}'
        const result = render(template, { A: true })
        expect(result).toBe('A1')
      })
      it('inner declaration in else should override outer in inner scope', () => {
        const template = '{{ $v := "root" }}{{ if .A }}OK{{ else }}{{ $v := "B1" }}{{ $v }}{{ end }}'
        const result = render(template, { A: false })
        expect(result).toBe('B1')
      })
      it('inner declaration in else-if should override outer in inner scope', () => {
        const template = '{{ $v := "root" }}{{ if .A }}OK{{ else if .B }}{{ $v := "C1" }}{{ $v }}{{ end }}'
        const result = render(template, { A: false, B: true })
        expect(result).toBe('C1')
      })
      it('outer variable should remain unchanged after inner scope', () => {
        const template = '{{ $v := "root" }}{{ if .A }}{{ $v := "A1" }}{{ end }}OUTER:{{ $v }}'
        const result = render(template, { A: true })
        expect(result).toBe('OUTER:root')
      })
    })

    describe('variable scoping with nested branches combination', () => {
      it('multiple inner declarations should be isolated', () => {
        const template = '{{ $v := "root" }}{{ if .A }}{{ $v := "A1" }}{{ else if .B }}{{ $v := "B1" }}{{ else }}{{ $v := "C1" }}{{ end }}{{ $v }}'
        const resultA = render(template, { A: true, B: true })
        const resultB = render(template, { A: false, B: true })
        const resultC = render(template, { A: false, B: false })
        expect(resultA).toBe('root')
        expect(resultB).toBe('root')
        expect(resultC).toBe('root')
      })
    })

    describe('invalid multi-variable declarations outside range', () => {
      it('throws for two-variable action declaration', () => {
        const shouldThrow = () => render('{{ $a, $b := 42 }}')
        expect(shouldThrow).toThrow('unexpected comma in declaration')
      })
      it('throws for two-variable if condition declaration', () => {
        const shouldThrow = () => render('{{ if $x, $y := true }}OK{{ end }}')
        expect(shouldThrow).toThrow('unexpected comma in declaration')
      })
      it('allows single variable declaration in action', () => {
        const out = render('{{ $x := 7 }}{{ $x }}')
        expect(out).toBe('7')
      })
    })
  })

  describe('builtins', () => {
    it('should evaluate "len" builtin for arrays', () => {
      const result = render('{{ len .Items }}', { Items: [1, 2, 3, 4] })
      expect(result).toBe('4')
    })

    it('should evaluate "len" builtin for strings', () => {
      const result = render('{{ len .Text }}', { Text: 'Hello' })
      expect(result).toBe('5')
    })

    it('should evaluate "eq" builtin for equality', () => {
      const result = render('{{ eq .Value1 .Value2 }}', { Value1: 42, Value2: 42 })
      expect(result).toBe('true')
    })

    it('should evaluate "ne" builtin for inequality', () => {
      const result = render('{{ ne .Value1 .Value2 }}', { Value1: 42, Value2: 43 })
      expect(result).toBe('true')
    })

    it('should evaluate "lt" builtin for less-than comparison', () => {
      const result = render('{{ lt .Value1 .Value2 }}', { Value1: 41, Value2: 42 })
      expect(result).toBe('true')
    })

    it('should evaluate "gt" builtin for greater-than comparison', () => {
      const result = render('{{ gt .Value1 .Value2 }}', { Value1: 43, Value2: 42 })
      expect(result).toBe('true')
    })

    it('should evaluate "and" builtin for logical AND', () => {
      const result = render('{{ and .Cond1 .Cond2 }}', { Cond1: true, Cond2: true })
      expect(result).toBe('true')
    })

    it('should evaluate "or" builtin for logical OR', () => {
      const result = render('{{ or .Cond1 .Cond2 }}', { Cond1: false, Cond2: true })
      expect(result).toBe('true')
    })

    it('should evaluate "index" builtin for array indexing', () => {
      const result = render('{{ index .Arr 1 }}', { Arr: ['a', 'b', 'c'] })
      expect(result).toBe('b')
    })

    it('should evaluate "index" builtin for object property access', () => {
      const result = render('{{ index .Obj "key" }}', { Obj: { key: 'value' } })
      expect(result).toBe('value')
    })
  })

  describe('templates', () => {
    describe('define, template, block', () => {
      it('define + template invocation', () => {
        const out = render('{{ define "greet" }}Hi {{ .Name }}!{{ end }}{{ template "greet" .User }}', { User: { Name: 'Alice' } })
        expect(out).toBe('Hi Alice!')
      })

      it('block fallback when no override define present', () => {
        const out = render('{{ block "greet" .User }}Hi {{ .Name }}!{{ end }}', { User: { Name: 'Bob' } })
        expect(out).toBe('Hi Bob!')
      })

      it('block overridden by define with same name', () => {
        const template = '{{ define "greet" }}Override{{ end }}{{ block "greet" .User }}Hi {{ .Name }}!{{ end }}'
        const out = render(template, { User: { Name: 'Carol' } })
        expect(out).toBe('Override')
      })

      it('template missing definition throws error', () => {
        const shouldThrow = () => render('{{ template "missing" . }}', { X: 1 })
        expect(shouldThrow).toThrow('template: no such template "missing"')
      })

      it('pipeline sets dot for invocation', () => {
        const out = render('{{ define "inner" }}Name={{ .Name }}{{ end }}{{ template "inner" .User }}', { User: { Name: 'Zed' } })
        expect(out).toBe('Name=Zed')
      })

      it('should render define-invoked template', () => {
        const template = '{{define "x"}}Hi {{.Name}}{{end}}{{template "x" .}}'
        const result = render(template, { Name: 'Ada' })
        expect(result).toBe('Hi Ada')
      })
    })

    describe('edge cases', () => {
      it('should render define-invoked template', () => {
        const template = '{{define "x"}}Hi {{.Name}}{{end}}{{template "x" .}}'
        const result = render(template, { Name: 'Ada' })
        expect(result).toBe('Hi Ada')
      })

      it('should throw when template missing', () => {
        const template = 'Before {{template "missing" .}} After'
        const shouldThrow = () => render(template, {})
        expect(shouldThrow).toThrow('template: no such template "missing"')
      })

      it('should fallback to inline block body when no override', () => {
        const template = 'A{{block "section" .}}<default>{{end}}B'
        const result = render(template, {})
        expect(result).toBe('A<default>B')
      })

      it('should use define body instead of block inline body', () => {
        const template = '{{define "section"}}<override>{{end}}A{{block "section" .}}<default>{{end}}B'
        const result = render(template, {})
        expect(result).toBe('A<override>B')
      })

      it('should set dot via pipeline when invoking template', () => {
        const template = '{{define "inner"}}{{.}}{{end}}{{template "inner" "Hello"}}'
        const result = render(template, {})
        expect(result).toBe('Hello')
      })

      it('should throw on duplicate define names', () => {
        const template = '{{define "dup"}}a{{end}}{{define "dup"}}b{{end}}'
        const shouldThrow = () => render(template, {})
        expect(shouldThrow).toThrow('template: duplicate define for dup')
      })
    })
  })
})
