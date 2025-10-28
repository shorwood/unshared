import { GoTmpl } from './types'

/**
 * Convert a JavaScript value to a {@linkcode GoTmpl.Value}. This
 * function handles primitive types, arrays, objects, and functions,
 * converting them into their corresponding GoTmpl representations.
 *
 * @param value The JavaScript value to convert.
 * @returns The corresponding {@linkcode GoTmpl.Value}.
 */
export function valueFromJS(value?: unknown): GoTmpl.Value {

  // --- Return early for nil.
  if (value === null || value === undefined) return { kind: GoTmpl.Value.Kind.Nil }

  // --- Convert from primitive types.
  if (typeof value === 'boolean') return { kind: GoTmpl.Value.Kind.Bool, value }
  if (typeof value === 'number') return { kind: GoTmpl.Value.Kind.Number, value }
  if (typeof value === 'string') return { kind: GoTmpl.Value.Kind.String, value }
  if (typeof value === 'bigint') return { kind: GoTmpl.Value.Kind.String, value: value.toString() }
  if (typeof value === 'symbol') return { kind: GoTmpl.Value.Kind.String, value: value.toString() }

  // --- Convert arrays recursively.
  if (Array.isArray(value))
    return { kind: GoTmpl.Value.Kind.Array, value: value.map(item => valueFromJS(item)) }

  // --- Wrap functions.
  if (typeof value === 'function') {
    return {
      kind: GoTmpl.Value.Kind.Function,
      raw: value as (...args: unknown[]) => unknown,
      value: (...args: GoTmpl.Value[]) => {
        const jsArguments = args.map(x => valueToJS(x))
        const fn = value as (...args: unknown[]) => unknown
        const result = fn(...jsArguments)
        return valueFromJS(result)
      },
    }
  }

  // --- Convert objects values recursively.
  const entries = Object.entries(value).map(([k, v]) => [k, valueFromJS(v)] as const)
  return { kind: GoTmpl.Value.Kind.Object, value: Object.fromEntries(entries), raw: value }
}

/**
 * Convert a {@linkcode GoTmpl.Value} to a JavaScript value.
 *
 * @param value The GoTmpl value to convert.
 * @returns The corresponding JavaScript value.
 */
export function valueToJS(value: GoTmpl.Value.Array): unknown[]
export function valueToJS(value: GoTmpl.Value.String): string
export function valueToJS(value: GoTmpl.Value.Number): number
export function valueToJS(value: GoTmpl.Value.Bool): boolean
export function valueToJS(value: GoTmpl.Value.Function): (...args: unknown[]) => unknown
export function valueToJS(value: GoTmpl.Value.Object): Record<string, unknown>
export function valueToJS(value: GoTmpl.Value.Nil): undefined
export function valueToJS(value?: GoTmpl.Value): unknown
export function valueToJS(value?: GoTmpl.Value): unknown {
  if (!value) return
  if (value.kind === GoTmpl.Value.Kind.Nil) return
  if (value.kind === GoTmpl.Value.Kind.Bool) return value.value
  if (value.kind === GoTmpl.Value.Kind.Number) return value.value
  if (value.kind === GoTmpl.Value.Kind.String) return value.value
  if (value.kind === GoTmpl.Value.Kind.Array) return value.value.map(v => valueToJS(v))
  if (value.kind === GoTmpl.Value.Kind.Function) return value.raw
  if (value.kind === GoTmpl.Value.Kind.Object) return value.raw
}

/**
 * Convert a {@linkcode GoTmpl.Value} to its string representation.
 *
 * @param value The GoTmpl value to convert.
 * @returns The string representation of the value.
 */
export function valueToString(value: GoTmpl.Value): string {
  if (value.kind === GoTmpl.Value.Kind.Bool) return String(value.value)
  if (value.kind === GoTmpl.Value.Kind.Number) return String(value.value)
  if (value.kind === GoTmpl.Value.Kind.String) return value.value
  if (value.kind === GoTmpl.Value.Kind.Array) return value.value.map(v => valueToString(v)).join(' ')
  if (value.kind === GoTmpl.Value.Kind.Object) return Object.entries(value.value).map(([k, v]) => `${k}:${valueToString(v)}`).join(' ')
  if (value.kind === GoTmpl.Value.Kind.Function) return '[function]'
  return ''
}

/**
 * Predicate to determine the truthiness of a GoTmpl value.
 *
 * @param value The GoTmpl value to evaluate.
 * @returns True if the value is considered true, false otherwise.
 */
export function isValueTrue(value: GoTmpl.Value): boolean {
  if (value.kind === GoTmpl.Value.Kind.Bool) return value.value
  if (value.kind === GoTmpl.Value.Kind.Number) return value.value !== 0
  if (value.kind === GoTmpl.Value.Kind.String) return value.value.length > 0
  if (value.kind === GoTmpl.Value.Kind.Array) return value.value.length > 0
  if (value.kind === GoTmpl.Value.Kind.Object) return Object.keys(value.value).length > 0
  return value.kind === GoTmpl.Value.Kind.Function
}
