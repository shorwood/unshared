/* eslint-disable sonarjs/cognitive-complexity */
import { isDigit } from '../isDigit'
import { GoTmpl } from './types'

/** Mapping of keyword strings to token types. */
export const KEYWORDS: Record<string, GoTmpl.Token.Type> = Object.freeze({
  if: GoTmpl.Token.Type.If,
  else: GoTmpl.Token.Type.Else,
  end: GoTmpl.Token.Type.End,
  range: GoTmpl.Token.Type.Range,
  with: GoTmpl.Token.Type.With,
  nil: GoTmpl.Token.Type.Nil,
  define: GoTmpl.Token.Type.Define,
  block: GoTmpl.Token.Type.Block,
  template: GoTmpl.Token.Type.Template,
  true: GoTmpl.Token.Type.Bool,
  false: GoTmpl.Token.Type.Bool,
})

/**
 * Function to determine if a character is a valid identifier start character.
 * We use this instead of regex for performance reasons. This matches the
 * code points for 'A'-'Z', 'a'-'z', and '_'.
 *
 * @param c The character to test.
 * @returns True if the character is a valid identifier start character.
 */
function isIdentifierStart(c: string) {
  const code = c.codePointAt(0) ?? 0
  return (code >= 65 && code <= 90) || code === 95 || (code >= 97 && code <= 122)
}

/**
 * Function to determine if a character is a valid identifier character.
 *
 * @param c The character to test.
 * @returns True if the character is a valid identifier character.
 */
function isIdentifierChar(c: string) {
  const code = c.codePointAt(0) ?? 0
  return (code >= 48 && code <= 57) || isIdentifierStart(c)
}

/**
 * Function to determine if a character is a valid digit character.
 * This also includes `_` and `.` for Go-like number literals.
 *
 * @param c The character to test.
 * @returns True if the character is a valid digit character.
 */
function isDigitChar(c: string) {
  const code = c.codePointAt(0) ?? 0
  return (code >= 48 && code <= 57) || code === 95 || code === 46
}

/**
 * Statefully lex a Go template string into tokens.
 *
 * @param template The template string to lex.
 * @returns The array of lexed tokens.
 * @example
 * ```ts
 * const template = `Hello, {{- if .Name }}{{ .Name }}{{- else }}Guest{{- end }}!`
 * const tokens = lex(template)
 * // tokens: GoTmpl.Token[] = [
 * //   { type: GoTmpl.Token.Type.Text, pos: 0, value: 'Hello, ', line: 1 },
 * //   { type: GoTmpl.Token.Type.LeftDelim, pos: 7, value: '{{-', line: 1 },
 * //   { type: GoTmpl.Token.Type.If, pos: 10, value: 'if', line: 1 },
 * //   { type: GoTmpl.Token.Type.Space, pos: 12, value: ' ', line: 1 },
 * //   { type: GoTmpl.Token.Type.Field, pos: 13, value: '.Name', line: 1 },
 * //   { type: GoTmpl.Token.Type.RightDelim, pos: 18, value: '}}', line: 1 },
 * //   { type: GoTmpl.Token.Type.LeftDelim, pos: 20, value: '{{', line: 1 },
 * //   { type: GoTmpl.Token.Type.Space, pos: 22, value: ' ', line: 1 },
 * //   { type: GoTmpl.Token.Type.Field, pos: 23, value: '.Name', line: 1 },
 * //   { type: GoTmpl.Token.Type.RightDelim, pos: 28, value: '}}', line: 1 },
 * //   { type: GoTmpl.Token.Type.LeftDelim, pos: 30, value: '{{-', line: 1 },
 * //   { type: GoTmpl.Token.Type.Else, pos: 33, value: 'else', line: 1 },
 * //   { type: GoTmpl.Token.Type.RightDelim, pos: 37, value: '}}', line: 1 },
 * //   { type: GoTmpl.Token.Type.Text, pos: 39, value: 'Guest', line: 1 },
 * //   { type: GoTmpl.Token.Type.LeftDelim, pos: 44, value: '{{-', line: 1 },
 * //   { type: GoTmpl.Token.Type.End, pos: 47, value: 'end', line: 1 },
 * //   { type: GoTmpl.Token.Type.RightDelim, pos: 50, value: '}}', line: 1 },
 * //   { type: GoTmpl.Token.Type.Text, pos: 52, value: '!', line: 1 },
 * //   { type: GoTmpl.Token.Type.EOF, pos: 53, value: '', line: 1 },
 * // ]
 * ```
 */
