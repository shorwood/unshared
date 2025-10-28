import { escapeHtml } from '../escapeHtml'
import { GoTmpl } from './types'
import { isValueTrue, valueFromJS, valueToJS, valueToString } from './value'

export const BUILTINS: Record<string, (...args: GoTmpl.Value[]) => GoTmpl.Value> = Object.freeze({

  /**
   * Returns the length of a value. The value must be a string, array, or object
   * for which the length can be determined. Otherwise, a SyntaxError is thrown.
   *
   * @param value The value to get the length of.
   * @returns A {@linkcode GoTmpl.Value.Number} representing the length of the input value.
   * @example ```gotmpl
   * {{ len "hello" }}        <!-- Outputs 5 -->
   * {{ len (array 1 2 3) }}  <!-- Outputs 3 -->
   * {{ len (dict "a" 1 "b" 2) }} <!-- Outputs 2 -->
   * ```
   */
  len(value: GoTmpl.Value): GoTmpl.Value.Number {
    if (value.kind === GoTmpl.Value.Kind.String) return { kind: GoTmpl.Value.Kind.Number, value: value.value.length }
    if (value.kind === GoTmpl.Value.Kind.Array) return { kind: GoTmpl.Value.Kind.Number, value: value.value.length }
    if (value.kind === GoTmpl.Value.Kind.Object) return { kind: GoTmpl.Value.Kind.Number, value: Object.keys(value.value).length }
    throw new SyntaxError(`len: unsupported type "${valueToString(value)}"`)
  },

  /**
   * Shallow equality check. Returns true if all provided values are equal,
   *
   * @param values The values to compare for equality.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether all values are equal.
   * @example
   * ```gotmpl
   * {{ eq 1 1 1 }}        <!-- Outputs true -->
   * {{ eq "a" "a" "b" }}  <!-- Outputs false -->
   * {{ eq .Var1 .Var2 }}  <!-- Outputs true or false based on variable values -->
   * ```
   */
  eq(...values: GoTmpl.Value[]): GoTmpl.Value.Bool {
    if (values.length < 2) throw new SyntaxError('eq: need at least two arguments')
    const [first, ...rest] = values
    for (const value of rest) {
      if (first.kind !== value.kind) return { kind: GoTmpl.Value.Kind.Bool, value: false }
      else if (first.kind === GoTmpl.Value.Kind.Nil) continue // In Go templates, nil == nil is true
      else if (first.kind === GoTmpl.Value.Kind.Bool && value.kind === GoTmpl.Value.Kind.Bool && first.value === value.value) continue
      else if (first.kind === GoTmpl.Value.Kind.Number && value.kind === GoTmpl.Value.Kind.Number && first.value === value.value) continue
      else if (first.kind === GoTmpl.Value.Kind.String && value.kind === GoTmpl.Value.Kind.String && first.value === value.value) continue
      else return { kind: GoTmpl.Value.Kind.Bool, value: false }
    }
    return { kind: GoTmpl.Value.Kind.Bool, value: true }
  },

  /**
   * Shallow inequality check. Returns true if any provided values are not equal.
   *
   * @param values The values to compare for inequality.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether any values are not equal.
   * @example
   * ```gotmpl
   * {{ ne 1 2 1 }}        <!-- Outputs true -->
   * {{ ne "a" "a" "a" }}  <!-- Outputs false -->
   * {{ ne .Var1 .Var2 }}  <!-- Outputs true or false based on variable values -->
   * ```
   */
  ne(...values: GoTmpl.Value[]): GoTmpl.Value.Bool {
    if (values.length < 2) throw new SyntaxError('ne: need at least two arguments')
    const result = BUILTINS.eq(...values) as GoTmpl.Value.Bool
    return { kind: GoTmpl.Value.Kind.Bool, value: !result.value }
  },

  /**
   * Less-than comparison. Both values must be numbers.
   *
   * @param a The first value.
   * @param b The second value.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether a < b.
   * @example
   * ```gotmpl
   * {{ lt 3 5 }}  <!-- Outputs true -->
   * {{ lt .Var1.len .Var2.len }}  <!-- Outputs true or false based on variable lengths -->
   * ```
   */
  lt(a: GoTmpl.Value, b: GoTmpl.Value): GoTmpl.Value.Bool {
    if (a.kind !== GoTmpl.Value.Kind.Number || b.kind !== GoTmpl.Value.Kind.Number) throw new SyntaxError('lt: operands must be numbers')
    return { kind: GoTmpl.Value.Kind.Bool, value: a.value < b.value }
  },

  /**
   * Greater-than comparison. Both values must be numbers.
   *
   * @param a The first value.
   * @param b The second value.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether a > b.
   * @example
   * ```gotmpl
   * {{ gt 7 2 }}  <!-- Outputs true -->
   * {{ gt .Var1.count .Var2.count }}  <!-- Outputs true or false based on variable counts -->
   * ```
   */
  gt(a: GoTmpl.Value, b: GoTmpl.Value): GoTmpl.Value.Bool {
    if (a.kind !== GoTmpl.Value.Kind.Number || b.kind !== GoTmpl.Value.Kind.Number) throw new SyntaxError('gt: operands must be numbers')
    return { kind: GoTmpl.Value.Kind.Bool, value: a.value > b.value }
  },

  /**
   * Less-than-or-equal comparison. Both values must be numbers.
   *
   * @param a The first value.
   * @param b The second value.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether a <= b.
   * @example
   * ```gotmpl
   * {{ le 4 4 }}  <!-- Outputs true -->
   * {{ le .Var1.size .Var2.size }}  <!-- Outputs true or false based on variable sizes -->
   * ```
   */
  le(a: GoTmpl.Value, b: GoTmpl.Value): GoTmpl.Value.Bool {
    if (a.kind !== GoTmpl.Value.Kind.Number || b.kind !== GoTmpl.Value.Kind.Number) throw new SyntaxError('le: operands must be numbers')
    return { kind: GoTmpl.Value.Kind.Bool, value: a.value <= b.value }
  },

  /**
   * Greater-than-or-equal comparison. Both values must be numbers.
   *
   * @param a The first value.
   * @param b The second value.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing whether a >= b.
   * @example
   * ```gotmpl
   * {{ ge 6 5 }}  <!-- Outputs true -->
   * {{ ge .Var1.total .Var2.total }}  <!-- Outputs true or false based on variable totals -->
   * ```
   */
  ge(a: GoTmpl.Value, b: GoTmpl.Value): GoTmpl.Value.Bool {
    if (a.kind !== GoTmpl.Value.Kind.Number || b.kind !== GoTmpl.Value.Kind.Number) throw new SyntaxError('ge: operands must be numbers')
    return { kind: GoTmpl.Value.Kind.Bool, value: a.value >= b.value }
  },

  /**
   * Logical AND operation. Returns true if all values are true.
   *
   * @param values The values to evaluate.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing the logical AND of the input values.
   * @example
   * ```gotmpl
   * {{ and true true false }}  <!-- Outputs false -->
   * {{ and .Var1.isActive .Var2.isVerified }}  <!-- Outputs true or false based on variable states -->
   * ```
   */
  and(...values: GoTmpl.Value[]): GoTmpl.Value.Bool {
    for (const value of values) {
      if (isValueTrue(value)) continue
      return { kind: GoTmpl.Value.Kind.Bool, value: false }
    }
    return { kind: GoTmpl.Value.Kind.Bool, value: true }
  },

  /**
   * Logical OR operation. Returns true if any value is true.
   *
   * @param values The values to evaluate.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing the logical OR of the input values.
   * @example
   * ```gotmpl
   * {{ or false false true }}  <!-- Outputs true -->
   * {{ or .Var1.hasAccess .Var2.isAdmin }}  <!-- Outputs true or false based on variable permissions -->
   * ```
   */
  or(...values: GoTmpl.Value[]): GoTmpl.Value.Bool {
    for (const value of values) {
      if (!isValueTrue(value)) continue
      return { kind: GoTmpl.Value.Kind.Bool, value: true }
    }
    return { kind: GoTmpl.Value.Kind.Bool, value: false }
  },

  /**
   * Logical NOT operation. Returns true if the value is false.
   *
   * @param value The value to negate.
   * @returns A {@linkcode GoTmpl.Value.Bool} representing the logical NOT of the input value.
   * @example
   * ```gotmpl
   * {{ not true }}   <!-- Outputs false -->
   * {{ not .Var1.isEmpty }}  <!-- Outputs true or false based on variable emptiness -->
   * ```
   */
  not(value: GoTmpl.Value): GoTmpl.Value.Bool {
    return { kind: GoTmpl.Value.Kind.Bool, value: !isValueTrue(value) }
  },

  /**
   * Concatenates multiple values into a single string.
   *
   * @param values The values to concatenate.
   * @returns A {@linkcode GoTmpl.Value.String} representing the concatenated string.
   * @example
   * ```gotmpl
   * {{ print "Hello, " "world!" }}  <!-- Outputs "Hello, world!" -->
   * {{ print .Var1 .Var2 }}  <!-- Outputs concatenated variable values -->
   * ```
   */
  print(...values: GoTmpl.Value[]): GoTmpl.Value.String {
    return {
      kind: GoTmpl.Value.Kind.String,
      value: values.map(v => valueToString(v)).join(''),
    }
  },

  /**
   * Concatenates multiple values into a single string with a newline at the end.
   *
   * @param values The values to concatenate.
   * @returns A {@linkcode GoTmpl.Value.String} representing the concatenated string with a newline.
   * @example
   * ```gotmpl
   * {{ println "Hello, " "world!" }}  <!-- Outputs "Hello, world!\n" -->
   * {{ println .Var1 .Var2 }}  <!-- Outputs concatenated variable values with a newline -->
   * ```
   */
  println(...values: GoTmpl.Value[]): GoTmpl.Value.String {
    return {
      kind: GoTmpl.Value.Kind.String,
      value: `${values.map(v => valueToString(v)).join('')}\n`,
    }
  },

  /**
   * URL-encodes a string value.
   *
   * @param value The value to URL-encode.
   * @returns A {@linkcode GoTmpl.Value.String} representing the URL-encoded string.
   * @example
   * ```gotmpl
   * {{ urlquery "Hello World!" }}  <!-- Outputs "Hello%20World%21" -->
   * {{ urlquery .Var1 }}  <!-- Outputs URL-encoded variable value -->
   * ```
   */
  urlquery(value: GoTmpl.Value): GoTmpl.Value.String {
    return {
      kind: GoTmpl.Value.Kind.String,
      value: encodeURIComponent(valueToString(value)),
    }
  },

  /**
   * Index operator. Retrieves a value from a container by key.
   *
   * @param container The container to index into.
   * @param key The key to use for indexing.
   * @returns The value at the specified key, or nil if not found.
   * @example
   * ```gotmpl
   * {{ index (array "a" "b" "c") 1 }}        <!-- Outputs "b" -->
   * {{ index (dict "key1" "value1" "key2" "value2") "key2" }}  <!-- Outputs "value2" -->
   * ```
   */
  index(container: GoTmpl.Value, key: GoTmpl.Value): GoTmpl.Value {

    // --- Iterate over possible container/key types.
    if (container.kind === GoTmpl.Value.Kind.Array
      && key.kind === GoTmpl.Value.Kind.Number) {
      const array = valueToJS(container)
      const index = valueToJS(key)
      return (index >= 0 && index < array.length)
        ? valueFromJS(array[index])
        : valueFromJS()
    }

    // --- Object container with string/number key.
    if (container.kind === GoTmpl.Value.Kind.Object
      && (key.kind === GoTmpl.Value.Kind.String
        || key.kind === GoTmpl.Value.Kind.Number)) {
      const object = valueToJS(container)
      const keyValue = valueToString(key)
      return Object.hasOwnProperty.call(object, keyValue)
        ? valueFromJS(object[keyValue])
        : valueFromJS()
    }

    // --- Otherwise, return nil.
    return valueFromJS()
  },

  /**
   * HTML-escapes a string for safe embedding in HTML context.
   * Replaces &, <, >, ' and " with corresponding entities.
   *
   * @param value Input value coerced to string.
   * @returns Escaped HTML string value.
   */
  html(value: GoTmpl.Value): GoTmpl.Value.String {
    const raw = valueToString(value)
    return { kind: GoTmpl.Value.Kind.String, value: escapeHtml(raw) }
  },

  /**
   * Escapes a string for safe embedding inside JavaScript string literals.
   *
   * @param value Input value coerced to string.
   * @returns JS-escaped string value.
   */
  js(value: GoTmpl.Value): GoTmpl.Value.String {
    const raw = valueToString(value)
    // Use JSON.stringify for core escaping then post-process for HTML-sensitive chars.
    const core = JSON.stringify(raw).slice(1, -1) // strip quotes
    const escaped = core
      .replaceAll('<', String.raw`\u003C`)
      .replaceAll('>', String.raw`\u003E`)
      .replaceAll('&', String.raw`\u0026`)
    return { kind: GoTmpl.Value.Kind.String, value: escaped }
  },

  /**
   * Returns a slice of an array or string. Accepts (value, i) or (value, i, j).
   * Indices must be within bounds and i <= j.
   *
   * @param value Source array or string value.
   * @param i Start index (inclusive).
   * @param j Optional end index (exclusive).
   * @returns A sliced value of same kind (array or string).
   */
  slice(value: GoTmpl.Value, i: GoTmpl.Value, j?: GoTmpl.Value): GoTmpl.Value {

    // --- Validate indices.
    if (i.kind !== GoTmpl.Value.Kind.Number
      || (j && j.kind !== GoTmpl.Value.Kind.Number)) throw new SyntaxError('slice: indices must be numbers')

    const start = i.value
    const end = j ? j.value : undefined

    // --- Perform array slicing.
    if (value.kind === GoTmpl.Value.Kind.Array) {
      const array = value.value
      const to = end ?? array.length
      if (start < 0 || to < start || to > array.length) throw new SyntaxError('slice: index out of range')
      return { kind: GoTmpl.Value.Kind.Array, value: array.slice(start, to) }
    }

    // --- Perform string slicing.
    if (value.kind === GoTmpl.Value.Kind.String) {
      const string = value.value
      const to = end ?? string.length
      if (start < 0 || to < start || to > string.length) throw new SyntaxError('slice: index out of range')
      return { kind: GoTmpl.Value.Kind.String, value: string.slice(start, to) }
    }
    throw new SyntaxError(`slice: unsupported type "${valueToString(value)}"`)
  },

  /**
   * Formats a string using a subset of Go's fmt verbs: %v %s %d %f %t and %%.
   *
   * @param format Format string value.
   * @param args Arguments to substitute.
   * @returns Formatted string value.
   */
  printf(format: GoTmpl.Value, ...args: GoTmpl.Value[]): GoTmpl.Value.String {

    // --- Validate format string.
    if (format.kind !== GoTmpl.Value.Kind.String)
      throw new SyntaxError('printf: first argument must be a string')

    // --- Parse format string.
    let argumentIndex = 0
    const tokens: string[] = []
    let index = 0
    while (index < format.value.length) {
      const ch = format.value[index]
      if (ch !== '%') { tokens.push(ch); index++; continue }
      const next = format.value[index + 1]
      if (!next) { tokens.push('%'); index++; continue }
      if (next === '%') { tokens.push('%'); index += 2; continue }
      const match = `%${next}`
      index += 2
      if (argumentIndex >= args.length) { tokens.push(''); continue }
      const argument = args[argumentIndex++]
      switch (match) {
        case '%v': { tokens.push(valueToString(argument)); break }
        case '%s': { tokens.push(valueToString(argument)); break }
        case '%d': { tokens.push(argument.kind === GoTmpl.Value.Kind.Number ? String(Math.trunc(argument.value)) : '0'); break }
        case '%f': { tokens.push(argument.kind === GoTmpl.Value.Kind.Number ? String(argument.value) : '0'); break }
        case '%t': { tokens.push(argument.kind === GoTmpl.Value.Kind.Bool ? String(argument.value) : 'false'); break }
        default: { tokens.push(match) }
      }
    }

    // --- Return formatted string.
    return { kind: GoTmpl.Value.Kind.String, value: tokens.join('') }
  },

  /**
   * Call operator. Invokes a function value with provided arguments.
   *
   * @param fn The function to call.
   * @param args The arguments to pass to the function.
   * @returns The result of the function call.
   * @example
   * ```gotmpl
   * {{ call .MyFunction "arg1" 42 }}  <!-- Calls MyFunction with arguments "arg1" and 42 -->
   * ```
   */
  call(fn: GoTmpl.Value, ...args: GoTmpl.Value[]): GoTmpl.Value {
    if (fn.kind !== GoTmpl.Value.Kind.Function) throw new SyntaxError('call: first argument must be a function')
    return fn.value(...args)
  },
})
