import { parseOption } from './parseCliOption'

export interface ParseArgvReturnType<T extends object> {

  /**
   * The path to the Node.js executable.
   */
  nodePath: string

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
export function parseCliArguments<T extends object>(argv = process.argv): ParseArgvReturnType<T> {
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
      const value = next && !next.startsWith('-') ? next : undefined
      const option = parseOption(parameter, value)
      // eslint-disable-next-line sonarjs/updated-loop-counter
      if (value) index += 1
      Object.assign(options, option)
    }

    // --- Otherwise, it's a simple argument.
    else { parameters.push(argvParameters[index]) }
  }

  // --- Return the result.
  return { nodePath, options, parameters, scriptPath }
}
