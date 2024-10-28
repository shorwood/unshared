import { escapeRegexp } from './escapeRegexp'

/**
 * Create a RegExp from a [globstar](https://en.wikipedia.org/wiki/Glob_(programming)) pattern.
 * The pattern can contain POSIX bracket expressions, wildcards, globstars, and negations.
 *
 * @param pattern The pattern to create a RegExp from.
 * @returns The RegExp.
 * @example createPattern('foo*') // /^foo.*$/
 */
export function createPattern(pattern: string): RegExp {
  const patternExp = escapeRegexp(pattern, ['\\', '^', '$', '.', '|', '+', '(', ')'])

  // --- Normalize paths
    .replace(/^\\.\//, '')
    .replaceAll(/\/+/g, '/')
    .replace(/\/$/, '')

    // --- Globstar(s)
    .replaceAll(/(\/)?(\*+)(\/)?/g, (_, ...matches) => {
      const [$1 = '', $2 = '', $3 = ''] = matches as [string, string, string]
      return $2.length === 1 ? `${$1}[^/]+${$3}` : `${$1}.+${$3}`
    })

    // --- Wildcard
    .replaceAll(/{([^{}]*)}/g, (_, p1: string) => `(?:${p1.replaceAll(',', '|')})`)

    // --- Remove leading !
    .replace(/^!/, '')

    // --- POSIX bracket expressions
    .replaceAll('[[:alnum:]]', String.raw`[\dA-Za-z]`)
    .replaceAll('[[:alpha:]]', '[A-Za-z]')
    .replaceAll('[[:ascii:]]', String.raw`[\u0000-\u007F]`)
    .replaceAll('[[:blank:]]', String.raw`[\t ]`)
    .replaceAll('[[:cntrl:]]', String.raw`[\u0000-\u001F\u007F]`)
    .replaceAll('[[:digit:]]', String.raw`\d`)
    .replaceAll('[[:graph:]]', String.raw`[\u0021-\u007E]`)
    .replaceAll('[[:lower:]]', '[a-z]')
    .replaceAll('[[:print:]]', String.raw`[\u0020-\u007E]`)
    .replaceAll('[[:punct:]]', String.raw`[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]`)
    .replaceAll('[[:space:]]', String.raw`[\t\n\v\f\r ]`)
    .replaceAll('[[:upper:]]', '[A-Z]')
    .replaceAll('[[:word:]]', String.raw`\w`)
    .replaceAll('[[:xdigit:]]', String.raw`[\dA-Fa-f]`)

  // --- Return the RegExp.
  const regexp = new RegExp(`^${patternExp}$`)
  if (pattern.startsWith('!') === false) return regexp

  // --- If the pattern is negated, return a negated RegExp.
  const originalTest = regexp.test.bind(regexp)
  regexp.test = (value: string) => !originalTest.call(regexp, value)
  return regexp
}
