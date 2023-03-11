/**
 * Import a module from an inline script using `eval()`
 *
 * @param script The script to import from.
 * @returns The imported module.
 */
export function importEval<T>(script: string): T {
  if (typeof script !== 'string')
    throw new TypeError('The script must be a string.')

  // eslint-disable-next-line prefer-const
  let __module: T | undefined = {} as T

  // eslint-disable-next-line no-new-func
  const scriptToEval = script
    .replace(/module.exports/g, '__module')
    .replace(/export default/g, '__module.default=')
    .replace(/export\s+(const|let|var)\s+(\S+)/g, '$1 $2=__module.$2')
    .replace(/export\s+(?={.+?})/gs, '__module=')

  // eslint-disable-next-line no-eval
  eval(scriptToEval)

  // Throw an error if no exports were found.
  if (__module === undefined)
    throw new Error('Could not import module from inline script.')

  // Return the imported module.
  return __module
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should import the default export from an inline CommonJS script', () => {
    const script = 'module.exports = { foo: "bar" }'
    const result = importEval(script)
    expect(result).toEqual({ foo: 'bar' })
  })

  it('should import the default export from an inline ES module script', () => {
    const script = 'export default { foo: "bar" }'
    const result = importEval(script)
    expect(result).toEqual({ default: { foo: 'bar' } })
  })

  it('should import the default export from an inline ES module script with multiple exports', () => {
    const script = 'export const foo = "bar"; export default { foo }'
    const result = importEval(script)
    expect(result).toEqual({ foo: 'bar', default: { foo: 'bar' } })
  })

  it('should import export objects from an inline ES module script', () => {
    const script = 'export { foo: "bar", baz: "qux" }'
    const result = importEval(script)
    expect(result).toEqual({ foo: 'bar', baz: 'qux' })
  })

  it('should throw if the script is not a string', () => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => importEval(123)
    expect(shouldThrow).toThrow(TypeError)
  })
}
