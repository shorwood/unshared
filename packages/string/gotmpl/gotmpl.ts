import { lex } from './lexer'
import { parse } from './parse'
import { render } from './render'

/**
 * Renders a Go template string with the provided context.
 *
 * @param template The Go template string to render.
 * @param context The context object to use during rendering.
 * @returns The rendered string.
 * @example gotmpl('Hello, {{.Name}}!', { Name: 'World' }) // 'Hello, World!'
 */
export function gotmpl(template: string, context: unknown): string {
  const tokens = lex(template)
  const ast = parse(tokens)
  return render(ast, context)
}
