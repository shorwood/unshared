import { escapeRegexp } from './escapeRegexp'

/**
 * Create a RegExp from a [globstar](https://en.wikipedia.org/wiki/Glob_(programming)) pattern.
 * The pattern can contain POSIX bracket expressions, wildcards, globstars, and negations.
 *
 * @param pattern The pattern to create a RegExp from.
 * @returns The RegExp.
 * @example createPatternRegexp('foo*') // /^foo.*$/
 */
export function createPatternRegexp(pattern: string): RegExp {
  const patternExp = escapeRegexp(pattern, ['\\', '^', '$', '.', '|', '+', '(', ')'])
    // --- Globstar(s)
    .replaceAll(/(\*+)(\/)?/g, (_, asterisk) => (asterisk.length === 1 ? '[^/]+' : '.*?/?'))

    // --- Wildcard
    .replaceAll(/{(.+?)}/g, (_, p1) => `(?:${p1.replaceAll(',', '|')})`)

    // --- Remove leading !
    .replace(/^!/, '')

    // --- Normalize paths
    .replace(/^\\.\//, '')
    .replaceAll(/\/+/g, '/')
    .replace(/\/$/, '')

    // --- POSIX bracket expressions
    .replaceAll('[[:alnum:]]', '[\\dA-Za-z]')
    .replaceAll('[[:alpha:]]', '[A-Za-z]')
    .replaceAll('[[:ascii:]]', '[\\u0000-\\u007F]')
    .replaceAll('[[:blank:]]', '[\\t ]')
    .replaceAll('[[:cntrl:]]', '[\\u0000-\\u001F\\u007F]')
    .replaceAll('[[:digit:]]', '\\d')
    .replaceAll('[[:graph:]]', '[\\u0021-\\u007E]')
    .replaceAll('[[:lower:]]', '[a-z]')
    .replaceAll('[[:print:]]', '[\\u0020-\\u007E]')
    .replaceAll('[[:punct:]]', '[\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E]')
    .replaceAll('[[:space:]]', '[\\t\\n\\v\\f\\r ]')
    .replaceAll('[[:upper:]]', '[A-Z]')
    .replaceAll('[[:word:]]', '\\w')
    .replaceAll('[[:xdigit:]]', '[\\dA-Fa-f]')

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
  it('should create RegExp from globstar pattern', () => {
    const result = createPatternRegexp('foo*')
    expect(result).toEqual(/^foo[^/]+$/)
  })

  it('should create RegExp from pattern with brackets', () => {
    const result = createPatternRegexp('foo[abr]')
    expect(result).toEqual(/^foo[abr]$/)
  })

  it('should create RegExp from pattern with question mark', () => {
    const result = createPatternRegexp('foo?bar')
    expect(result).toEqual(/^foo?bar$/)
  })

  it('should create RegExp with wildcard', () => {
    const result = createPatternRegexp('{foo,bar}')
    expect(result).toEqual(/^(?:foo|bar)$/)
  })

  it('should create RegExp with multiple wildcards', () => {
    const result = createPatternRegexp('{foo,bar,baz,qux}')
    expect(result).toEqual(/^(?:foo|bar|baz|qux)$/)
  })

  it('should create RegExp with [[:alnum:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:alnum:]]')
    expect(result).toEqual(/^foo[\dA-Za-z]$/)
  })

  it('should create RegExp with [[:alpha:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:alpha:]]')
    expect(result).toEqual(/^foo[A-Za-z]$/)
  })

  it('should create RegExp with [[:ascii:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:ascii:]]')
    // eslint-disable-next-line no-control-regex
    expect(result).toEqual(/^foo[\u0000-\u007F]$/)
  })

  it('should create RegExp with [[:blank:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:blank:]]')
    expect(result).toEqual(/^foo[\t ]$/)
  })

  it('should create RegExp with [[:cntrl:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:cntrl:]]')
    // eslint-disable-next-line no-control-regex
    expect(result).toEqual(/^foo[\u0000-\u001F\u007F]$/)
  })

  it('should create RegExp with [[:digit:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:digit:]]')
    expect(result).toEqual(/^foo\d$/)
  })

  it('should create RegExp with [[:graph:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:graph:]]')
    expect(result).toEqual(/^foo[\u0021-\u007E]$/)
  })

  it('should create RegExp with [[:lower:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:lower:]]')
    expect(result).toEqual(/^foo[a-z]$/)
  })

  it('should create RegExp with [[:print:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:print:]]')
    expect(result).toEqual(/^foo[\u0020-\u007E]$/)
  })

  it('should create RegExp with [[:punct:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:punct:]]')
    expect(result).toEqual(/^foo[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]$/)
  })

  it('should create RegExp with [[:space:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:space:]]')
    expect(result).toEqual(/^foo[\t\n\v\f\r ]$/)
  })

  it('should create RegExp with [[:upper:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:upper:]]')
    expect(result).toEqual(/^foo[A-Z]$/)
  })

  it('should create RegExp with [[:word:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:word:]]')
    expect(result).toEqual(/^foo\w$/)
  })

  it('should create RegExp with [[:xdigit:]] POSIX bracket expressions', () => {
    const result = createPatternRegexp('foo[[:xdigit:]]')
    expect(result).toEqual(/^foo[\dA-Fa-f]$/)
  })

  it('should create RegExp from pattern with negation', () => {
    const result = createPatternRegexp('!foo*')
    const testPositive = result.test('foobar')
    const testNegative = result.test('barfoo')
    expect(testPositive).toBe(false)
    expect(testNegative).toBe(true)
  })

  it('should escape certain RegExp special characters', () => {
    const result = createPatternRegexp('foo$foo(foo)foo*foo+foo.foo?foo[fo]foo^foo{foo}foo|foo')
    // eslint-disable-next-line unicorn/better-regex
    const expected = /^foo\$foo\(foo\)foo[^/]+foo\+foo\.foo?foo[fo]foo\^foo(?:foo)foo\|foo$/
    expect(result).toEqual(expected)
  })
}
