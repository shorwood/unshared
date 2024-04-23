/**
 * Parse a command line option and return it's object representation.
 *
 * @param option The option to parse.
 * @param value The value of the option.
 * @returns The object representation of the option.
 * @example
 * parseOption('-f') // returns { f: true }
 * parseOption('-fbq') // returns { f: true, b: true, q: true }
 * parseOption('--foo', 'bar') // returns { foo: 'bar' }
 * parseOption('--foo.bar', 'baz') // returns { foo: { bar: 'baz' } }
 */
export function parseOption<T extends Record<string, unknown>>(option: string, value?: string): T {
  const result: Record<string, unknown> = {}

  // --- If the option is a flag or a group of flags, set it/them to true.
  if (/^-[\da-z]+$/i.test(option)) {
    for (const flag of option.slice(1))
      result[flag] = value ?? true
  }

  // --- If the option has a dot, it's a nested option.
  else if (option.includes('.')) {
    const [head, ...tail] = option.split('.')
    const key = tail.join('.')
    result[head.replace(/^--/, '')] = parseOption(key, value)
  }

  // --- If the option has no dot, it's a simple option.
  else {
    result[option.replace(/^--/, '')] = value ?? true
  }

  // --- Return the result.
  return result as T
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('simple', () => {
    it('should parse a simple option as a flag', () => {
      const result = parseOption('--foo')
      expect(result).toEqual({ foo: true })
    })

    it('should parse a simple option with a value', () => {
      const result = parseOption('--foo', 'bar')
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  describe('nested', () => {
    it('should parse a nested option as a flag', () => {
      const result = parseOption('--foo.bar')
      expect(result).toEqual({ foo: { bar: true } })
    })

    it('should parse a nested option with a value', () => {
      const result = parseOption('--foo.bar', 'baz')
      expect(result).toEqual({ foo: { bar: 'baz' } })
    })

    it('should parse a deeply nested option', () => {
      const result = parseOption('--foo.bar.baz.qux', 'quux')
      expect(result).toEqual({ foo: { bar: { baz: { qux: 'quux' } } } })
    })
  })

  describe('short', () => {
    it('should parse one short option as a flag', () => {
      const result = parseOption('-f')
      expect(result).toEqual({ f: true })
    })

    it('should parse one short option with a value', () => {
      const result = parseOption('-f', 'bar')
      expect(result).toEqual({ f: 'bar' })
    })

    it('should parse multiple short options as flags', () => {
      const result = parseOption('-fbq')
      expect(result).toEqual({ f: true, b: true, q: true })
    })

    it('should parse multiple short options with value', () => {
      const result = parseOption('-fbq', 'bar')
      expect(result).toEqual({ f: 'bar', b: 'bar', q: 'bar' })
    })
  })
}
