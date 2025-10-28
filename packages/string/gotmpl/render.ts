import { createList } from '@unshared/collection/createList'
import { BUILTINS } from './builtins'
import { GoTmpl } from './types'
import { isValueTrue, valueFromJS, valueToJS, valueToString } from './value'

/**
 * The {@linkcode Renderer} class is responsible for rendering Go templates
 * given an {@link GoTmpl.AST} and a context object to populate the template.
 *
 * @example
 * ```ts
 * const tokens = lex(`Hello, {{.Name}}!`)
 * const ast = parse(tokens)
 * const renderer = new Renderer(ast, { Name: 'World' })
 * const output = renderer.render() // 'Hello, World!'
 * ```
 */
export class Renderer {

  /** Stack of variable scopes for template rendering */
  private scopes: Array<Record<string, GoTmpl.Value>> = []

  /** Registry of defined templates (name -> List body) */
  private templates = new Map<string, GoTmpl.Node.List>()

  /**
   * Constructs a new `Renderer` instance.
   *
   * @param root The Go template AST to render.
   * @param context The context object to use during rendering.
   */
  constructor(private root: GoTmpl.AST, context: unknown) {
    const contextValue = valueFromJS(context)
    this.pushScope({ '.': contextValue, '$': contextValue })
    this.templates = this.collectTemplates(root)
  }

  /****************************************************/
  /* Variable scope management                        */
  /****************************************************/

  /**
   * Collect template definitions (define) from the AST.
   * Block defaults are inlined; no separate storage needed.
   *
   * @param list Root list node to traverse
   * @returns Map of template names to their body lists
   */
  private collectTemplates(list: GoTmpl.Node.List): Map<string, GoTmpl.Node.List> {
    const templates = new Map<string, GoTmpl.Node.List>()
    const stack = createList([list])
    while (stack.length > 0) {
      const current = stack.pop()!
      for (const node of current.nodes) {
        if (node.type === 'Template' && node.keyword === 'define' && node.list) {
          const name = node.name.value
          if (templates.has(name)) throw new SyntaxError(`template: duplicate define for ${name}`)
          templates.set(name, node.list)
        }
        else if (node.type === 'If' || node.type === 'With' || node.type === 'Range') {
          stack.push(node.list)
          if (node.elseList) stack.push(node.elseList)
        }
      }
    }
    return templates
  }

  /**
   * Pushes a new variable scope onto the stack. Allowing
   * for variable scoping within branches and templates.
   *
   * @param variables The variables to include in the new scope
   */
  private pushScope(variables: Record<string, GoTmpl.Value>) {
    this.scopes.push(variables)
  }

  /** Pops the top variable scope off the stack */
  private popScope() {
    this.scopes.pop()
  }

  /**
   * Sets a variable in the current scope.
   *
   * @param name The name of the variable to set.
   * @param value The value to assign to the variable.
   * @example this.setVar('Name', { kind: 'string', value: 'World' })
   */
  private setVar(name: string, value: GoTmpl.Value) {
    const top = this.scopes.at(-1)
    if (!top) throw new Error('No scope available to set variable')
    top[name] = value
  }

