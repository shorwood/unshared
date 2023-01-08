/**
 * Import a module from an inline script using `eval()`
 * @param script The script to import from.
 * @returns The imported module.
 */
export function importEval<T>(script: string): T {
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
