/**
 * Import a module from an inline script.
 *
 * @param script The script to import from.
 * @returns The imported module.
 */
export async function importInline<T>(script: string): Promise<T> {
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const { randomUUID } = await import('node:crypto')
  const { writeFile, mkdir, rm } = await import('node:fs/promises')

  // --- Create a temporary module file.
  const moduleDirectory = tmpdir()
  const modulePath = `${join(moduleDirectory, randomUUID())}.js`
  await mkdir(moduleDirectory, { recursive: true })
  await writeFile(modulePath, script)

  // --- Import the module and remove the temporary file.
  const result = await import(modulePath)
  await rm(modulePath, { recursive: true })
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should import the default export from an inline CommonJS script', async() => {
    vi.unmock('node:fs/promises')
    const script = 'module.exports = { foo: "bar" }'
    const result = await importInline<any>(script)
    expect(result.foo).toStrictEqual('bar')
    expect(result.default).toEqual({ foo: 'bar' })
  })

  it('should import the default export from an inline ES module script', async() => {
    const script = 'export default { foo: "bar" }'
    const result = await importInline<any>(script)
    expect(result.default).toStrictEqual({ foo: 'bar' })
  })

  it('should import the default export from an inline ES module script with multiple exports', async() => {
    const script = 'export const foo = "bar"; export default { foo }'
    const result = await importInline<any>(script)
    expect(result.foo).toStrictEqual('bar')
    expect(result.default).toStrictEqual({ foo: 'bar' })
  })

  it('should import export objects from an inline ES module script', async() => {
    const script = 'const foo = "bar"; const baz = "qux"; export { foo, baz }'
    const result = await importInline<any>(script)
    expect(result.foo).toStrictEqual('bar')
    expect(result.baz).toStrictEqual('qux')
  })
}
