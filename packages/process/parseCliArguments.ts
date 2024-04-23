import { argv as processArgv } from 'node:process'
import { parseOption } from './parseCliOption'

export interface ParseArgvReturnType<T extends object> {
  /**
   * Extracted options.
   *
   * @example
   * parseArgv(['-f', '-b', '-q', '--foo', 'bar', 'baz']) // returns { f: true, b: true, q: true, foo: 'bar' }
   */
  options: T
  /**
   * Arguments that are not options.
   *
   * @example
   * parseArgv(['-f', '-b', '-q', '--foo', 'bar', 'baz']) // returns ['baz']
   */
  parameters: string[]
  /**
   * The path to the Node.js executable.
   */
  nodePath: string
  /**
   * The path to the current script.
   */
  scriptPath: string
}

/**
 * Parses the command line argv.
 *
 * @param argv The command line argv.
 * @returns An object with options mapped to an object.
 * @example parseCliArguments(['-f', '-bq', '--foo', 'bar', 'baz']) // returns { f: true, b: true, q: true, foo: 'bar' }
 */
export function parseCliArguments<T extends object>(argv = processArgv): ParseArgvReturnType<T> {
  const parameters: string[] = []
  const options = {} as T
  const [nodePath, scriptPath, ...argvParameters] = argv

  // --- Traverse the parameters one by one.
  for (let index = 0; index < argvParameters.length; index++) {
    const parameter = argvParameters[index]

    // --- If the parameter starts with a dash, it's an option. If so,
    // --- get the next parameter as the value of the option and parse it.
    if (parameter.startsWith('-')) {
      const next = argvParameters[index + 1]
      const option = next && !next.startsWith('-')
        ? (index++, parseOption(parameter, next))
        : parseOption(parameter)
      Object.assign(options, option)
    }

    // --- Otherwise, it's a simple argument.
    else {
      parameters.push(argvParameters[index])
    }
  }

  // --- Return the result.
  return { parameters, options, nodePath, scriptPath }
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should parse one argument', () => {
    const result = parseCliArguments(['/node', 'index.js', 'foo'])
    expect(result).toEqual({
      parameters: ['foo'],
      options: {},
      nodePath: '/node',
      scriptPath: 'index.js',
    })
  })

  it('should parse multiple arguments', () => {
    const result = parseCliArguments(['/node', 'index.js', 'foo', 'bar'])
    expect(result).toEqual({
      parameters: ['foo', 'bar'],
      options: {},
      nodePath: '/node',
      scriptPath: 'index.js',
    })
  })

  describe('options', () => {
    it('should parse one boolean option', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo'])
      expect(result).toEqual({
        parameters: [],
        options: { foo: true },
        nodePath: '/node',
        scriptPath: 'index.js',
      })
    })

    it('should parse multiple boolean options', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo', '--bar'])
      expect(result).toEqual({
        parameters: [],
        options: { foo: true, bar: true },
        nodePath: '/node',
        scriptPath: 'index.js',
      })
    })

    it('should parse nested options', () => {
      const result = parseCliArguments(['/node', 'index.js', '--foo.bar', 'baz'])
      expect(result).toEqual({
        parameters: [],
        options: { foo: { bar: 'baz' } },
        nodePath: '/node',
        scriptPath: 'index.js',
      })
    })

    it('should parse short options', () => {
      const result = parseCliArguments(['/node', 'index.js', '-f'])
      expect(result).toEqual({
        parameters: [],
        options: { f: true },
        nodePath: '/node',
        scriptPath: 'index.js',
      })
    })

    it('should parse multiple short options', () => {
      const result = parseCliArguments(['/node', 'index.js', '-f', '-b'])
      expect(result).toEqual({
        parameters: [],
        options: { f: true, b: true },
        nodePath: '/node',
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
      expect(result).toEqual({
        parameters: ['baz'],
        options: { foo: 'bar', bar: true, f: true, b: true, q: true },
        nodePath: '/node',
        scriptPath: 'index.js',
      })
    })
  })
}