  /**
   * Retrieves a variable from the current scope stack.
   *
   * @param name The name of the variable to retrieve.
   * @param fallback Optional fallback value if variable not found.
   * @returns The variable value, or `nil` if not found.
   */
  private getVar(name: string, fallback?: GoTmpl.Value): GoTmpl.Value {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const variable = this.scopes[i][name]
      if (variable) return variable
    }
    return fallback ?? { kind: GoTmpl.Value.Kind.Nil }
  }

  /****************************************************/
  /* Rendering logic                                  */
  /****************************************************/

  render(): string {
    const result: string[] = []
    for (const node of this.root.nodes) {
      const rendered = this.renderNode(node)
      result.push(rendered)
    }
    return result.join('')
  }

  private renderNode(node: GoTmpl.Node): string {
    if (node.type === 'Text') { return node.text }
    else if (node.type === 'If') { return this.renderIf(node) }
    else if (node.type === 'With') { return this.renderWith(node) }
    else if (node.type === 'Range') { return this.renderRange(node) }
    else if (node.type === 'Action') { // actions with variable declarations emit no output
      const value = this.evalPipe(node.pipe)
      if (node.pipe.declarations.length > 0) return ''
      return valueToString(value)
    }
    else if (node.type === 'Template') { return this.renderTemplate(node) }
    return ''
  }

  private renderIf(branch: GoTmpl.Node.Branch): string {
    const condition = this.evalPipe(branch.pipe)

    // --- If branch handling.
    if (isValueTrue(condition)) {
      // Isolate scope for branch body.
      this.pushScope({ '.': this.getVar('.'), '$': this.getVar('$') })
      const body = branch.list.nodes.map(node => this.renderNode(node)).join('')
      this.popScope()
      return body
    }

    // --- Else branch handling.
    if (branch.elseList) {
      this.pushScope({ '.': this.getVar('.'), '$': this.getVar('$') })
      const body = branch.elseList.nodes.map(node => this.renderNode(node)).join('')
      this.popScope()
      return body
    }
    return ''
  }

  private renderWith(branch: GoTmpl.Node.Branch): string {
    const condition = this.evalPipe(branch.pipe)

    // --- With branch handling.
    if (isValueTrue(condition)) {
      this.pushScope({ '.': condition, '$': this.getVar('$', condition) })
      const body = branch.list.nodes.map(node => this.renderNode(node)).join('')
      this.popScope()
      return body
    }

    // --- Else branch handling.
    if (branch.elseList) {
      this.pushScope({ '.': this.getVar('.'), '$': this.getVar('$') })
      const body = branch.elseList.nodes.map(node => this.renderNode(node)).join('')
      this.popScope()
      return body
    }
    return ''
  }

  private renderRange(n: GoTmpl.Node.Branch): string {
    const target = this.evalPipe(n.pipe)

    // --- Handle array range iteration. Array iteration
    // --- sets dot to each element in turn.
    if (target.kind === GoTmpl.Value.Kind.Array) {
      const array = valueToJS(target)
      if (array.length === 0) return n.elseList ? n.elseList.nodes.map(x => this.renderNode(x)).join('') : ''
      let result = ''
      const decls = n.pipe.declarations
      const hasTwo = decls.length === 2
      const hasOne = decls.length === 1

      // --- Assign declared variables per iteration if present.
      for (const [i, item] of array.entries()) {
        if (hasTwo) {
          this.setVar(decls[0].names[0], { kind: GoTmpl.Value.Kind.Number, value: i, raw: String(i) })
          this.setVar(decls[1].names[0], valueFromJS(item))
        }
        else if (hasOne) {
          this.setVar(decls[0].names[0], valueFromJS(item))
        }
        this.pushScope({
          '.': valueFromJS(item),
          '$index': { kind: GoTmpl.Value.Kind.Number, value: i, raw: String(i) },
          '$': this.getVar('$', valueFromJS(item)),
        })
        result += n.list.nodes.map(node => this.renderNode(node)).join('')
        this.popScope()
      }
      return result
    }

    // --- Handle object range iteration. Object iteration
    // --- sets dot to each value in turn, with $key as key.
    if (target.kind === GoTmpl.Value.Kind.Object) {
      const object = valueToJS(target)
      const entries = Object.entries(object)
      if (entries.length === 0) return n.elseList ? n.elseList.nodes.map(x => this.renderNode(x)).join('') : ''
      let result = ''
      const decls = n.pipe.declarations
      const hasTwo = decls.length === 2
      const hasOne = decls.length === 1

      // --- Assign declared variables per iteration if present.
      for (const [k, v] of entries) {
        if (hasTwo) {
          this.setVar(decls[0].names[0], valueFromJS(k))
          this.setVar(decls[1].names[0], valueFromJS(v))
        }
        else if (hasOne) {
          this.setVar(decls[0].names[0], valueFromJS(v))
        }
        this.pushScope({ '.': valueFromJS(v), '$key': valueFromJS(k), '$': this.getVar('$', valueFromJS(v)) })
        result += n.list.nodes.map(node => this.renderNode(node)).join('')
        this.popScope()
      }
      return result
    }

    // --- Non-iterable target: render else branch if present.
    return n.elseList
      ? n.elseList.nodes.map(x => this.renderNode(x)).join('')
      : ''
  }

  /****************************************************/
  /* Evaluation of nodes and expressions              */
  /****************************************************/

  private evalPipe(pipe: GoTmpl.Node.Pipe): GoTmpl.Value {
    const { commands, declarations } = pipe

    // --- Evaluate sequential commands, previous result provided
    // --- as final arg to next command semantics.
    let current: GoTmpl.Value = { kind: GoTmpl.Value.Kind.Nil }
    for (const [i, cmd] of commands.entries())
      current = this.evalCommand(cmd, i === 0 ? undefined : current)

    // --- If there is only one variable declared, assign current value to it.
    // --- Example: {{$var := .SomeValue}}
    if (declarations.length > 0
      && declarations.length === 1)
      this.setVar(declarations[0].names[0], current)

    // --- Return final evaluated value.
    return current
  }

  private evalCommand(cmd: GoTmpl.Node.Command, previous?: GoTmpl.Value): GoTmpl.Value {
    if (cmd.args.length === 0) return { kind: GoTmpl.Value.Kind.Nil }
    const first = cmd.args[0]

    // --- Builtin function invocation with pipeline chaining
    if (first.type === 'Identifier' && first.name in BUILTINS) {
      const fn = BUILTINS[first.name]
      const args = cmd.args.slice(1).map(a => this.evalArgument(a))
      const finalArguments = previous ? [...args, previous] : args
      return fn(...finalArguments)
    }

    // --- Non-builtin: evaluate sequentially; if previous provided and more
    // --- than one arg, ignore chaining semantics (acts as last value)
    let value: GoTmpl.Value = { kind: GoTmpl.Value.Kind.Nil }
    for (const argument of cmd.args) value = this.evalArgument(argument)
    return value
  }

  private evalArgument(node: GoTmpl.Node): GoTmpl.Value {
    if (node.type === 'Identifier') return this.getVar(node.name, { kind: GoTmpl.Value.Kind.String, value: node.name })
    if (node.type === 'Variable') return this.getVar(node.names[0])
    if (node.type === 'Dot') return this.getVar('.')
    if (node.type === 'String') return { kind: GoTmpl.Value.Kind.String, value: node.value }
    if (node.type === 'Number') return { kind: GoTmpl.Value.Kind.Number, value: node.value, raw: node.text }
    if (node.type === 'Bool') return { kind: GoTmpl.Value.Kind.Bool, value: node.value }
    if (node.type === 'Nil') return { kind: GoTmpl.Value.Kind.Nil }
    if (node.type === 'Chain') return this.evalChain(node)
    if (node.type === 'Field') return this.evalField(node.identifiers)
    return { kind: GoTmpl.Value.Kind.Nil }
  }

  private evalChain(chain: GoTmpl.Node.Chain): GoTmpl.Value {
    const base = this.evalArgument(chain.node)
    return this.evalFieldFrom(base, chain.field)
  }

  private evalField(idents: string[]): GoTmpl.Value {
    const dot = this.getVar('.')
    if (!dot) return { kind: GoTmpl.Value.Kind.Nil }
    return this.evalFieldFrom(dot, idents)
  }

  private evalFieldFrom(receiver: GoTmpl.Value, idents: string[]): GoTmpl.Value {
    let current = receiver
    for (const id of idents) {
      if (current.kind === GoTmpl.Value.Kind.Object) {
        const object = current
        const inner = object.value[id] ?? { kind: GoTmpl.Value.Kind.Nil }
        current = inner
      }
      else {
        return { kind: GoTmpl.Value.Kind.Nil }
      }
    }
    return current
  }

  /****************************************************/
  /* Template Rendering                               */
  /****************************************************/

  private renderTemplate(node: GoTmpl.Node.Template): string {
    if (node.keyword === 'define') return '' // definitions produce no direct output
    const name = node.name.value

    // Determine body list per Go semantics:
    //   template: must exist in templates map; if missing => error.
    //   block: if a define of same name exists, use that body; else use inline block body (node.list)
    let body: GoTmpl.Node.List | undefined
    if (node.keyword === 'template') body = this.templates.get(name)
    else if (node.keyword === 'block') body = this.templates.get(name) ?? node.list
    if (!body) throw new SyntaxError(`template: no such template "${name}"`)

    // Evaluate pipeline (if any) to set new dot; if pipe is empty just reuse current dot
    const pipeValue = (node.pipe && node.pipe.commands.length > 0)
      ? this.evalPipe(node.pipe)
      : this.getVar('.')

    this.pushScope({ '.': pipeValue, '$': this.getVar('$') })
    const out = body.nodes.map(n => this.renderNode(n)).join('')
    this.popScope()
    return out
  }
}

/**
 * Renders a Go template AST with the provided context.
 *
 * @param root The Go template AST to render.
 * @param context The context object to use during rendering.
 * @returns The rendered string.
 * @example
 * ```ts
 * const tokens = lex(`Hello, {{.Name}}!`)
 * const ast = parse(tokens)
 * const output = render(ast, { Name: 'World' }) // 'Hello, World!'
 * ```
 */
export function render(root: GoTmpl.AST, context: unknown): string {
  return new Renderer(root, context).render()
}
