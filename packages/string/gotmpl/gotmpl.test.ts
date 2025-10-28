import { gotmpl } from './gotmpl'

// Since `gotmpl` simply chains together the lexer, parser, and renderer,
// we only need a few basic tests here to ensure logic works as expected.
describe('gotmpl', () => {
  it('should render a simple template', () => {
    const result = gotmpl('Hello, {{.Name}}!', { Name: 'World' })
    expect(result).toBe('Hello, World!')
  })

  it('should render a template with if-else', () => {
    const context = { Name: 'Alice', IsMorning: false }
    const template = '{{ if .IsMorning }}Good morning, {{ else }}Good evening, {{ end }}{{.Name}}!'
    const result = gotmpl(template, context)
    expect(result).toBe('Good evening, Alice!')
  })
})
