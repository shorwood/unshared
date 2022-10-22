/* eslint-disable unicorn/prevent-abbreviations */
import { parseOption } from './parseOption'

export interface ParseArgvReturnType<T extends Record<string, any> = any> {
  /**
   * Extracted options.
   * @example
   * parseArgv(['-f', '-b', '-q', '--foo', 'bar', 'baz']) // returns { f: true, b: true, q: true, foo: 'bar' }
   */
  options: T
  /**
   * Arguments that are not options.
   * @example
   * parseArgv(['-f', '-b', '-q', '--foo', 'bar', 'baz']) // returns ['baz']
   */
  args: string[]
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
 * @param argv The command line argv.
 * @returns An object with options mapped to an object.
 * @example
 * parseArgv(['-f', '-bq', '--foo', 'bar', 'baz']) // returns { f: true, b: true, q: true, foo: 'bar' }
 */
export const parseArgv = <T extends Record<string, any>>(argv: NodeJS.Process['argv']): ParseArgvReturnType<T> => {
  const parsedArgs = [] as string[]
  const parsedOptions = {} as T
  const [nodePath, scriptPath, ...args] = argv

  // --- Parse the argv.
  for (let index = 0; index < args.length; index++) {
    const argument = args[index]

    // --- If the parameter starts with a dash, it's an option.
    if (argument.startsWith('-')) {
      const next = args[index + 1]

      // --- Parse option and increment the index if option has a value.
      const parsedOption = next && !next.startsWith('-')
        ? (index++, parseOption(argument, next))
        : parseOption(argument)

      // --- Merge the option into the result.
      Object.assign(parsedOptions, parsedOption)
    }

    // --- Otherwise, it's an argument.
    else { parsedArgs.push(args[index]) }
  }

  // --- Return the result.
  return {
    args: parsedArgs,
    options: parsedOptions,
    nodePath,
    scriptPath,
  }
}