export function lex(template: string): GoTmpl.Token[] {
  const leftDelim = '{{'
  const rightDelim = '}}'
  const tokens: GoTmpl.Token[] = []
  let offset = 0
  let line = 1

  // --- Helper to push a token and update line count.
  const push = (type: GoTmpl.Token.Type, pos: number, value: string) => {
    tokens.push({ type, pos, value, line })
    let nl = 0
    for (const ch of value) if (ch === '\n') nl++
    if (nl > 0) line += nl
  }

  // --- Iterate over template, finding actions and lexing inner content
  // --- An action is delimited by leftDelim and rightDelim, with optional
  // --- trim markers '-' adjacent to the delimiters.
  while (offset < template.length) {
    const leftIndex = template.indexOf(leftDelim, offset)

    // --- If no more actions, push remaining text and finish.
    if (leftIndex === -1) {
      push(GoTmpl.Token.Type.Text, offset, template.slice(offset))
      offset = template.length
      break
    }

    // --- Anything before the action is text.
    if (leftIndex > offset)
      push(GoTmpl.Token.Type.Text, offset, template.slice(offset, leftIndex))

    // --- Detect optional trim marker on opening: {{- => left trim
    let leftTrim = false
    let openValue = leftDelim
    if (template.startsWith(`${leftDelim}-`, leftIndex)) { // '{{-' pattern
      leftTrim = true
      openValue = `${leftDelim}-`
    }

    // --- Apply left trim to previous text token (remove trailing whitespace)
    if (leftTrim) {
      const previous = tokens.at(-1)
      if (previous?.type === GoTmpl.Token.Type.Text) {
        const original = previous.value
        const trimmed = original.trimEnd()

        // --- Compute removed substring and adjust global line counter for any stripped newlines.
        if (trimmed.length !== original.length) {
          const removed = original.slice(trimmed.length)
          const newlinesRemoved = removed.split('\n').length - 1
          if (newlinesRemoved > 0) line = Math.max(1, line - newlinesRemoved)
          previous.value = trimmed
        }
      }
    }

    // --- Push left delimiter token.
    push(GoTmpl.Token.Type.LeftDelim, leftIndex, openValue)
    offset = leftIndex + openValue.length

    // --- Find right delimiter
    const rightIndex = template.indexOf(rightDelim, offset)
    if (rightIndex === -1) { push(GoTmpl.Token.Type.Error, offset, 'unclosed action'); break }

    // --- Detect optional trim marker before closing: -}} => right trim
    let rightTrim = false
    let closeValue = rightDelim
    if (rightIndex > offset && template[rightIndex - 1] === '-') { // pattern '-}}'
      rightTrim = true
      closeValue = `-${rightDelim}` // Adjust inner to exclude the '-' preceding delimiter
    }

    // --- We are now positioned to extract the action inner content. To handle
    // --- trim markers and whitespace correctly, we first extract the original inner,
    // --- then apply left trim (leading whitespace) and right trim (trailing '-') as needed.
    const innerStart = offset
    const originalInner = template.slice(offset, rightIndex)
    let inner = originalInner
    if (rightTrim && inner.endsWith('-')) inner = inner.slice(0, -1) // If rightTrim consumed '-', remove trailing '-' from inner

    // --- Trim leading whitespace immediately after delimiter; Go template ignores it for first token classification
    inner = inner.replace(/^\s+/, (match) => { line += match.split('\n').length - 1; return '' })
    const actionTokens = lexAction(inner, innerStart + (originalInner.length - inner.length), line)
    tokens.push(...actionTokens)

    // --- Advance outer line counter by number of newlines present in the action's inner content
    // --- (unless it was a comment, which produces no tokens and should not affect line counting).
    if (actionTokens.length > 0) {
      let newlinesInInner = 0
      for (const ch of inner) if (ch === '\n') newlinesInInner++
      if (newlinesInInner > 0) line += newlinesInInner
    }

    // --- Push right delimiter token to close the action.
    push(GoTmpl.Token.Type.RightDelim, rightIndex, closeValue)
    offset = rightIndex + rightDelim.length

    // --- Apply right trim: consume following whitespace in outer text
    // --- If we trimmed newline characters, also skip a single '\n'
    if (rightTrim) {
      while (offset < template.length && /[\t\v\f\r ]/.test(template[offset])) offset++
      if (offset < template.length && template[offset] === '\n') offset++
    }
  }

  // --- End of file token.
  push(GoTmpl.Token.Type.EOF, offset, '')
  return tokens
}

/**
 * Lex the inner content of a Go template action into tokens.
 *
 * @param segment The action inner content.
 * @param start The starting offset of the segment in the original template.
 * @param line The starting line number of the segment.
 * @returns The array of lexed tokens.
 * @example
 * ```ts
 * const action = 'if .Name'
 * const tokens = lexAction(action, 10, 1)
 * // tokens: GoTmpl.Token[] = [
 * //   { type: 'if', pos: 10, value: 'if', line: 1 },
 * //   { type: 'space', pos: 12, value: ' ', line: 1 },
 * //   { type: 'field', pos: 13, value: '.Name', line: 1 },
 * // ]
 * ```
 */
