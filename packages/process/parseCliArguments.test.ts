import { parseCliArguments } from './parseCliArguments'

describe('parseCliArguments', () => {
  test('should parse one argument', () => {
    const result = parseCliArguments(['/node', 'index.js', 'foo'])
    expect(result).toStrictEqual({
      nodePath: '/node',
      options: {},
      parameters: ['foo'],
      scriptPath: 'index.js',
    })
  })

  test('should parse multiple arguments', () => {
    const result = parseCliArguments(['/node', 'index.js', 'foo', 'bar'])
    expect(result).toStrictEqual({
      nodePath: '/node',
      options: {},
      parameters: ['foo', 'bar'],
      scriptPath: 'index.js',
    })
  })

  describe('options', () => {
    it('should parse one boolean option', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo'])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { foo: true },
        parameters: [],
        scriptPath: 'index.js',
      })
    })

    it('should parse multiple boolean options', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo', '--bar'])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { bar: true, foo: true },
        parameters: [],
        scriptPath: 'index.js',
      })
    })

    it('should parse nested options', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo.bar', 'baz'])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { foo: { bar: 'baz' } },
        parameters: [],
        scriptPath: 'index.js',
      })
    })

    it('should parse short options', () => {
      const result = parseCliArguments(['/node', 'index.js', '-f'])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { f: true },
        parameters: [],
        scriptPath: 'index.js',
      })
    })

    it('should parse multiple short options', () => {
      const result = parseCliArguments(['/node', 'index.js', '-f', '-b'])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { b: true, f: true },
        parameters: [],
        scriptPath: 'index.js',
      })
    })
  })

  describe('mixed', () => {
    it('should parse options and arguments', () => {
      const result = parseCliArguments([
        '/node',
        'index.js',
        'baz',
        '-fbq',
        '--foo',
        'bar',
        '--bar',
      ])
      expect(result).toStrictEqual({
        nodePath: '/node',
        options: { b: true, bar: true, f: true, foo: 'bar', q: true },
        parameters: ['baz'],
        scriptPath: 'index.js',
      })
    })
  })
})
