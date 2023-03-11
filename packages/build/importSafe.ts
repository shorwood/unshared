/* eslint-disable @typescript-eslint/consistent-type-imports */

/**
 * Imports a module using `import()`, but doesn't throw an error the module
 * doesn't exist. Instead, it returns an empty object to allow destructuring.
 *
 * @param moduleId The id of the module to require
 * @returns The required module, or an empty object if it couldn't be imported
 * @example const { readFile } = await importSafe('node:fs/promises')
 */
export async function importSafe(moduleId: 'node:fs'): Promise<Partial<typeof import('node:fs')>>
export async function importSafe(moduleId: 'node:fs/promises'): Promise<Partial<typeof import('node:fs/promises')>>
export async function importSafe(moduleId: 'node:crypto'): Promise<Partial<typeof import('node:crypto')>>
export async function importSafe(moduleId: 'node:child_process'): Promise<Partial<typeof import('node:child_process')>>
export async function importSafe(moduleId: 'node:path'): Promise<Partial<typeof import('path')>>
export async function importSafe(moduleId: 'node:url'): Promise<Partial<typeof import('node:url')>>
export async function importSafe(moduleId: 'node:http'): Promise<Partial<typeof import('node:http')>>
export async function importSafe(moduleId: 'node:https'): Promise<Partial<typeof import('node:https')>>
export async function importSafe(moduleId: 'node:dgram'): Promise<Partial<typeof import('node:dgram')>>
export async function importSafe(moduleId: 'node:dns'): Promise<Partial<typeof import('node:dns')>>
export async function importSafe(moduleId: 'node:net'): Promise<Partial<typeof import('node:net')>>
export async function importSafe(moduleId: 'node:tls'): Promise<Partial<typeof import('node:tls')>>
export async function importSafe(moduleId: 'node:readline'): Promise<Partial<typeof import('node:readline')>>
export async function importSafe(moduleId: 'node:repl'): Promise<Partial<typeof import('node:repl')>>
export async function importSafe(moduleId: 'node:stream'): Promise<Partial<typeof import('stream')>>
export async function importSafe(moduleId: 'node:string_decoder'): Promise<Partial<typeof import('node:string_decoder')>>
export async function importSafe(moduleId: 'node:worker_threads'): Promise<Partial<typeof import('node:worker_threads')>>
export async function importSafe(moduleId: 'node:util'): Promise<Partial<typeof import('node:util')>>
export async function importSafe(moduleId: 'node:zlib'): Promise<Partial<typeof import('node:zlib')>>
export async function importSafe(moduleId: 'node:tty'): Promise<Partial<typeof import('node:tty')>>
export async function importSafe(moduleId: 'node:cluster'): Promise<Partial<typeof import('node:cluster')>>
export async function importSafe(moduleId: 'node:os'): Promise<Partial<typeof import('node:os')>>
export async function importSafe(moduleId: 'node:process'): Promise<Partial<typeof import('node:process')>>
export async function importSafe(moduleId: 'node:querystring'): Promise<Partial<typeof import('node:querystring')>>
export async function importSafe(moduleId: 'node:stream'): Promise<Partial<typeof import('stream')>>
export async function importSafe(moduleId: 'node:v8'): Promise<Partial<typeof import('node:v8')>>
export async function importSafe(moduleId: 'node:vm'): Promise<Partial<typeof import('node:vm')>>
export async function importSafe<T = unknown>(moduleId: string): Promise<Partial<T>>
export async function importSafe<T = unknown>(moduleId: string): Promise<Partial<T>> {
  try { return await import(moduleId) }
  catch { return {} as Partial<T> }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should should require an existing module', async() => {
    const result = await importSafe('node:fs')
    const expected = await import('node:fs')
    expect(result).toStrictEqual(expected)
    expectTypeOf(result.readFile).toEqualTypeOf<typeof expected.readFile | undefined>()
  })

  it('should should not require a non-existing module', async() => {
    const result = await importSafe('not-a-real-module')
    expect(result).toEqual({})
    expectTypeOf(result).toEqualTypeOf<Partial<unknown>>()
  })

  it('should provide generic type', async() => {
    const result = await importSafe<{ foo: 'foo' }>('not-a-real-module')
    expectTypeOf(result.foo).toEqualTypeOf<'foo' | undefined>()
  })
}
