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
    .replaceAll(/(\/)?(\*+)(\/)?/g, (_, $1 = '', $2: string, $3 = '') =>
      ($2.length === 1 ? `${$1}[^/]+${$3}` : `(:?\/?.*${$3})?`))

    // --- Wildcard
    .replaceAll(/{(.+?)}/g, (_, p1: string) => `(?:${p1.replaceAll(',', '|')})`)

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

/* v8 ignore next */
if (import.meta.vitest) {

  describe('globstar', () => {
    it('should create RegExp from globstar pattern', () => {
      const result = createPattern('foo/*')
      const test = result.test('foo/bar')
      expect(result).toStrictEqual(/^foo\/[^/]+$/)
      expect(test).toBe(true)
    })

    it('should create RegExp from double globstar pattern', () => {
      const result = createPattern('foo/**')
      const test = result.test('foo/bar/baz')
      expect(result).toStrictEqual(/^foo(:?\/?.*)?$/)
      expect(test).toBe(true)
    })

    it('should create RegExp for nested paths with file extension', () => {
      const result = createPattern('*/*.ts')
      const test = result.test('foo/bar.ts')
      expect(result).toStrictEqual(/^[^/]+\/[^/]+\.ts$/)
      expect(test).toBe(true)
    })

    it('should create RegExp for deeply nested paths with file extension', () => {
      const result = createPattern('**/src/*.ts')
      const test = result.test('foo/bar/src/baz.ts')
      expect(result).toStrictEqual(/^(:?\/?.*\/)?src\/[^/]+\.ts$/)
      expect(test).toBe(true)
    })
  })

  describe('wildcard', () => {
    it('should create RegExp from pattern with brackets', () => {
      const result = createPattern('foo[abr]')
      expect(result).toStrictEqual(/^foo[abr]$/)
    })

    it('should create RegExp from pattern with question mark', () => {
      const result = createPattern('foo?bar')
      expect(result).toStrictEqual(/^foo?bar$/)
    })

    it('should create RegExp with wildcard', () => {
      const result = createPattern('{foo,bar}')
      expect(result).toStrictEqual(/^(?:foo|bar)$/)
    })

    it('should create RegExp with multiple wildcards', () => {
      const result = createPattern('{foo,bar,baz,qux}')
      expect(result).toStrictEqual(/^(?:foo|bar|baz|qux)$/)
    })
  })

  describe('pOSIX', () => {
    it('should create RegExp with [[:alnum:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:alnum:]]')
      expect(result).toStrictEqual(/^foo[\dA-Za-z]$/)
    })

    it('should create RegExp with [[:alpha:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:alpha:]]')
      expect(result).toStrictEqual(/^foo[A-Za-z]$/)
    })

    it('should create RegExp with [[:ascii:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:ascii:]]')
      // eslint-disable-next-line no-control-regex
      expect(result).toStrictEqual(/^foo[\u0000-\u007F]$/)
    })

    it('should create RegExp with [[:blank:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:blank:]]')
      expect(result).toStrictEqual(/^foo[\t ]$/)
    })

    it('should create RegExp with [[:cntrl:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:cntrl:]]')
      // eslint-disable-next-line no-control-regex
      expect(result).toStrictEqual(/^foo[\u0000-\u001F\u007F]$/)
    })

    it('should create RegExp with [[:digit:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:digit:]]')
      expect(result).toStrictEqual(/^foo\d$/)
    })

    it('should create RegExp with [[:graph:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:graph:]]')
      expect(result).toStrictEqual(/^foo[\u0021-\u007E]$/)
    })

    it('should create RegExp with [[:lower:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:lower:]]')
      expect(result).toStrictEqual(/^foo[a-z]$/)
    })

    it('should create RegExp with [[:print:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:print:]]')
      expect(result).toStrictEqual(/^foo[\u0020-\u007E]$/)
    })

    it('should create RegExp with [[:punct:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:punct:]]')
      expect(result).toStrictEqual(/^foo[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]$/)
    })

    it('should create RegExp with [[:space:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:space:]]')
      expect(result).toStrictEqual(/^foo[\t\n\v\f\r ]$/)
    })

    it('should create RegExp with [[:upper:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:upper:]]')
      expect(result).toStrictEqual(/^foo[A-Z]$/)
    })

    it('should create RegExp with [[:word:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:word:]]')
      expect(result).toStrictEqual(/^foo\w$/)
    })

    it('should create RegExp with [[:xdigit:]] POSIX bracket expressions', () => {
      const result = createPattern('foo[[:xdigit:]]')
      expect(result).toStrictEqual(/^foo[\dA-Fa-f]$/)
    })
  })

  describe('edge cases', () => {
    it('should create RegExp from pattern with negation', () => {
      const result = createPattern('!foo*')
      const testPositive = result.test('foobar')
      const testNegative = result.test('barfoo')
      expect(testPositive).toBe(false)
      expect(testNegative).toBe(true)
    })

    it('should omit leading ./ from the pattern', () => {
      const result = createPattern('./foo/*')
      const test = result.test('foo/bar')
      expect(result).toStrictEqual(/^foo\/[^/]+$/)
      expect(test).toBe(true)
    })

    it('should remove duplicate slashes from the pattern', () => {
      const result = createPattern('foo//bar')
      const test = result.test('foo/bar')
      expect(result).toStrictEqual(/^foo\/bar$/)
      expect(test).toBe(true)
    })

    it('should remove trailing slash from the pattern', () => {
      const result = createPattern('foo/')
      const test = result.test('foo')
      expect(result).toStrictEqual(/^foo$/)
      expect(test).toBe(true)
    })

    it('should escape certain RegExp special characters', () => {
      const result = createPattern('foo$foo(foo)foo*foo+foo.foo?foo[fo]foo^foo{foo}foo|foo')
      // eslint-disable-next-line unicorn/better-regex
      const expected = /^foo\$foo\(foo\)foo[^/]+foo\+foo\.foo?foo[fo]foo\^foo(?:foo)foo\|foo$/
      expect(result).toStrictEqual(expected)
    })
  })
}
