import { escapeRegex } from './escapeRegex'

/**
 * Create a RegExp from a string pattern.
 *
 * @param pattern The pattern to create a RegExp from.
 * @returns The RegExp.
 * @example patternRegexp('foo*') // /^foo.*$/
 */
export function patternRegex(pattern: string): RegExp {
  const patternExp = escapeRegex(pattern, ['\\', '^', '$', '.', '|', '+', '(', ')'])
  // --- Globstar(s)
    .replace(/(\*+)(\/)?/g, (_, asterisk) => (asterisk.length === 1 ? '[^/]+' : '.*?/?'))

    // --- Wildcard
    .replace(/{(.+?)}/g, (_, p1) => `(?:${p1.replace(',', '|')})`)

    // --- Remove leading !
    .replace(/^!/, '')

    // --- Normalize paths
    .replace(/^\\.\//, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')

    // --- POSIX bracket expressions
    .replace(/\[\[:alnum:]]/g, '[a-zA-Z0-9]')
    .replace(/\[\[:alpha:]]/g, '[a-zA-Z]')
    .replace(/\[\[:ascii:]]/g, '[\\x00-\\x7F]')
    .replace(/\[\[:blank:]]/g, '[\\t ]')
    .replace(/\[\[:cntrl:]]/g, '[\\x00-\\x1F\\x7F]')
    .replace(/\[\[:digit:]]/g, '[0-9]')
    .replace(/\[\[:graph:]]/g, '[\\x21-\\x7E]')
    .replace(/\[\[:lower:]]/g, '[a-z]')
    .replace(/\[\[:print:]]/g, '[\\x20-\\x7E]')
    .replace(/\[\[:punct:]]/g, '[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E]')
    .replace(/\[\[:space:]]/g, '[\\t\\n\\v\\f\\r ]')
    .replace(/\[\[:upper:]]/g, '[A-Z]')
    .replace(/\[\[:word:]]/g, '[a-zA-Z0-9_]')
    .replace(/\[\[:xdigit:]]/g, '[a-fA-F0-9]')

  // --- Return the RegExp.
  const regexp = new RegExp(`^${patternExp}$`)
  if (pattern.startsWith('!') === false) return regexp

  // --- Negate the RegExp.
  const originalTest = regexp.test
  regexp.test = (value: string) => !originalTest.call(regexp, value)
  return regexp
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create RegExp from pattern', () => {
    const result = patternRegex('foo*')
    expect(result).toEqual(/^foo.*$/)
  })

  it('should create RegExp from pattern with brackets', () => {
    const result = patternRegex('foo[abr]')
    expect(result).toEqual(/^foo[abr]$/)
  })

  it('should create RegExp from pattern with question mark', () => {
    const result = patternRegex('foo?bar')
    expect(result).toEqual(/^foo?bar$/)
  })

  it('should create RegExp with capture groups', () => {
    const result = patternRegex('{foo,bar}')
    expect(result).toEqual(/^(?:foo|bar)$/)
  })

  it('should create RegExp from pattern with negation', () => {
    const result = patternRegex('!foo*')
    expect(result).toEqual(/^(?!foo.*)$/)
  })

  it('should escape certain RegExp special characters', () => {
    const result = patternRegex('foo$foo(foo)foo*foo+foo.foo?foo[fo]foo^foo{foo}foo|foo')
    const expected = /^foo\$foo\(foo\)foo.*foo\+foo\.foo?foo[fo]foo\^foo{foo}foo\|foo$/
    expect(result).toEqual(expected)
  })
}
