import { escapeRegexp } from './escapeRegexp'

describe('escapeRegexp', () => {
  test('should escape RegExp special characters', () => {
    const result = escapeRegexp('foo$foo(foo)foo*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo')
    const expected = String.raw`foo\$foo\(foo\)foo\*foo\+foo\.foo\?foo\[foo\]foo\^foo\{foo\}foo\|foo`
    expect(result).toStrictEqual(expected)
  })

  test('should only escape the specified RegExp special characters', () => {
    const result = escapeRegexp('foo$foo(foo)foo*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo', ['*'])
    const expected = String.raw`foo$foo(foo)foo\*foo+foo.foo?foo[foo]foo^foo{foo}foo|foo`
    expect(result).toStrictEqual(expected)
  })
})
