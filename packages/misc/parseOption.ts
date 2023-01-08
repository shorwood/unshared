/**
 * Parse a command line option and return it's object representation.
 * @param option The option to parse.
 * @param value The value of the option.
 * @returns The object representation of the option.
 * @example
 * parseOption('-f') // returns { f: true }
 * parseOption('-fbq') // returns { f: true, b: true, q: true }
 * parseOption('--foo', 'bar') // returns { foo: 'bar' }
 * parseOption('--foo.bar', 'baz') // returns { foo: { bar: 'baz' } }
 */
export const parseOption = <T extends Record<string, any>>(option: string, value?: string): T => {
  const result: Record<string, any> = {}

  // --- If the option is a flag or a group of flags, set it/them to true.
  if (/^-[\da-z]+$/i.test(option)) {
    for (const flag of option.slice(1))
      result[flag] = true
  }

  // --- If the option has a dot, it's a nested option.
  else if (option.includes('.')) {
    const [head, ...tail] = option.split('.')
    const key = tail.join('.')
    result[head.replace(/^--/, '')] = parseOption(key, value)
  }

  // --- If the option has no dot, it's a simple option.
  else {
    result[option.replace(/^--/, '')] = value || true
  }

  // --- Return the result.
  return result as T
}