function lexAction(segment: string, start: number, line: number): GoTmpl.Token[] {
  const tokens: GoTmpl.Token[] = []
  let offset = 0

  // --- Helper to push a token and update line count.
  const push = (type: GoTmpl.Token.Type, relative: number, value: string) => {
    const before = segment.slice(0, relative)
    const extraLines = before.includes('\n') ? before.split('\n').length - 1 : 0
    tokens.push({ type, pos: start + relative, value, line: line + extraLines })
  }

  // --- Detect comment: leading optional whitespace then /* ... */
  // --- Comment detection without trimStart allocation: skip leading whitespace then test for '/*'.
  let wsScan = 0
  while (wsScan < segment.length && /\s/.test(segment[wsScan])) wsScan++
  if (segment.startsWith('/*', wsScan)) {
    const closeIndex = segment.indexOf('*/', wsScan + 2)
    if (closeIndex !== -1) return tokens // skip comment entirely
    push(GoTmpl.Token.Type.Error, 0, 'unterminated comment')
    return tokens
  }

  // --- Iterate over segment characters to produce tokens.
  while (offset < segment.length) {
    const c = segment[offset]

    // --- Whitespace -> space token (collapse consecutive)
    if (/\s/.test(c)) {
      const start = offset
      while (offset < segment.length && /\s/.test(segment[offset])) offset++
      push(GoTmpl.Token.Type.Space, start, segment.slice(start, offset))
    }

    // Dot / field / identifier handling consolidated.
    else if (c === '.') {
      // Field chain starts with dot + ident start.
      if (isIdentifierStart(segment[offset + 1] || '')) {
        const startField = offset
        offset += 1 // consume '.'
        while (offset < segment.length) {
          if (!isIdentifierStart(segment[offset] || '')) break
          offset++
          while (offset < segment.length && isIdentifierChar(segment[offset])) offset++
          if (segment[offset] === '.' && isIdentifierStart(segment[offset + 1] || '')) { offset++; continue }
          break
        }
        push(GoTmpl.Token.Type.Field, startField, segment.slice(startField, offset))
      }
      else {
        push(GoTmpl.Token.Type.Dot, offset, '.')
        offset++
      }
    }

    // Identifier / keyword
    else if (isIdentifierStart(c)) {
      const start = offset
      offset++
      while (offset < segment.length && isIdentifierChar(segment[offset])) offset++
      const identifier = segment.slice(start, offset)
      const type: GoTmpl.Token.Type = KEYWORDS[identifier] ?? GoTmpl.Token.Type.Identifier
      push(type, start, identifier)
    }

    // --- Variable.
    else if (c === '$') {
      const start = offset
      offset++
      while (offset < segment.length && /\w/.test(segment[offset])) offset++
      push(GoTmpl.Token.Type.Variable, start, segment.slice(start, offset))
    }

    // --- Raw string using backticks.
    else if (c === '`') {
      const start = offset
      offset++
      while (offset < segment.length && segment[offset] !== '`') offset++
      if (offset < segment.length) offset++ // consume closing backtick
      push(GoTmpl.Token.Type.RawString, start, segment.slice(start, offset))
    }

    // --- Pipe
    else if (c === '|') {
      push(GoTmpl.Token.Type.Pipe, offset, '|')
      offset++
    }

    // --- Comma.
    else if (c === ',') {
      push(GoTmpl.Token.Type.Comma, offset, ',')
      offset++
    }

    // --- Parentheses.
    else if (c === '(') {
      push(GoTmpl.Token.Type.LeftParen, offset, '(')
      offset++
    }
    else if (c === ')') {
      push(GoTmpl.Token.Type.RightParen, offset, ')')
      offset++
    }

    // --- ColonEquals
    else if (c === ':' && segment[offset + 1] === '=') {
      push(GoTmpl.Token.Type.ColonEquals, offset, ':=')
      offset += 2
    }

    // --- Number (integer and float with optional underscores and dots)
    else if (isDigit(c)) {
      const start = offset
      offset++
      while (offset < segment.length && isDigitChar(segment[offset])) offset++
      push(GoTmpl.Token.Type.Number, start, segment.slice(start, offset))
    }

    // --- Quoted string with minimal escape handling ("\"" allowed)
    else if (c === '"') {
      const start = offset
      offset++ // consume opening quote
      let escaped = false
      while (offset < segment.length) {
        const c = segment[offset]
        if (!escaped && c === '"') { offset++; break }
        if (!escaped && c === '\\') { escaped = true; offset++; continue }
        escaped = false
        offset++
      }
      push(GoTmpl.Token.Type.StringLiteral, start, segment.slice(start, offset))
    }

    // --- Fallback unknown char -> error token
    else {
      push(GoTmpl.Token.Type.Error, offset, `unexpected character: ${c}`)
      offset++
    }
  }
  return tokens
}
